import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';
import Solution from '@/models/Solution';
import { cache } from 'react';

// Cache the database connection
const connectDB = cache(async () => {
  await dbConnect();
});

// Cache the bounty data for 1 minute
const getBountyData = cache(async (id: string) => {
  const bounty = await Bounty.findById(id).lean();
  
  if (!bounty) {
    return null;
  }
  
  // Increment view count (don't wait for this to complete)
  Bounty.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(err => {
    console.error('Error incrementing view count:', err);
  });
  
  // Get solutions for this bounty
  const solutions = await Solution.find({ bountyId: id })
    .sort({ createdAt: -1 })
    .lean();
  
  return { bounty, solutions };
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    
    // Get bounty and solutions (cached)
    const data = await getBountyData(id);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }
    
    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    
    return NextResponse.json(data, { headers });
  } catch (error: any) {
    console.error('Error fetching bounty:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounty' },
      { status: 500 }
    );
  }
}

// API endpoint for incrementing views (separate from GET to avoid caching issues)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    // Increment view count
    await Bounty.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
