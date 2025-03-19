'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { submitSolution } from '@/lib/bountyApi';

interface SubmitSolutionFormProps {
  bountyId: string;
  onSuccess: () => void;
}

const SubmitSolutionForm: React.FC<SubmitSolutionFormProps> = ({
  bountyId,
  onSuccess
}) => {
  const { walletAddress } = useAuth();
  const [solutionDetails, setSolutionDetails] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setError('Please connect your wallet to submit a solution');
      return;
    }
    
    if (!solutionDetails.trim()) {
      setError('Solution details are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submitSolution(bountyId, {
        solver: walletAddress,
        solutionDetails,
        imageUrls
      });
      
      // Reset form
      setSolutionDetails('');
      setImageUrls([]);
      
      // Notify parent
      onSuccess();
    } catch (err: any) {
      console.error('Error submitting solution:', err);
      setError(err.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (imageUrls.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    setImageUploading(true);
    
    try {
      // For each file, create a data URL
      const newImageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newImageUrls.push(dataUrl);
      }
      
      // Add new images to the existing ones
      setImageUrls(prev => [...prev, ...newImageUrls]);
      setError(null);
    } catch (err) {
      console.error('Error reading files:', err);
      setError('Failed to upload images');
    } finally {
      setImageUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="bg-[#141836] border border-[#2a2f52] rounded-lg p-5">
      <h3 className="text-lg font-bold text-white mb-4">Submit Your Solution</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Solution Details */}
        <div className="mb-4">
          <label htmlFor="solutionDetails" className="block text-sm font-medium text-gray-300 mb-1">
            Solution Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="solutionDetails"
            value={solutionDetails}
            onChange={(e) => setSolutionDetails(e.target.value)}
            placeholder="Explain your investigation process and findings in detail..."
            className="w-full bg-[#1c2045] border border-[#2a2f52] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff]"
            rows={6}
          />
          <p className="mt-1 text-xs text-gray-400">
            Provide clear evidence and reasoning for your solution. Be as detailed as possible.
          </p>
        </div>
        
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Evidence Images (Optional, max 5)
          </label>
          
          {/* Image Preview Grid */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square bg-[#1c2045] rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Evidence ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                    onClick={() => removeImage(index)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Button */}
          <div 
            className="w-full h-32 border-2 border-dashed border-[#2a2f52] rounded-md flex items-center justify-center cursor-pointer hover:border-[#4f87ff] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4f87ff] mx-auto mb-2"></div>
                <span className="text-sm text-gray-400">Uploading...</span>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-sm text-gray-400">
                  {imageUrls.length === 0 
                    ? 'Click to upload evidence images' 
                    : `Click to add more images (${imageUrls.length}/5)`}
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={imageUrls.length >= 5 || imageUploading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Upload screenshots, transaction records, or other evidence to support your solution.
          </p>
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
            className="px-4 py-2 bg-[#4f87ff] hover:bg-[#3b6de0] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !walletAddress}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Solution'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitSolutionForm;
