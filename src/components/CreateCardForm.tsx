'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCard } from '../lib/api';
import BountyPreview from '../components/BountyPreview';

interface CreateCardFormProps {
  onSuccess?: () => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({
  onSuccess,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setBio] = useState('');
  const [bountyAmount, setBountyAmount] = useState('1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      // Create a URL for the file for preview purposes only
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in with your Phantom wallet to create a bounty');
      return;
    }

    // Validate title
    if (title.trim().length === 0 || title.length > 100) {
      setError('Title is required and must be 100 characters or less');
      return;
    }

    // Validate description
    if (description.trim().length === 0) {
      setError('Description is required');
      return;
    }

    // Validate bounty amount
    const bountyAmountNum = parseFloat(bountyAmount);
    if (isNaN(bountyAmountNum) || bountyAmountNum <= 0) {
      setError('Bounty amount must be greater than 0 SOL');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert the file to a base64 string if it exists
      let imageDataUrl = null;
      
      if (selectedFile) {
        const fileReader = new FileReader();
        imageDataUrl = await new Promise<string>((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(selectedFile);
        });
      }

      // Create card data
      const cardData = {
        title,
        description,
        imageUrl: imageDataUrl || undefined,
        bountyAmount: bountyAmountNum,
        attributes: {
          status: 'open'
        }
      };

      // Submit to API
      await createCard(cardData);
      
      // Show success message
      setSuccess('Bounty created successfully!');
      
      // Reset form
      setTitle('');
      setBio('');
      setBountyAmount('1');
      setSelectedFile(null);
      setPreviewUrl(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create bounty');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-8">
      <div className="flex items-center mb-8">
        <div className="w-1 h-6 bg-orange-500 mr-3"></div>
        <h1 className="text-2xl font-bold text-white">Create a Bounty</h1>
      </div>
      
      <p className="text-gray-400 mb-8">
        Offer a reward for information about bad actors in the crypto space. Be specific about what evidence you're looking for.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="w-full lg:w-3/5">
          <div className="bg-[#111827] border border-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bounty Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Find wallet address of XYZ rug pull creator"
                  maxLength={100}
                  className="w-full bg-[#0a0e17] border border-gray-800 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-gray-500">Be specific about what you're looking for</span>
                  <span className="text-gray-500">{title.length}/100</span>
                </div>
              </div>

              {/* Bounty Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bounty Amount (SOL) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={bountyAmount}
                    onChange={(e) => setBountyAmount(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full bg-[#0a0e17] border border-gray-800 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Amount in SOL to reward the person who solves this task
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe the task in detail. What information are you looking for? What evidence is needed to solve this bounty?"
                  rows={6}
                  className="w-full bg-[#0a0e17] border border-gray-800 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide clear instructions on what evidence is needed to claim the reward
                </p>
              </div>

              {/* Optional Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Supporting Image (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-700 rounded-lg bg-[#0a0e17]">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="mb-3">
                        <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                      </div>
                    ) : (
                      <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-[#111827] rounded-md font-medium text-orange-500 hover:text-orange-400 focus-within:outline-none px-2 py-1">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 flex items-center">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-md transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Bounty...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Create Bounty
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-24">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Bounty Preview</h3>
            <BountyPreview
              title={title || "Enter a title for your bounty"}
              imageUrl={previewUrl}
              description={description || "Enter a description for your bounty task..."}
              bountyAmount={bountyAmount}
            />
            
            <div className="mt-6 p-4 bg-[#111827] border border-gray-800 rounded-lg">
              <h4 className="font-medium text-orange-500 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Tips for a successful bounty
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Be specific about what information you're looking for</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Set a reasonable bounty amount for the work required</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Clearly define what evidence is needed to claim the reward</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCardForm;
