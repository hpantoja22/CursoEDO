
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { NavigationButtons } from './components/NavigationButtons';
import { SectionRenderer } from './components/SectionRenderer';
import { courseSections } from './constants';
import { Theme } from './types';

const App: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => {
    const localTheme = localStorage.getItem('theme') as Theme | null;
    return localTheme || Theme.Light;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  }, []);
  

  const handleNext = useCallback(() => {
    setCurrentSectionIndex(prev => Math.min(prev + 1, courseSections.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el curso?')) {
      setCurrentSectionIndex(0);
      // TODO: Add logic to reset exercise states if they are managed globally or in App state
    }
  }, []);

  const handleFinishCourse = useCallback(() => {
    alert('¡Felicidades! Has completado el curso.\nPuedes cerrar esta ventana o pestaña.');
    // Attempt to close the window. Note: This may not work in all browsers
    // if the window was not opened by a script.
    window.close();
  }, []);

  const currentSectionData = courseSections[currentSectionIndex];
  const universityName = "Universidad de Ingeniería y Tecnología (UTEC)";
  const teacherName = "Hermes Pantoja Carhuavilca";

  return (
    <div className="flex flex-col min-h-screen font-['Arial',_sans-serif] leading-relaxed">
      <Header 
        title="Curso Interactivo: Sistemas Resorte-Masa y Ecuaciones Diferenciales" 
        theme={theme} 
        toggleTheme={toggleTheme}
        universityName={universityName}
        teacherName={teacherName}
      />
      
      <div className="w-[90%] max-w-4xl mx-auto mt-5 mb-2">
        <ProgressBar current={currentSectionIndex} total={courseSections.length} />
      </div>

      <main className="flex-grow max-w-6xl mx-auto my-5 p-5 w-[90%] bg-custom-card-bg-light dark:bg-custom-card-bg-dark rounded-lg shadow-lg transition-colors duration-300">
        <SectionRenderer section={currentSectionData} sectionIndex={currentSectionIndex} />
      </main>

      <div className="max-w-6xl mx-auto w-[90%] p-5">
        <NavigationButtons
          onPrev={handlePrev}
          onNext={handleNext}
          onReset={handleReset}
          onFinish={handleFinishCourse}
          isPrevDisabled={currentSectionIndex === 0}
          isNextDisabled={currentSectionIndex === courseSections.length - 1 && courseSections.length > 1} // Only truly disabled if not last page or only one page
          isLastPage={currentSectionIndex === courseSections.length - 1}
        />
      </div>
    </div>
  );
};

export default App;
