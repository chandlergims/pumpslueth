'use client';

import React from 'react';
import TrapCard from './TrapCard';

interface CardPreviewProps {
  title: string;
  ticker: string;
  bio?: string;
  imageUrl: string | null;
  devFeePercentage: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  title,
  ticker,
  bio = '',
  imageUrl,
  devFeePercentage
}) => {
  // Create a description from the bio or use a default
  const description = bio || "Card description goes here. Add details about your trap card.";
  
  return (
    <div className="w-full max-w-[300px] mx-auto">
      <TrapCard
        title={title}
        imageUrl={imageUrl}
        ticker={ticker}
        description={description}
        devFeePercentage={devFeePercentage}
      />
    </div>
  );
};

export default CardPreview;
