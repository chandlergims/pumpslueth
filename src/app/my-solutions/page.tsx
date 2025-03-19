'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface Solution {
  _id: string;
  bountyId: string;
  bountyTitle: string;
  bountyAmount: number;
  solver: string;
  solutionDetails: string;
  imageUrls: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MySolutions() {
  const router = useRouter();
  const { isAuthenticated, isLoading, walletAddress } = useAuth();
  
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch user's solutions
  useEffect(() => {
    const fetchSolutions = async () => {
      if (!isAuthenticated || !walletAddress) return;
      
      try {
        setLoading(true);
        
        // Fetch solutions from API
        const response = await fetch(`/api/solutions?solver=${walletAddress}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch solutions');
        }
        
        const data = await response.json();
        setSolutions(data.solutions);
      } catch (err: any) {
        console.error('Error fetching solutions:', err);
        setError(err.message || 'Failed to load your solutions');
        
        // For development, use placeholder data if API fails
        if (process.env.NODE_ENV === 'development') {
          setSolutions([
            {
              _id: '1',
              bountyId: 'abc123',
              bountyTitle: 'Find wallet address of XYZ rug pull creator',
              bountyAmount: 5,
              solver: walletAddress || '',
              solutionDetails: 'I found the wallet address by tracing transactions from the token contract. The creator initially funded the contract from wallet 0x123... which can be linked to several other projects that also rugged. Evidence shows this wallet transferred funds to Binance and Coinbase accounts shortly after the rug pull.',
              imageUrls: ['/pattern.png'],
              status: 'pending',
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              bountyId: 'def456',
              bountyTitle: 'Identify team behind fake NFT project',
              bountyAmount: 3,
              solver: walletAddress || '',
              solutionDetails: 'After analyzing social media accounts and on-chain data, I was able to connect this project to a known group of scammers. The same wallet that deployed this contract also deployed 3 other known scam projects. Additionally, I found connections between their Discord moderators and previous scam projects through shared server memberships.',
              imageUrls: ['/pattern.png', '/pattern.png'],
              status: 'accepted',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && walletAddress) {
      fetchSolutions();
    }
  }, [isAuthenticated, walletAddress]);

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0f1225] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4f87ff] mb-4"></div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

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
  
  // Get status badge
  const getStatusBadge = (status: string) => {
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
    <div className="min-h-screen pt-20 bg-[#0f1225] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-1 h-6 bg-[#4f87ff] mr-3"></div>
            <h1 className="text-2xl font-bold text-white">My Solutions</h1>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {solutions.length === 0 ? (
            <div className="text-center py-16 bg-[#141836] rounded-lg border border-[#2a2f52]">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold mb-2">No Solutions Yet</h3>
              <p className="text-gray-400 mb-6">You haven't submitted any solutions to bounties yet.</p>
              <Link 
                href="/" 
                className="px-6 py-3 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors"
              >
                Browse Bounties
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {solutions.map((solution) => (
                <div key={solution._id} className="bg-[#141836] border border-[#2a2f52] rounded-lg overflow-hidden mb-6">
                  {/* Solution Header */}
                  <div className="p-4 flex flex-wrap justify-between items-center gap-2 border-b border-[#2a2f52]">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#1c2045] rounded-full flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-white font-medium mr-3">{formatWalletAddress(solution.solver)}</span>
                          <Link href={`/solve/${solution.bountyId}`} className="text-sm text-[#4f87ff] hover:underline">
                            {solution.bountyTitle}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(solution.createdAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4f87ff]/10 text-[#4f87ff] px-2 py-1 rounded-md text-xs font-medium">
                        {solution.bountyAmount || 5} SOL
                      </div>
                      
                      {getStatusBadge(solution.status)}
                      
                      <button 
                        onClick={() => setExpandedSolution(expandedSolution === solution._id ? null : solution._id)}
                        className="p-1 rounded-full hover:bg-[#1c2045] text-gray-300"
                      >
                        <svg className={`w-5 h-5 transition-transform ${expandedSolution === solution._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Solution Content (Collapsed by default) */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSolution === solution._id ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-4">
                      {/* Solution Text */}
                      <div className="mb-4 text-gray-300 whitespace-pre-wrap">
                        {solution.solutionDetails}
                      </div>
                      
                      {/* Solution Images */}
                      {solution.imageUrls && solution.imageUrls.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-white mb-2">Evidence Images:</div>
                          <div className="grid grid-cols-5 gap-2">
                            {solution.imageUrls.map((url, index) => (
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
                </div>
              ))}
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
}
