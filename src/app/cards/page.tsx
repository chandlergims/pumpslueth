'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { getCards } from "../../lib/api";
import CardItem from "../../components/CardItem";

export default function CardsPage() {
  const { isAuthenticated } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('votes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await getCards({
          page,
          limit: 12,
          sort: sortBy,
          order: sortOrder
        });
        
        setCards(response.cards || []);
        setTotalPages(response.pagination?.pages || 1);
      } catch (err: any) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [page, sortBy, sortOrder]);

  // Handle voting
  const handleVote = async (cardId: string) => {
    // Refresh the cards after voting
    const response = await getCards({
      page,
      limit: 12,
      sort: sortBy,
      order: sortOrder
    });
    
    setCards(response.cards || []);
  };

  // For demo purposes, let's create some placeholder cards
  const placeholderCards = Array.from({ length: 12 }, (_, i) => ({
    id: `card-${i}`,
    title: `Example Card ${i + 1}`,
    description: `This is a placeholder description for card ${i + 1}`,
    imageUrl: '',
    creator: `0x${Math.random().toString(16).substring(2, 10)}`,
    votes: Math.floor(Math.random() * 100),
    voters: [],
    isTokenized: Math.random() > 0.8
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Trap Cards</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="sortBy" className="mr-2 text-sm font-medium">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1 text-sm"
              >
                <option value="votes">Votes</option>
                <option value="createdAt">Date Created</option>
                <option value="title">Name</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="bg-gray-800 border border-gray-700 rounded-md p-1"
              title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
            >
              {sortOrder === 'desc' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[3/4] bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cards.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  creator={card.creator}
                  votes={card.votes}
                  voters={card.voters}
                  isTokenized={card.isTokenized}
                  onVote={handleVote}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${
                      page === 1
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center px-4 py-2 bg-gray-800 rounded-md">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      page === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // For demo purposes, show placeholder cards
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {placeholderCards.map((card) => (
                <CardItem
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  creator={card.creator}
                  votes={card.votes}
                  voters={card.voters}
                  isTokenized={card.isTokenized}
                  onVote={handleVote}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${
                    page === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center px-4 py-2 bg-gray-800 rounded-md">
                  <span>
                    Page {page} of 3
                  </span>
                </div>
                
                <button
                  onClick={() => setPage(Math.min(3, page + 1))}
                  disabled={page === 3}
                  className={`px-4 py-2 rounded-md ${
                    page === 3
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
