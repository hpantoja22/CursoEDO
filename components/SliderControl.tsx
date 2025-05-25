
import React from 'react';
import { SliderProps } from '../types';

export const SliderControl: React.FC<SliderProps> = ({ id, label, min, max, step, value, onChange, unit }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-custom-card-bg-light dark:bg-custom-card-bg-dark rounded-lg shadow-sm border border-custom-border-light dark:border-custom-border-dark w-full sm:w-auto">
      <label htmlFor={id} className="mb-2 font-semibold text-custom-text-light dark:text-custom-text-dark">
        {label}
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-48 h-2 bg-custom-progress-bar-bg-light dark:bg-custom-progress-bar-bg-dark rounded-lg appearance-none cursor-pointer 
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-custom-primary-button-bg-light
                   dark:[&::-webkit-slider-thumb]:bg-custom-primary-button-bg-dark
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-custom-primary-button-bg-light
                   dark:[&::-moz-range-thumb]:bg-custom-primary-button-bg-dark
                   focus:outline-none focus:ring-2 focus:ring-custom-primary-button-bg-light dark:focus:ring-custom-primary-button-bg-dark"
      />
      <span className="mt-2 font-bold text-custom-primary-button-bg-light dark:text-custom-primary-button-bg-dark">
        {value.toFixed(unit === 'kg' || unit === 'Ns/m' ? 1 : 0)} {unit}
      </span>
    </div>
  );
};
