import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Card from '../../../models/Card';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'votes'; // Default sort by votes
    const order = searchParams.get('order') || 'desc'; // Default order descending

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Fetch cards with pagination and sorting
    const cards = await Card.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Card.countDocuments();

    return NextResponse.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}
