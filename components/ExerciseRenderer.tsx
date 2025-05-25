
import React, { useState, useCallback } from 'react';
import { ExerciseConfig, ExerciseOption } from '../types';

interface ExerciseRendererProps {
  exerciseConfig: ExerciseConfig;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({ exerciseConfig }) => {
  const { type, question, options, correctAnswer, feedbackKey, inputId, radioGroupName, explanation } = exerciseConfig;
  
  const [inputValue, setInputValue] = useState('');
  const [selectedRadioValue, setSelectedRadioValue] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | '' }>({ message: '', type: '' });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (feedback.type) setFeedback({ message: '', type: '' }); // Clear feedback on new input
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioValue(e.target.value);
     if (feedback.type) setFeedback({ message: '', type: '' }); // Clear feedback on new input
  };

  const checkAnswer = useCallback(() => {
    let isCorrect = false;
    if (type === 'text') {
      const userAnswer = parseFloat(inputValue.trim());
      isCorrect = !isNaN(userAnswer) && Math.abs(userAnswer - (correctAnswer as number)) < 0.01;
    } else if (type === 'radio') {
      isCorrect = selectedRadioValue === correctAnswer;
    }

    if (isCorrect) {
      setFeedback({ message: `¡Correcto! ${explanation || ''}`, type: 'correct' });
    } else {
      let incorrectMsg = 'Incorrecto.';
      if (type === 'text' && inputValue.trim() === '') {
        incorrectMsg = 'Por favor, introduce una respuesta.';
      } else if (type === 'text' && isNaN(parseFloat(inputValue.trim()))){
        incorrectMsg = 'Por favor, introduce un número válido.';
      } else if (type === 'radio' && !selectedRadioValue) {
        incorrectMsg = 'Por favor, selecciona una opción.';
      }
      
      setFeedback({ message: `${incorrectMsg} ${explanation || `La respuesta correcta era ${correctAnswer}.`}`, type: 'incorrect' });
    }
  }, [type, inputValue, selectedRadioValue, correctAnswer, explanation]);

  return (
    <div className="mt-8 p-5 bg-custom-input-bg-light dark:bg-custom-input-bg-dark border border-custom-border-light dark:border-custom-border-dark rounded-lg">
      <h4 className="text-lg font-semibold mb-3 text-custom-text-light dark:text-custom-text-dark">Ejercicio:</h4>
      <p className="mb-3 text-custom-text-light dark:text-custom-text-dark" dangerouslySetInnerHTML={{ __html: question }} />

      {type === 'text' && inputId && (
        <input
          type="text"
          id={inputId}
          value={inputValue}
          onChange={handleTextChange}
          placeholder="Introduce tu respuesta"
          className="w-full p-2.5 mt-2 border border-custom-input-border-light dark:border-custom-input-border-dark rounded-md bg-custom-card-bg-light dark:bg-custom-card-bg-dark text-custom-text-light dark:text-custom-text-dark focus:ring-2 focus:ring-custom-primary-button-bg-light dark:focus:ring-custom-primary-button-bg-dark outline-none"
        />
      )}

      {type === 'radio' && options && radioGroupName && (
        <div className="space-y-2 mt-2">
          {options.map((option: ExerciseOption) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer text-custom-text-light dark:text-custom-text-dark">
              <input
                type="radio"
                name={radioGroupName}
                value={option.value}
                checked={selectedRadioValue === option.value}
                onChange={handleRadioChange}
                className="form-radio h-4 w-4 text-custom-primary-button-bg-light dark:text-custom-primary-button-bg-dark focus:ring-custom-primary-button-bg-light dark:focus:ring-custom-primary-button-bg-dark"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={checkAnswer}
        className="mt-4 px-5 py-2.5 bg-custom-primary-button-bg-light hover:bg-custom-primary-button-hover-light dark:bg-custom-primary-button-bg-dark dark:hover:bg-custom-primary-button-hover-dark text-white rounded-md transition-colors"
      >
        Verificar
      </button>

      {feedback.type && (
        <div
          className={`mt-3 p-2 rounded-md font-semibold ${
            feedback.type === 'correct' 
            ? 'text-custom-feedback-correct-light dark:text-custom-feedback-correct-dark bg-green-100 dark:bg-green-900' 
            : 'text-custom-feedback-incorrect-light dark:text-custom-feedback-incorrect-dark bg-red-100 dark:bg-red-900'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};
