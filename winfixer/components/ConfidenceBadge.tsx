import React from 'react';

interface ConfidenceBadgeProps {
  confidenceLevel: 'verified' | 'high' | 'medium' | 'low' | 'unknown';
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidenceLevel }) => {
  let badgeColor;

  switch (confidenceLevel) {
    case 'verified':
      badgeColor = 'bg-green-500';
      break;
    case 'high':
      badgeColor = 'bg-blue-500';
      break;
    case 'medium':
      badgeColor = 'bg-yellow-500';
      break;
    case 'low':
      badgeColor = 'bg-red-500';
      break;
    default:
      badgeColor = 'bg-gray-500';
  }

  return (
    <span className={`text-white text-sm font-semibold py-1 px-3 rounded ${badgeColor}`}>
      {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}
    </span>
  );
};

export default ConfidenceBadge;