'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBounty, acceptSolution } from '@/lib/bountyApi';
import SolutionItem from '@/components/SolutionItem';
import SubmitSolutionForm from '@/components/SubmitSolutionForm';
import Link from 'next/link';

export default function SolvePage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, walletAddress } = useAuth();
  
  const [bounty, setBounty] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  
  // Fetch bounty and solutions
  useEffect(() => {
    if (!id) return;
    
    const fetchBounty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getBounty(id as string);
        setBounty(response.bounty);
        setSolutions(response.solutions);
      } catch (err: any) {
        console.error('Error fetching bounty:', err);
        setError(err.message || 'Failed to load bounty');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBounty();
  }, [id]);
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle solution submission success
  const handleSolutionSubmitted = async () => {
    if (!id) return;
    
    try {
      const response = await getBounty(id as string);
      setBounty(response.bounty);
      setSolutions(response.solutions);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };
  
  // Handle accepting a solution
  const handleAcceptSolution = async (solutionId: string) => {
    if (!id || !walletAddress || isAccepting) return;
    
    try {
      setIsAccepting(true);
      
      await acceptSolution(id as string, {
        solutionId,
        creator: walletAddress
      });
      
      // Refresh data
      const response = await getBounty(id as string);
      setBounty(response.bounty);
      setSolutions(response.solutions);
    } catch (err: any) {
      console.error('Error accepting solution:', err);
      alert(err.message || 'Failed to accept solution');
    } finally {
      setIsAccepting(false);
    }
  };
  
  // Check if user has already submitted a solution
  const hasSubmitted = solutions.some(solution => solution.solver === walletAddress);
  
  // Check if user is the bounty creator
  const isCreator = bounty?.creator === walletAddress;
  
  // Get status badge
  const getStatusBadge = () => {
    if (!bounty) return null;
    
    switch (bounty.status) {
      case 'open':
        return (
          <span className="px-2 py-1 bg-[#f59e0b] text-black text-xs font-bold rounded">
            OPEN
          </span>
        );
      case 'solved':
        return (
          <span className="px-2 py-1 bg-[#10b981] text-black text-xs font-bold rounded">
            SOLVED
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 bg-red-500 text-black text-xs font-bold rounded">
            CLOSED
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen pt-20 bg-[#0f1225]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to Bounties</span>
          </button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4f87ff] mb-4"></div>
            <p className="text-gray-400">Loading bounty details...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-red-900/20 border border-red-800 rounded-lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-2xl font-bold mb-2">Error Loading Bounty</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Link 
              href="/"
              className="px-6 py-3 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        )}
        
        {/* Bounty Details */}
        {!loading && !error && bounty && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bounty Details */}
            <div className="lg:col-span-2">
              <div className="bg-[#141836] border border-[#2a2f52] rounded-lg overflow-hidden mb-8">
                {/* Bounty Header */}
                <div className="p-6 border-b border-[#2a2f52]">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-white">{bounty.title}</h1>
                    {getStatusBadge()}
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Created by {formatWalletAddress(bounty.creator)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{formatDate(bounty.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-[#4f87ff]/10 rounded-md px-3 py-1.5">
                      <svg className="w-5 h-5 text-[#4f87ff] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-bold text-[#4f87ff]">{bounty.bountyAmount} SOL</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {bounty.description}
                  </div>
                </div>
                
                {/* Bounty Image (if available) */}
                {bounty.imageUrl && (
                  <div className="p-6 border-t border-[#2a2f52]">
                    <h3 className="text-sm font-medium text-white mb-3">Evidence Image:</h3>
                    <div className="bg-[#1c2045] rounded-md overflow-hidden">
                      <img 
                        src={bounty.imageUrl} 
                        alt="Bounty Evidence" 
                        className="w-full max-h-96 object-contain" 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Solutions Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Solutions ({solutions.length})
                </h2>
                
                {solutions.length > 0 ? (
                  <div>
                    {solutions.map((solution) => (
                      <SolutionItem
                        key={solution._id}
                        id={solution._id}
                        bountyId={bounty._id}
                        solver={solution.solver}
                        solutionDetails={solution.solutionDetails}
                        imageUrls={solution.imageUrls}
                        status={solution.status}
                        votes={solution.votes}
                        voters={solution.voters}
                        createdAt={solution.createdAt}
                        isCreator={isCreator}
                        onAccept={handleAcceptSolution}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="text-gray-400">No solutions submitted yet. Be the first to solve this bounty!</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Submit Solution */}
            <div>
              {bounty.status === 'open' ? (
                !hasSubmitted ? (
                  isCreator ? (
                    <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-5">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-[#f59e0b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <h3 className="text-lg font-bold text-white">Cannot Submit Solution</h3>
                      </div>
                      <p className="text-gray-300 mb-4">
                        You cannot submit a solution to your own bounty. This prevents conflicts of interest and ensures fair competition.
                      </p>
                      <p className="text-gray-400 text-sm">
                        As the bounty creator, you can review and accept solutions submitted by others.
                      </p>
                    </div>
                  ) : (
                    <SubmitSolutionForm
                      bountyId={bounty._id}
                      onSuccess={handleSolutionSubmitted}
                    />
                  )
                ) : (
                  <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-5">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-[#10b981] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-lg font-bold text-white">Solution Submitted</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      You have already submitted a solution for this bounty. You can view your submission in the solutions list.
                    </p>
                    <p className="text-gray-400 text-sm">
                      The bounty creator will review all submissions and may accept your solution if it successfully resolves the issue.
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-5">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-[#f59e0b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h3 className="text-lg font-bold text-white">Bounty {bounty.status === 'solved' ? 'Solved' : 'Closed'}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {bounty.status === 'solved' 
                      ? 'This bounty has been solved and is no longer accepting new solutions.' 
                      : 'This bounty has been closed and is no longer accepting solutions.'}
                  </p>
                  <Link 
                    href="/"
                    className="inline-block px-4 py-2 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors"
                  >
                    Browse Other Bounties
                  </Link>
                </div>
              )}
              
              {/* Bounty Stats */}
              <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-5 mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Bounty Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Solutions:</span>
                    <span className="text-white font-medium">{solutions.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Views:</span>
                    <span className="text-white font-medium">{bounty.views || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Reward:</span>
                    <span className="text-[#4f87ff] font-medium">{bounty.bountyAmount} SOL</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white font-medium">{bounty.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
