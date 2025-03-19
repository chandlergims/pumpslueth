'use client';

import React from "react";

interface BountyPreviewProps {
  title: string;
  imageUrl?: string | null;
  description: string;
  bountyAmount: string;
  creator?: string;
}

const BountyPreview: React.FC<BountyPreviewProps> = ({ 
  title, 
  imageUrl, 
  description, 
  bountyAmount,
  creator
}) => {
  return (
    <div className="bg-[#141836] border border-[#2a2f52] rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        {/* Status Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold bg-[#f59e0b] text-black">
          PREVIEW
        </div>
        
        {/* Card Image (if provided) */}
        {imageUrl ? (
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gradient-to-r from-[#1c2045]/30 to-[#2a2f52]/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#4f87ff] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {title || "Enter a title for your bounty"}
        </h3>
        
        {/* Bounty Amount */}
        <div className="flex items-center mb-3">
          <div className="flex items-center bg-[#4f87ff]/10 rounded-md px-2 py-1">
            <svg className="w-4 h-4 text-[#4f87ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-bold text-[#4f87ff]">{bountyAmount} SOL</span>
          </div>
          <div className="ml-auto text-xs text-gray-400">
            Today
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm line-clamp-4">
            {description || "Enter a description for your bounty task..."}
          </p>
        </div>
        
        {/* Creator */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-[#1c2045] rounded-full flex items-center justify-center mr-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span>{creator ? `${creator.substring(0, 4)}...${creator.substring(creator.length - 4)}` : 'Your wallet'}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>0 views</span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="w-full py-2 px-4 rounded-md font-medium flex items-center justify-center bg-[#4f87ff] text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Submit Solution
        </div>
      </div>
    </div>
  );
};

export default BountyPreview;
