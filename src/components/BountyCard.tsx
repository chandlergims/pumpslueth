'use client';

import React from "react";
import Link from "next/link";

interface BountyCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  creator: string;
  bountyAmount: number;
  status: 'open' | 'solved' | 'closed';
  createdAt: string;
  votes: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  isVoting: boolean;
}

const BountyCard: React.FC<BountyCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  creator,
  bountyAmount,
  status,
  createdAt,
  votes,
  hasVoted,
  onVote,
  isVoting
}) => {
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          bgColor: 'bg-[#f59e0b]',
          textColor: 'text-black',
          text: 'OPEN'
        };
      case 'solved':
        return {
          bgColor: 'bg-[#10b981]',
          textColor: 'text-black',
          text: 'SOLVED'
        };
      case 'closed':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-black',
          text: 'CLOSED'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-black',
          text: 'UNKNOWN'
        };
    }
  };

  const statusBadge = getStatusBadge(status);

  return (
    <div className="bg-[#141836] border border-[#2a2f52] hover:border-[#3a3f6a] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#4f87ff]/10 h-[280px] flex flex-col">
      <div className="relative">
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold ${statusBadge.bgColor} ${statusBadge.textColor}`}>
          {statusBadge.text}
        </div>
        
        {/* Card Image (if provided) */}
        {imageUrl ? (
          <div className="w-full h-20 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-full h-16 bg-gradient-to-r from-[#1c2045]/30 to-[#2a2f52]/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#4f87ff] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
          {title}
        </h3>
        
        {/* Bounty Amount and Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center bg-[#4f87ff]/10 rounded px-1.5 py-0.5">
            <svg className="w-3 h-3 text-[#4f87ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-bold text-[#4f87ff] text-xs">{bountyAmount} SOL</span>
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(createdAt)}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-2 flex-1">
          <p className="text-gray-300 text-xs line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Creator and Views */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#1c2045] rounded-full flex items-center justify-center mr-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span>{formatWalletAddress(creator)}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{votes}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/solve/${id}`}
          className={`w-full py-1.5 px-3 rounded text-xs font-medium flex items-center justify-center transition-colors ${
            status !== 'open' 
              ? 'bg-[#1c2045] text-gray-400 cursor-not-allowed' 
              : 'bg-[#4f87ff] hover:bg-[#3b6de0] text-white'
          }`}
          onClick={(e) => status !== 'open' && e.preventDefault()}
        >
          {status === 'open' ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Submit Solution
            </>
          ) : status === 'solved' ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Solved
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Closed
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default BountyCard;
