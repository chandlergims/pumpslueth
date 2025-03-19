'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AboutPage() {
  const router = useRouter();

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
            <span>Back</span>
          </button>
        </div>
        
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 bg-[#4f87ff] mr-3"></div>
          <h1 className="text-3xl font-bold text-white">About PumpSleuth</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Content */}
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                PumpSleuth is a community-driven platform designed to hold bad actors accountable in the Solana ecosystem. 
                We provide a space where users can create bounties to incentivize the community to investigate scammers, 
                fraudulent projects, and other malicious activities.
              </p>
              
              <p className="text-gray-300 mb-6">
                Our goal is to create a safer environment for all Solana users by leveraging the power of collective 
                investigation and on-chain analysis. By rewarding community members for their investigative work, 
                we aim to deter scammers and protect users from potential fraud.
              </p>
              
              <h2 className="text-xl font-bold text-white mb-4 mt-8">How It Works</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4f87ff]/10 flex items-center justify-center mr-4">
                    <span className="text-[#4f87ff] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Create a Bounty</h3>
                    <p className="text-gray-300">
                      If you've identified a potential scam or fraudulent project, create a bounty with details about the 
                      suspicious activity. Set a reward amount in SOL to incentivize community members to investigate.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4f87ff]/10 flex items-center justify-center mr-4">
                    <span className="text-[#4f87ff] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Submit Solutions</h3>
                    <p className="text-gray-300">
                      Community members can investigate the case and submit solutions with evidence. This could include 
                      wallet address analysis, transaction history, social media connections, or other relevant information.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4f87ff]/10 flex items-center justify-center mr-4">
                    <span className="text-[#4f87ff] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Review and Reward</h3>
                    <p className="text-gray-300">
                      Bounty creators review submitted solutions and accept the most comprehensive and accurate one. 
                      The solver receives the bounty reward for their investigative work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Escrow System */}
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Escrow System</h2>
              </div>
              
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2 animate-pulse"></div>
                  <span className="text-[#10b981] text-sm font-medium">Current Status: <span className="font-bold">Offline</span></span>
                </div>
                <p className="text-gray-300 text-sm">
                  For our launch week, we're offering free bounties with no escrow requirement to help grow our community. 
                  This means you can create bounties without locking up your SOL.
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-3">Coming Soon: Secure Escrow</h3>
              <p className="text-gray-300 mb-4">
                After our initial launch period, we'll be implementing a secure escrow system to ensure fair play for all participants:
              </p>
              
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#4f87ff] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>When creating a bounty, the reward amount will be automatically escrowed in a secure, dedicated wallet.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#4f87ff] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Each bounty will generate a fresh wallet to ensure complete separation of funds.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#4f87ff] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>When a solution is accepted, the funds will be automatically transferred to the solver.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#4f87ff] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>If no solution is accepted within 30 days, the creator can reclaim their escrowed funds.</span>
                </li>
              </ul>
              
              <p className="text-gray-300">
                This system will prevent fraud and ensure that both bounty creators and solvers are protected. 
                Creators can be confident that their funds are secure, and solvers can trust that they'll be 
                rewarded for their work.
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Get Started</h3>
              <div className="space-y-4">
                <Link href="/create" className="block w-full py-2 px-4 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors text-center">
                  Create a Bounty
                </Link>
                <Link href="/" className="block w-full py-2 px-4 bg-[#1c2045] hover:bg-[#2a2f52] text-white font-medium rounded-md transition-colors text-center">
                  Explore Bounties
                </Link>
              </div>
            </div>
            
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#10b981] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Community-driven investigations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#10b981] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Incentivized participation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#10b981] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Transparent on-chain evidence</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#10b981] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Safer Solana ecosystem</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#10b981] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Secure escrow system (coming soon)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
