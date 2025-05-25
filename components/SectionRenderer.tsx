
import React from 'react';
import { Section, ContentBlock, InteractiveAreaProps } from '../types';
import { ExerciseRenderer } from './ExerciseRenderer';

interface SectionRendererProps {
  section: Section;
  sectionIndex: number;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, sectionIndex }) => {
  const { Icon, title, learningObjectives, introduction, contentBlocks, interactiveArea, exercise } = section;

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        const Tag = `h${block.level || 3}` as keyof JSX.IntrinsicElements;
        return <Tag key={index} className={`font-semibold my-3 text-custom-header-bg-light dark:text-custom-header-bg-dark ${block.level === 2 ? 'text-2xl' : block.level === 3 ? 'text-xl' : 'text-lg'} ${block.className || ''}`} dangerouslySetInnerHTML={{ __html: block.text || '' }} />;
      case 'paragraph':
        return <p key={index} className={`my-2 ${block.className || ''}`} dangerouslySetInnerHTML={{ __html: block.text || '' }} />;
      case 'list':
        return (
          <ul key={index} className={`list-disc list-inside my-2 space-y-1 ${block.className || ''}`}>
            {block.items?.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
          </ul>
        );
      case 'formula':
        return <div key={index} className={`my-3 p-3 text-center bg-custom-input-bg-light dark:bg-custom-input-bg-dark border border-custom-border-light dark:border-custom-border-dark rounded ${block.className || ''}`} dangerouslySetInnerHTML={{ __html: block.text || '' }} />;
      default:
        return null;
    }
  };
  
  const InteractiveComponent = interactiveArea as React.FC<InteractiveAreaProps> | undefined;


  return (
    <section className="animate-fadeIn p-2 md:p-5 border border-custom-border-light dark:border-custom-border-dark rounded-lg bg-custom-card-bg-light dark:bg-custom-card-bg-dark transition-colors duration-300">
      <div className="flex items-center mb-5">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 mr-4 fill-current text-custom-icon-color-light dark:text-custom-icon-color-dark" />
        <h2 className="text-2xl sm:text-3xl font-bold text-custom-header-bg-light dark:text-custom-header-bg-dark">{title}</h2>
      </div>

      {learningObjectives.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2 text-custom-header-bg-light dark:text-custom-header-bg-dark">Objetivos de Aprendizaje:</h3>
          <ul className="list-disc list-inside mb-6 space-y-1">
            {learningObjectives.map((obj, index) => (
              <li key={index}>{obj}</li>
            ))}
          </ul>
        </>
      )}

      {introduction && <div className="mb-6">{introduction}</div>}
      
      {contentBlocks.map(renderContentBlock)}

      {InteractiveComponent && (
        <div className="interactive-area my-6 p-5 bg-custom-input-bg-light dark:bg-custom-input-bg-dark border border-dashed border-custom-border-light dark:border-custom-border-dark rounded-lg text-center">
           <InteractiveComponent sectionIndex={sectionIndex} />
        </div>
      )}

      {exercise && (
        <div className="my-8">
          <ExerciseRenderer exerciseConfig={exercise} />
        </div>
      )}
    </section>
  );
};

// Simple fadeIn animation - can be defined in index.html globally or via Tailwind config if not using CDN for that part
// For now, ensure your index.html includes a style tag for this if needed:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// Tailwind can do this with custom animations in config, but with CDN it's harder.
// Let's assume a simple CSS class `animate-fadeIn` is available or handle opacity/transform with utility classes.
// For simplicity, I'll rely on the class name as per the original HTML, assuming it might be added globally.
// If not, a simple transition on opacity can be used: `transition-opacity duration-500 opacity-100` vs `opacity-0`
