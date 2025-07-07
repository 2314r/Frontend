import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton ${className}`}></div>
  );
};

export const StockCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="w-12 h-3 bg-gray-200 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="w-14 h-3 bg-gray-200 rounded"></div>
          <div className="w-18 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
      <div className="w-full h-64 bg-gray-200 rounded"></div>
    </div>
  );
};

export const MarketOverviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
      <div className="w-40 h-6 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}; 