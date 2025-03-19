import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!body.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (!body.creator) {
      return NextResponse.json(
        { error: 'Creator wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!body.bountyAmount || body.bountyAmount < 0.1) {
      return NextResponse.json(
        { error: 'Bounty amount must be at least 0.1 SOL' },
        { status: 400 }
      );
    }
    
    // Create new bounty
    const bounty = new Bounty({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      creator: body.creator,
      bountyAmount: body.bountyAmount,
      status: 'open',
      views: 0
    });
    
    // Save bounty
    await bounty.save();
    
    return NextResponse.json({
      message: 'Bounty created successfully',
      bounty
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bounty:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create bounty' },
      { status: 500 }
    );
  }
}
