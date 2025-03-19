'use client';

import React, { useState } from 'react';
import { voteSolution } from '@/lib/bountyApi';
import { useAuth } from '@/context/AuthContext';

interface SolutionItemProps {
  id: string;
  bountyId: string;
  solver: string;
  solutionDetails: string;
  imageUrls: string[];
  status: 'pending' | 'accepted' | 'rejected';
  votes: number;
  voters: string[];
  createdAt: string;
  isCreator: boolean;
  onAccept: (solutionId: string) => void;
}

const SolutionItem: React.FC<SolutionItemProps> = ({
  id,
  bountyId,
  solver,
  solutionDetails,
  imageUrls,
  status,
  votes,
  voters,
  createdAt,
  isCreator,
  onAccept
}) => {
  const { walletAddress } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);
  const [localVoters, setLocalVoters] = useState<string[]>(voters || []);
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Handle vote
  const handleVote = async () => {
    if (!walletAddress || isVoting) return;
    
    // Check if user already voted
    if (localVoters.includes(walletAddress)) return;
    
    try {
      setIsVoting(true);
      await voteSolution(bountyId, id, walletAddress);
      
      // Update local state
      setLocalVotes(prev => prev + 1);
      setLocalVoters(prev => [...prev, walletAddress]);
    } catch (err) {
      console.error('Error voting for solution:', err);
    } finally {
      setIsVoting(false);
    }
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2 py-0.5 bg-[#10b981] text-black text-xs font-bold rounded">
            ACCEPTED
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 bg-red-500 text-black text-xs font-bold rounded">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-[#f59e0b] text-black text-xs font-bold rounded">
            PENDING
          </span>
        );
    }
  };
  
  return (
    <div className="bg-[#141836] border border-[#2a2f52] rounded-lg overflow-hidden mb-4">
      {/* Solution Header */}
      <div className="p-4 flex flex-wrap justify-between items-center gap-2 border-b border-[#2a2f52]">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#1c2045] rounded-full flex items-center justify-center mr-2">
            <svg className="w-4 h-4 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <div className="text-white font-medium">{formatWalletAddress(solver)}</div>
            <div className="text-xs text-gray-400">{formatDate(createdAt)}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          
          <div className="flex items-center">
            <button 
              onClick={handleVote}
              disabled={!walletAddress || isVoting || localVoters.includes(walletAddress || '')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                localVoters.includes(walletAddress || '') 
                  ? 'bg-[#4f87ff]/20 text-[#4f87ff]' 
                  : 'bg-[#1c2045] text-gray-300 hover:bg-[#4f87ff]/20 hover:text-[#4f87ff]'
              } transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              <span>{localVotes}</span>
            </button>
            
            <button 
              onClick={() => setExpanded(!expanded)}
              className="ml-2 p-1 rounded-full hover:bg-[#1c2045] text-gray-300"
            >
              <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {isCreator && status === 'pending' && (
            <button 
              onClick={() => onAccept(id)}
              className="px-3 py-1 bg-[#10b981] hover:bg-[#0d9668] text-white text-xs font-medium rounded transition-colors"
            >
              Accept Solution
            </button>
          )}
        </div>
      </div>
      
      {/* Solution Content (Collapsed by default) */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-4">
          {/* Solution Text */}
          <div className="mb-4 text-gray-300 whitespace-pre-wrap">
            {solutionDetails}
          </div>
          
          {/* Solution Images */}
          {imageUrls.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-white mb-2">Evidence Images:</div>
              <div className="grid grid-cols-5 gap-2">
                {imageUrls.map((url, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square bg-[#1c2045] rounded-md overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img 
                      src={url} 
                      alt={`Evidence ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Evidence" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionItem;
