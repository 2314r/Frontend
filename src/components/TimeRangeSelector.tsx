import React from 'react';
import { TimeRange } from '../types/stock';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const ranges: { label: string; value: TimeRange }[] = [
    { label: '1 Day', value: '1D' },
    { label: '1 Month', value: '1M' },
    { label: '3 Months', value: '3M' },
    { label: '1 Year', value: '1Y' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            value === range.value
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};