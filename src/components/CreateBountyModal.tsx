'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBounty } from '../lib/bountyApi';
import BountyPreview from './BountyPreview';

interface CreateBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBountyModal: React.FC<CreateBountyModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { walletAddress } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
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
    
    if (!bountyAmount || parseFloat(bountyAmount) < 0.1) {
      setError('Bounty amount must be at least 0.1 SOL');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await createBounty({
        title,
        description,
        imageUrl: imageUrl || undefined,
        creator: walletAddress,
        bountyAmount: parseFloat(bountyAmount),
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setBountyAmount('');
      setImageUrl(null);
      
      // Close modal and notify parent
      onSuccess();
    } catch (err: any) {
      console.error('Error creating bounty:', err);
      setError(err.message || 'Failed to create bounty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Here you would typically upload the file to a storage service
    // For now, we'll just create a data URL for preview
    setImageUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file:', err);
      setImageUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-[#0f1225] bg-opacity-75" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-[#141836] border border-[#2a2f52] rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:text-white focus:outline-none"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left sm:w-full">
              <h3 className="text-lg font-bold leading-6 text-white mb-6">
                Create a New Bounty
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                  <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Identify wallet behind recent rug pull"
                        className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                        maxLength={100}
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
                        placeholder="Describe the investigation task in detail..."
                        className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                        rows={6}
                      />
                    </div>
                    
                    {/* Bounty Amount */}
                    <div className="mb-4">
                      <label htmlFor="bountyAmount" className="block text-sm font-medium text-gray-300 mb-1">
                        Bounty Amount (SOL) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="bountyAmount"
                          value={bountyAmount}
                          onChange={(e) => setBountyAmount(e.target.value)}
                          placeholder="e.g., 5"
                          min="0.1"
                          step="0.1"
                          className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-400">SOL</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Minimum 0.1 SOL. This amount will be held in escrow until the bounty is solved.
                      </p>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="mb-6">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
                        Evidence Image (Optional)
                      </label>
                      <div 
                        className="w-full h-32 border-2 border-dashed border-[#2a2f52] rounded-md flex items-center justify-center cursor-pointer hover:border-[#4f87ff] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {imageUploading ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4f87ff] mx-auto mb-2"></div>
                            <span className="text-sm text-gray-400">Uploading...</span>
                          </div>
                        ) : imageUrl ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={imageUrl} 
                              alt="Preview" 
                              className="w-full h-full object-contain p-2" 
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageUrl(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-sm text-gray-400">Click to upload an image</span>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
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
                        type="button"
                        className="mr-3 px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-[#2a2f52] rounded-md hover:bg-[#1c2045] focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#4f87ff] rounded-md hover:bg-[#3b6de0] focus:outline-none focus:ring-2 focus:ring-[#4f87ff] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
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
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Preview</h4>
                  <BountyPreview
                    title={title}
                    description={description}
                    bountyAmount={bountyAmount || '0'}
                    imageUrl={imageUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBountyModal;
