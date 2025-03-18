'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCard } from '../lib/api';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [devFeePercentage, setDevFeePercentage] = useState('0');
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState('100');
  const [enableWhitelist, setEnableWhitelist] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setName('');
    setTicker('');
    setTwitter('');
    setWebsite('');
    setDevFeePercentage('0');
    setMaxTicketsPerUser('100');
    setEnableWhitelist(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Validate ticker (8 chars max, only letters and numbers)
  const validateTicker = (value: string) => {
    return /^[a-zA-Z0-9]{1,8}$/.test(value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create a card');
      return;
    }

    // Validate ticker
    if (!validateTicker(ticker)) {
      setError('Ticker must be 1-8 characters and contain only letters and numbers');
      return;
    }

    // Validate name
    if (name.trim().length === 0 || name.length > 18) {
      setError('Name is required and must be 18 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real implementation, you would upload the image to a storage service
      // and get back a URL. For now, we'll just use a placeholder.
      const imageUrl = previewUrl || '';

      // Create card data
      const cardData = {
        title: name,
        description: `Ticker: ${ticker}${twitter ? `, Twitter: ${twitter}` : ''}${website ? `, Website: ${website}` : ''}`,
        imageUrl,
        attributes: {
          ticker,
          twitter,
          website,
          devFeePercentage: parseInt(devFeePercentage) || 0,
          maxTicketsPerUser: parseInt(maxTicketsPerUser) || 100,
          enableWhitelist
        }
      };

      // Submit to API
      await createCard(cardData);
      
      // Reset form and close modal
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create card');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Trap Card</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-900 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">NAME:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name (max 18 characters)"
                  maxLength={18}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                  required
                />
              </div>

              {/* Ticker */}
              <div>
                <label className="block text-sm font-medium mb-2">TICKER:</label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="Enter ticker (max 8 characters)"
                  maxLength={8}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Letters and numbers only, 8 characters max</p>
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium mb-2">X (TWITTER) ACCOUNT:</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium mb-2">WEBSITE URL:</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">BOX OFFICE IMAGE:</label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                      CHOOSE FILE
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <span className="ml-3 text-gray-400">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Square image (1:1), max 1080x1080px, 8MB limit.</p>
                  
                  {previewUrl && (
                    <div className="mt-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-xs max-h-48 rounded-md object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Dev Fee Percentage */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  DEV FEE PERCENTAGE:
                  <span className="ml-1 text-gray-400 cursor-help" title="Percentage of sales that goes to the developer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </label>
                <input
                  type="number"
                  value={devFeePercentage}
                  onChange={(e) => setDevFeePercentage(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              {/* Max Tickets Per User */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  MAX TICKETS PER USER:
                  <span className="ml-1 text-gray-400 cursor-help" title="Maximum number of tickets a single user can purchase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </label>
                <input
                  type="number"
                  value={maxTicketsPerUser}
                  onChange={(e) => setMaxTicketsPerUser(e.target.value)}
                  min="1"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>

              {/* Enable Whitelist */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  ENABLE WHITELIST:
                  <span className="ml-1 text-gray-400 cursor-help" title="Restrict purchases to whitelisted addresses">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </label>
                <input
                  type="checkbox"
                  checked={enableWhitelist}
                  onChange={(e) => setEnableWhitelist(e.target.checked)}
                  className="h-5 w-5 bg-gray-800 border border-gray-700 rounded"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f0b90b] hover:bg-[#d9a70d] text-black font-bold py-3 px-4 rounded-md transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'CREATE TRAP CARD'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCardModal;
