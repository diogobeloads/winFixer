import React from 'react';

interface EvidenceBadgeProps {
  evidenceType: 'official' | 'internal_test' | 'manufacturer' | 'community' | 'research';
}

const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ evidenceType }) => {
  const getBadgeColor = () => {
    switch (evidenceType) {
      case 'official':
        return 'bg-green-500 text-white';
      case 'internal_test':
        return 'bg-blue-500 text-white';
      case 'manufacturer':
        return 'bg-yellow-500 text-black';
      case 'community':
        return 'bg-purple-500 text-white';
      case 'research':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
      {evidenceType.charAt(0).toUpperCase() + evidenceType.slice(1)}
    </span>
  );
};

export default EvidenceBadge;