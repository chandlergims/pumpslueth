'use client';

import React, { useEffect, useRef } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Add overflow hidden to body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Remove overflow hidden from body when modal is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg bg-[#111827] border border-gray-800 shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-orange-500 mr-3"></div>
            <h2 className="text-2xl font-bold text-white">About OnChain<span className="text-orange-500">Sleuth</span></h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6 text-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <p className="text-lg">
                OnChain Sleuth is a platform for creating bounties to hold bad actors accountable in the crypto space.
              </p>
            </div>
            
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-500 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-500/20 rounded-full p-2 mr-4">
                    <span className="text-orange-500 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Create Bounty</h4>
                    <p className="text-gray-300">Post a bounty task with a SOL reward for finding information about bad actors, such as rug pull creators. Your SOL is securely held in an escrow wallet.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-500/20 rounded-full p-2 mr-4">
                    <span className="text-orange-500 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Solve</h4>
                    <p className="text-gray-300">Community members investigate and submit solutions with evidence to claim the bounty.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-500/20 rounded-full p-2 mr-4">
                    <span className="text-orange-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reward</h4>
                    <p className="text-gray-300">Successful solvers receive the SOL reward directly from the escrow wallet for their investigative work.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">Our Mission</h3>
              <ul className="space-y-2">
                {[
                  'Increase transparency in the crypto ecosystem',
                  'Hold scammers and bad actors accountable',
                  'Create a community-driven investigation platform',
                  'Reward on-chain sleuths for their valuable work'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-500 mb-4">Secure Escrow System</h3>
              <p className="mb-4">
                When you create a bounty, your SOL is automatically transferred to a secure escrow wallet. This ensures:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Bounty creators cannot withdraw funds once committed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Solvers are guaranteed payment when their solution is accepted</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Transparent, on-chain verification of all transactions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-500 mb-4">Getting Started</h3>
              <p className="mb-4">
                Connect your Solana wallet to create bounties or submit solutions. Browse existing bounties to see what investigations are currently active.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Powered by Solana</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Secure & Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
