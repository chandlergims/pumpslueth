import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Solution, { ISolution } from '@/models/Solution';
import Bounty, { IBounty } from '@/models/Bounty';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const solver = searchParams.get('solver');
    
    if (!solver) {
      return NextResponse.json(
        { error: 'Solver wallet address is required' },
        { status: 400 }
      );
    }
    
    // Find all solutions by this solver
    const solutions = await Solution.find({ solver }).sort({ createdAt: -1 }).lean();
    
    // Get bounty details for each solution
    const solutionsWithBountyDetails = await Promise.all(
      solutions.map(async (solution: any) => {
        // Use proper typing for the Mongoose document
        const bounty = await Bounty.findById(solution.bountyId).lean() as (IBounty & { _id: mongoose.Types.ObjectId }) | null;
        
        return {
          ...solution,
          bountyTitle: bounty ? bounty.title : 'Unknown Bounty',
          bountyAmount: bounty ? bounty.bountyAmount : 0
        };
      })
    );
    
    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    return NextResponse.json(
      { solutions: solutionsWithBountyDetails },
      { headers }
    );
  } catch (error: any) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}
