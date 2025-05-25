
import React from 'react';
import { Theme } from '../types';
import { ThemeToggleButton } from './ThemeToggleButton';

interface HeaderProps {
  title: string;
  theme: Theme;
  toggleTheme: () => void;
  universityName?: string;
  teacherName?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, theme, toggleTheme, universityName, teacherName }) => {
  return (
    <header className="bg-custom-header-bg-light dark:bg-custom-header-bg-dark text-custom-header-text-light dark:text-custom-header-text-dark p-4 text-center sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center max-w-6xl px-4">
        <div className="text-center sm:text-left mb-2 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-custom-header-text-light dark:text-custom-header-text-dark">{title}</h1>
          {universityName && (
            <p className="text-sm sm:text-base text-custom-header-text-light dark:text-custom-header-text-dark mt-1">{universityName}</p>
          )}
          {teacherName && (
            <p className="text-xs sm:text-sm text-custom-header-text-light dark:text-custom-header-text-dark">Docente: {teacherName}</p>
          )}
        </div>
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};