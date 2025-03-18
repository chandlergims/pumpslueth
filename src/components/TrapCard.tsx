'use client';

import React from "react";

interface TrapCardProps {
  title: string;
  imageUrl: string | null;
  ticker: string;
  description: string;
  devFeePercentage: string;
  smallPreview?: boolean;
}

const TrapCard: React.FC<TrapCardProps> = ({ 
  title, 
  imageUrl, 
  ticker, 
  description, 
  devFeePercentage,
  smallPreview = false
}) => {
  if (smallPreview) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-[#1b1d28] to-[#121212] border border-[rgb(134,239,172)] rounded-md shadow-md overflow-hidden">
        {/* Card Name */}
        <div className="p-1 bg-gradient-to-r from-[#121212] to-[#1b1d28] text-center text-xs font-bold uppercase border-b border-[rgb(134,239,172)]">
          <span className="text-[rgb(134,239,172)] truncate block">{title || "Card Title"}</span>
        </div>
        
        {/* Card Image */}
        <div className="relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-12 object-cover border-b border-[rgb(134,239,172)]" 
            />
          ) : (
            <div className="w-full h-12 bg-gray-800 flex items-center justify-center border-b border-[rgb(134,239,172)]">
              <p className="text-gray-300 text-[8px]">No image</p>
            </div>
          )}
          
          {/* Ticker Badge */}
          <div className="absolute top-1 right-1 bg-[#121212] border border-[rgb(134,239,172)] text-[rgb(134,239,172)] text-[6px] font-bold px-1 rounded-sm">
            {ticker || "TICKER"}
          </div>
        </div>

        {/* Footer */}
        <div className="p-1 bg-[#121212] border-t border-[rgb(134,239,172)] flex justify-between items-center text-[6px]">
          <span className="text-[rgb(134,239,172)] font-bold">TRAP</span>
          <span className="text-white bg-[#1b1d28] px-1 rounded-sm border border-[rgb(134,239,172)]">
            {devFeePercentage || "0"}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-64 h-96 bg-gradient-to-b from-[#1b1d28] to-[#121212] border-2 border-[rgb(134,239,172)] rounded-lg shadow-xl overflow-hidden mx-auto">
      {/* Card Name */}
      <div className="p-2 bg-gradient-to-r from-[#121212] to-[#1b1d28] text-center text-lg font-bold uppercase border-b border-[rgb(134,239,172)]">
        <span className="text-[rgb(134,239,172)]">{title || "Card Title"}</span>
      </div>
      
      {/* Card Image */}
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover border-b border-[rgb(134,239,172)]" 
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center border-b border-[rgb(134,239,172)]">
            <p className="text-gray-300 text-sm">No image</p>
          </div>
        )}
        
        {/* Ticker Badge */}
        <div className="absolute top-2 right-2 bg-[#121212] border border-[rgb(134,239,172)] text-[rgb(134,239,172)] text-xs font-bold px-2 py-1 rounded-md">
          {ticker || "TICKER"}
        </div>
      </div>

      {/* Description */}
      <div className="p-3 text-sm text-white h-24 overflow-auto">
        {description ? (
          <div className="whitespace-pre-line break-words">
            {description}
          </div>
        ) : (
          "Card description goes here."
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#121212] border-t border-[rgb(134,239,172)] flex justify-between items-center">
        <span className="text-xs text-[rgb(134,239,172)] font-bold">TRAP CARD</span>
        <span className="text-xs text-white bg-[#1b1d28] px-2 py-1 rounded-md border border-[rgb(134,239,172)]">
          FEE: {devFeePercentage || "0"}%
        </span>
      </div>
    </div>
  );
};

export default TrapCard;
