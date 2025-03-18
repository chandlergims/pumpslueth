'use client';

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VoteOnCards() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vote on Trap Cards</h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Browse and vote on community-created trap cards. The most popular cards will be tokenized!
          </p>
          
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md mb-8">
            <p className="text-yellow-800 dark:text-yellow-200">
              Voting will be available once users start creating cards. Check back soon!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-bold">Coming Soon</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Card #{i}</p>
                  <button 
                    disabled 
                    className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-md cursor-not-allowed"
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
