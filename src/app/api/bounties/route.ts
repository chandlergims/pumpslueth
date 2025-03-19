import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';
import { cache } from 'react';

// Cache the database connection
const connectDB = cache(async () => {
  await dbConnect();
});

// Cache the stats calculation for 5 minutes
const getStats = cache(async () => {
  const totalBounties = await Bounty.countDocuments();
  const openBounties = await Bounty.countDocuments({ status: 'open' });
  const solvedBounties = await Bounty.countDocuments({ status: 'solved' });
  const totalRewardsResult = await Bounty.aggregate([
    { $match: { status: 'solved' } },
    { $group: { _id: null, total: { $sum: '$bountyAmount' } } }
  ]);
  
  const totalRewards = totalRewardsResult[0]?.total || 0;
  
  return {
    totalBounties,
    openBounties,
    solvedBounties,
    totalRewards
  };
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const status = searchParams.get('status');
    const creator = searchParams.get('creator');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (creator) {
      query.creator = creator;
    }
    
    // Build sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Get bounties with projection to limit fields returned
    const bounties = await Bounty.find(query, {
      title: 1,
      description: 1,
      imageUrl: 1,
      creator: 1,
      bountyAmount: 1,
      status: 1,
      createdAt: 1,
      views: 1
    })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await Bounty.countDocuments(query);
    
    // Get stats (cached)
    const stats = await getStats();
    
    // Set cache headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    return NextResponse.json({
      bounties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      stats
    }, { headers });
  } catch (error: any) {
    console.error('Error fetching bounties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounties' },
      { status: 500 }
    );
  }
}
