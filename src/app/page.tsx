'use client';

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBounties } from "../lib/bountyApi";
import BountyCard from "../components/BountyCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, walletAddress } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    totalBounties: 0,
    openBounties: 0,
    solvedBounties: 0,
    totalRewards: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Show 12 bounties initially (2 rows of 6 on large screens)
    total: 0,
    pages: 0
  });

  // Fetch bounties from the API
  useEffect(() => {
    fetchBounties(1); // Reset to page 1 when filter changes
  }, [activeFilter]);

  const fetchBounties = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
        setBounties([]); // Clear existing bounties when changing filters
      } else {
        setLoadingMore(true);
      }
      setApiError(null);
      
      // Build query parameters
      const params: any = {
        sort: 'createdAt',
        order: 'desc',
        limit: pagination.limit,
        page
      };
      
      // Add status filter if not 'all'
      if (activeFilter === 'open' || activeFilter === 'solved') {
        params.status = activeFilter;
      }
      
      // Add creator filter if 'my'
      if (activeFilter === 'my' && walletAddress) {
        params.creator = walletAddress;
      }
      
      const response = await getBounties(params);
      
      if (page === 1) {
        setBounties(response.bounties);
      } else {
        setBounties(prev => [...prev, ...response.bounties]);
      }
      
      setStats(response.stats);
      setPagination({
        ...response.pagination,
        page // Update current page
      });
    } catch (err: any) {
      console.error('Error fetching bounties:', err);
      setApiError(err.message || 'Failed to load bounties');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more bounties
  const handleLoadMore = () => {
    if (loadingMore || pagination.page >= pagination.pages) return;
    fetchBounties(pagination.page + 1);
  };

  // Filter bounties based on search query
  const filteredBounties = bounties.filter(bounty => {
    // Filter by search query
    if (searchQuery && !bounty.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen pt-20 bg-[#0f1225]">
      {/* Escrow Status Banner */}
      <div className="bg-[#10b981]/10 border-b border-[#10b981]/20 py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2 animate-pulse"></div>
            <span className="text-[#10b981] text-sm font-medium">Escrow: <span className="font-bold">Offline</span></span>
          </div>
          <div className="text-gray-400 text-xs">
            Free bounties for the first week! <Link href="/about" className="text-[#4f87ff] hover:underline">Learn more</Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-[#141836] to-[#1c2045] border border-[#2a2f52] rounded-lg p-5 shadow-lg">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="w-1 h-8 bg-[#4f87ff] mr-3"></div>
              <h2 className="text-lg font-bold text-white">Platform Statistics</h2>
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#4f87ff]/10 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{stats.totalBounties}</div>
                  <div className="text-xs text-gray-400">Total Bounties</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#f59e0b]">{stats.openBounties}</div>
                  <div className="text-xs text-gray-400">Open Bounties</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#10b981]">{stats.solvedBounties}</div>
                  <div className="text-xs text-gray-400">Solved Bounties</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#4f87ff]/10 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4f87ff]">{stats.totalRewards.toFixed(2)} SOL</div>
                  <div className="text-xs text-gray-400">Total Rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Bounties */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-[#4f87ff] mr-3"></div>
              <h1 className="text-2xl font-bold text-white">Explore Bounties</h1>
            </div>
            <p className="text-gray-400 max-w-2xl">
              Find and track bad actors in the Solana ecosystem. Create bounties to incentivize the community to investigate scammers and fraudulent projects.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/create')}
            className="px-4 py-2 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors flex items-center whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Bounty
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Filters */}
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-1 inline-flex">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-[#4f87ff] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All Bounties
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'open' 
                    ? 'bg-[#4f87ff] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveFilter('open')}
              >
                Open
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'solved' 
                    ? 'bg-[#4f87ff] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveFilter('solved')}
              >
                Solved
              </button>
              {isAuthenticated && (
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === 'my' 
                      ? 'bg-[#4f87ff] text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveFilter('my')}
                >
                  My Bounties
                </button>
              )}
            </div>
            
            {/* Search */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141836] border border-[#2a2f52] rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4f87ff] mb-4"></div>
            <p className="text-gray-400">Loading bounties...</p>
          </div>
        )}

        {/* Error State */}
        {apiError && (
          <div className="text-center py-16 bg-red-900/20 border border-red-800 rounded-lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-2xl font-bold mb-2">Error Loading Bounties</h3>
            <p className="text-red-400 mb-6">{apiError}</p>
            <button 
              onClick={() => fetchBounties(1)}
              className="px-6 py-3 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Bounties Grid or Empty State */}
        {!loading && !apiError && (
          filteredBounties.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredBounties.map((bounty) => (
                  <BountyCard
                    key={bounty._id}
                    id={bounty._id}
                    title={bounty.title}
                    description={bounty.description}
                    imageUrl={bounty.imageUrl}
                    creator={bounty.creator}
                    bountyAmount={bounty.bountyAmount}
                    status={bounty.status}
                    createdAt={bounty.createdAt}
                    votes={bounty.views || 0}
                    hasVoted={false}
                    onVote={() => {}}
                    isVoting={false}
                  />
                ))}
              </div>
              
              {/* Load More Button - Only show if there are more pages and we have at least 12 bounties */}
              {pagination.page < pagination.pages && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-[#141836] border border-[#2a2f52] hover:bg-[#1c2045] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <span>Load More</span>
                        <span className="ml-2 text-gray-400 text-sm">
                          ({filteredBounties.length} of {pagination.total})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-[#141836] border border-[#2a2f52] rounded-lg">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold mb-2">No Bounties Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? 'No bounties match your search criteria.' 
                  : activeFilter === 'my' 
                    ? "You haven't created any bounties yet." 
                    : activeFilter === 'open'
                      ? "No open bounties available."
                      : activeFilter === 'solved'
                        ? "No solved bounties yet."
                        : "Be the first to create a bounty!"}
              </p>
              <button 
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create a Bounty
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
