
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <div className="w-full h-2.5 bg-custom-progress-bar-bg-light dark:bg-custom-progress-bar-bg-dark rounded-full overflow-hidden">
      <div
        className="h-full bg-custom-progress-bar-fill-light dark:bg-custom-progress-bar-fill-dark rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};
