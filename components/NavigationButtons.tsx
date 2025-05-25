import React from 'react';
import { NavigationButtonsProps } from '../types';

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  onReset,
  isPrevDisabled,
  isNextDisabled,
  isLastPage,
  onFinish,
}) => {
  const handleNextOrFinish = () => {
    if (isLastPage && onFinish) {
      onFinish();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between mt-8 pt-5 border-t border-custom-border-light dark:border-custom-border-dark gap-3">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="px-6 py-3 text-base font-medium rounded-md text-white bg-custom-secondary-button-bg-light hover:bg-custom-secondary-button-hover-light dark:bg-custom-secondary-button-bg-dark dark:hover:bg-custom-secondary-button-hover-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
      >
        Anterior
      </button>
      <button
        onClick={onReset}
        className="px-6 py-3 text-base font-medium rounded-md text-white bg-custom-secondary-button-bg-light hover:bg-custom-secondary-button-hover-light dark:bg-custom-secondary-button-bg-dark dark:hover:bg-custom-secondary-button-hover-dark transition-colors w-full sm:w-auto"
      >
        Reiniciar Curso
      </button>
      <button
        onClick={handleNextOrFinish}
        disabled={!isLastPage && isNextDisabled}
        className={`px-6 py-3 text-base font-medium rounded-md text-white 
          ${
            isLastPage
              ? 'bg-green-500 hover:bg-green-600 dark:bg-emerald-500 dark:hover:bg-emerald-600'
              : 'bg-custom-primary-button-bg-light hover:bg-custom-primary-button-hover-light dark:bg-custom-primary-button-bg-dark dark:hover:bg-custom-primary-button-hover-dark'
          }
          disabled:opacity-50 disabled:cursor-not-allowed 
          transition-colors w-full sm:w-auto`}
      >
        {isLastPage ? 'Finalizar Curso' : 'Siguiente'}
      </button>
    </div>
  );
};