
import React from 'react';
import { Theme } from '../types';

interface ThemeToggleButtonProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-custom-header-text-light dark:border-custom-header-text-dark text-custom-header-text-light dark:text-custom-header-text-dark hover:bg-custom-header-text-light hover:text-custom-header-bg-light dark:hover:bg-custom-header-text-dark dark:hover:text-custom-header-bg-dark transition-colors text-sm"
      aria-label="Toggle theme"
    >
      {theme === Theme.Light ? 'Modo Oscuro' : 'Modo Claro'}
    </button>
  );
};
