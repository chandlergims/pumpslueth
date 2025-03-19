import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';
import Solution from '@/models/Solution';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    const body = await req.json();
    
    // Validate required fields
    if (!body.solver) {
      return NextResponse.json(
        { error: 'Solver wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!body.solutionDetails) {
      return NextResponse.json(
        { error: 'Solution details are required' },
        { status: 400 }
      );
    }
    
    // Check if bounty exists and is open
    const bounty = await Bounty.findById(id);
    
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }
    
    if (bounty.status !== 'open') {
      return NextResponse.json(
        { error: 'This bounty is not open for solutions' },
        { status: 400 }
      );
    }
    
    // Check if user is the bounty creator
    if (bounty.creator === body.solver) {
      return NextResponse.json(
        { error: 'You cannot submit a solution to your own bounty' },
        { status: 400 }
      );
    }
    
    // Check if user already submitted a solution
    const existingSolution = await Solution.findOne({
      bountyId: id,
      solver: body.solver
    });
    
    if (existingSolution) {
      return NextResponse.json(
        { error: 'You have already submitted a solution for this bounty' },
        { status: 400 }
      );
    }
    
    // Create new solution
    const solution = new Solution({
      bountyId: id,
      solver: body.solver,
      solutionDetails: body.solutionDetails,
      imageUrls: body.imageUrls || [],
      status: 'pending',
      votes: 0,
      voters: []
    });
    
    // Save solution
    await solution.save();
    
    return NextResponse.json({
      message: 'Solution submitted successfully',
      solution
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting solution:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit solution' },
      { status: 500 }
    );
  }
}

// API endpoint for accepting a solution
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    const body = await req.json();
    
    // Validate required fields
    if (!body.solutionId) {
      return NextResponse.json(
        { error: 'Solution ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.creator) {
      return NextResponse.json(
        { error: 'Creator wallet address is required' },
        { status: 400 }
      );
    }
    
    // Check if bounty exists and is open
    const bounty = await Bounty.findById(id);
    
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the bounty creator
    if (bounty.creator !== body.creator) {
      return NextResponse.json(
        { error: 'Only the bounty creator can accept solutions' },
        { status: 403 }
      );
    }
    
    // Check if solution exists
    const solution = await Solution.findById(body.solutionId);
    
    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }
    
    // Update solution status
    solution.status = 'accepted';
    await solution.save();
    
    // Update bounty status
    bounty.status = 'solved';
    bounty.solver = solution.solver;
    await bounty.save();
    
    return NextResponse.json({
      message: 'Solution accepted successfully',
      solution,
      bounty
    });
  } catch (error: any) {
    console.error('Error accepting solution:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept solution' },
      { status: 500 }
    );
  }
}
