'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { voteForCard } from '../lib/api';
import TrapCard from './TrapCard';

interface CardItemProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  creator: string;
  votes: number;
  voters: string[];
  isTokenized: boolean;
  onVote?: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  id,
  title,
  description,
  imageUrl,
  creator,
  votes,
  voters,
  isTokenized,
  onVote,
}) => {
  const { walletAddress, isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasVoted = voters.includes(walletAddress || '');
  const isCreator = creator === walletAddress;
  const canVote = isAuthenticated && !hasVoted && !isCreator;

  // Extract ticker from description if available
  const tickerMatch = description.match(/Ticker: ([A-Z0-9]+)/);
  const ticker = tickerMatch ? tickerMatch[1] : '';

  // Extract dev fee percentage if available (for demo purposes)
  const devFeePercentage = '5'; // This would come from attributes in a real implementation

  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const handleVote = async () => {
    if (!canVote) return;

    setIsVoting(true);
    setError(null);

    try {
      await voteForCard(id);
      if (onVote) {
        onVote(id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to vote for card');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      {/* Card Preview */}
      <TrapCard
        title={title}
        imageUrl={imageUrl || null}
        ticker={ticker}
        description={description}
        devFeePercentage={devFeePercentage}
      />

      {/* Card Info and Vote Button */}
      <div className="p-4 bg-gray-800">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-400">By: {formatWalletAddress(creator)}</span>
          <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs">
            {votes} vote{votes !== 1 ? 's' : ''}
          </span>
        </div>

        {isTokenized && (
          <div className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded mb-3 inline-block">
            Tokenized
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mb-3">{error}</p>
        )}

        <button
          onClick={handleVote}
          disabled={!canVote || isVoting}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            canVote
              ? 'bg-[#f0b90b] hover:bg-[#d9a70d] text-black'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isVoting
            ? 'Voting...'
            : hasVoted
            ? 'Already Voted'
            : isCreator
            ? 'Your Card'
            : 'Vote'}
        </button>
      </div>
    </div>
  );
};

export default CardItem;
