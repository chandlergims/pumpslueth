'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createBounty } from '@/lib/bountyApi';
import BountyPreview from '@/components/BountyPreview';

export default function CreatePage() {
  const router = useRouter();
  const { isAuthenticated, walletAddress } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bountyAmount, setBountyAmount] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !walletAddress) {
      router.push('/');
    }
  }, [isAuthenticated, walletAddress, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !walletAddress) {
      setError('Please connect your wallet to create a bounty');
      return;
    }
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (bountyAmount <= 0) {
      setError('Bounty amount must be greater than 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await createBounty({
        title,
        description,
        imageUrl,
        creator: walletAddress,
        bountyAmount,
        status: 'open'
      });
      
      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      console.error('Error creating bounty:', err);
      setError(err.message || 'Failed to create bounty');
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageUploading(true);
    
    try {
      // Create a data URL from the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to upload image');
      setImageUploading(false);
    }
  };
  
  const removeImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <span>Back</span>
          </button>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-[#4f87ff] mr-3"></div>
          <h1 className="text-2xl font-bold text-white">Create Bounty</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                />
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the bad actor or project you're investigating"
                  className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                  rows={6}
                />
              </div>
              
              {/* Bounty Amount */}
              <div className="mb-4">
                <label htmlFor="bountyAmount" className="block text-sm font-medium text-gray-300 mb-1">
                  Bounty Amount (SOL) <span className="text-red-500">*</span>
                </label>
                <input
                  id="bountyAmount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(parseFloat(e.target.value))}
                  className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                />
              </div>
              
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Evidence Image (Optional)
                </label>
                
                {imageUrl ? (
                  <div className="relative mb-3">
                    <img 
                      src={imageUrl} 
                      alt="Evidence" 
                      className="w-full h-48 object-cover rounded-md" 
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white"
                      onClick={removeImage}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-48 border-2 border-dashed border-[#2a2f52] rounded-md flex items-center justify-center cursor-pointer hover:border-[#4f87ff] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageUploading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4f87ff] mx-auto mb-2"></div>
                        <span className="text-sm text-gray-400">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-sm text-gray-400">Click to upload an image</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                  </div>
                )}
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !isAuthenticated}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Bounty'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Preview */}
          <div>
            <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Preview</h2>
              
              <BountyPreview
                title={title || 'Bounty Title'}
                description={description || 'Bounty description will appear here...'}
                imageUrl={imageUrl}
                creator={walletAddress || ''}
                bountyAmount={bountyAmount.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
