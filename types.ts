import React from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface ExerciseOption {
  label: string;
  value: string;
}

export interface ExerciseConfig {
  type: 'text' | 'radio';
  question: string;
  options?: ExerciseOption[];
  correctAnswer: string | number;
  feedbackKey: string; // Unique key for managing feedback state
  inputId?: string;
  radioGroupName?: string;
  explanation?: string; // Explanation for correct/incorrect answer
}

export interface Section {
  id: string;
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  learningObjectives: string[];
  introduction: React.ReactNode;
  contentBlocks: ContentBlock[];
  interactiveArea?: React.FC<InteractiveAreaProps>; // Component for interactive simulation
  exercise?: ExerciseConfig;
}

export interface ContentBlock {
  type: 'paragraph' | 'list' | 'formula' | 'heading';
  level?: 2 | 3 | 4; // For heading type
  items?: string[]; // For list type
  text?: string; // For paragraph, formula, heading
  className?: string; // Additional styling
}

export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
}

// Props for interactive area components
export interface InteractiveAreaProps {
  sectionIndex: number; // To re-initialize simulation if needed when section becomes active
}

export interface SimulationParams {
  mass: number;
  springConstant: number;
  dampingCoefficient?: number;
  initialDisplacement: number;
  initialVelocity: number;
}

export interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isLastPage: boolean;
  onFinish?: () => void; // Added for course completion
}