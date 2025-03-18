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
        { error: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await req.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // Find the card
    const card = await Card.findById(cardId);

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    const walletAddress = decoded.walletAddress;

    // Check if user has already voted
    if (card.voters.includes(walletAddress)) {
      return NextResponse.json(
        { error: 'You have already voted for this card' },
        { status: 400 }
      );
    }

    // Check if user is voting for their own card
    if (card.creator === walletAddress) {
      return NextResponse.json(
        { error: 'You cannot vote for your own card' },
        { status: 400 }
      );
    }

    // Update the card with the new vote
    card.votes += 1;
    card.voters.push(walletAddress);
    await card.save();

    console.log(`User ${walletAddress} voted for card ${cardId}`);

    return NextResponse.json({
      message: 'Vote recorded successfully',
      card,
    });
  } catch (error) {
    console.error('Error voting for card:', error);
    return NextResponse.json(
      { error: 'Failed to vote for card' },
      { status: 500 }
    );
  }
}
