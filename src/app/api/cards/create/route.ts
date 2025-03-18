import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Card from '../../../../models/Card';
import { verifyToken } from '../../../../lib/phantom';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in with your Phantom wallet to create a card' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid authentication token. Please log in again.' },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await req.json();
    const { title, description, imageUrl, attributes } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create new card
    const newCard = new Card({
      title,
      description,
      imageUrl,
      creator: decoded.walletAddress,
      attributes: attributes || {},
      votes: 0,
      voters: [],
      isTokenized: false,
    });

    // Save to database
    await newCard.save();

    console.log(`New card created by ${decoded.walletAddress}: ${title}`);

    return NextResponse.json({
      message: 'Card created successfully',
      card: newCard,
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
