
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InteractiveAreaProps } from '../../types';

export const IntroSpringMassSVG: React.FC<InteractiveAreaProps> = ({ sectionIndex }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const massRef = useRef<SVGRectElement>(null);
  const springPathRef = useRef<SVGPathElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const SVG_EQ_POS = 150; // Equilibrium position for mass (x-coordinate of its center)
  const SVG_SPRING_X_START = 60; // Fixed point of spring
  const SVG_MASS_WIDTH = 80;
  const SVG_MASS_HEIGHT = 60;
  const SPRING_Y_CENTER = 130; // Vertical center of the spring and mass

  const drawSpring = useCallback((massCenterX: number) => {
    if (!springPathRef.current) return;

    const massStartX = massCenterX - SVG_MASS_WIDTH / 2;
    const numCoils = 15;
    const coilHeight = 10; // Amplitude of coil zig-zag
    const springLength = massStartX - SVG_SPRING_X_START;
    
    if (springLength <= 0) { // Prevent spring from inverting or becoming zero length
        springPathRef.current.setAttribute('d', `M ${SVG_SPRING_X_START} ${SPRING_Y_CENTER} L ${massStartX} ${SPRING_Y_CENTER}`);
        return;
    }

    const stepX = springLength / numCoils;
    let pathD = `M ${SVG_SPRING_X_START} ${SPRING_Y_CENTER} `;

    for (let i = 0; i < numCoils; i++) {
      const currentX = SVG_SPRING_X_START + (i + 0.5) * stepX;
      const currentY = SPRING_Y_CENTER + (i % 2 === 0 ? coilHeight : -coilHeight);
      pathD += `L ${currentX} ${currentY} `;
    }
    pathD += `L ${massStartX} ${SPRING_Y_CENTER}`; // End at the mass
    springPathRef.current.setAttribute('d', pathD);
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!massRef.current || !springPathRef.current) return;
    if (startTimeRef.current === null) startTimeRef.current = timestamp;

    const elapsed = (timestamp - startTimeRef.current) / 1000; // seconds
    const frequency = 0.5; // Hz for visual effect
    const amplitude = 40; // Pixels for mass center displacement

    // Calculate new center position of the mass
    const massCenterX = SVG_EQ_POS + amplitude * Math.cos(2 * Math.PI * frequency * elapsed);
    
    // Set mass position (SVG x is top-left corner)
    massRef.current.setAttribute('x', (massCenterX - SVG_MASS_WIDTH / 2).toString());
    drawSpring(massCenterX);

    if (isAnimating) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [isAnimating, drawSpring]);

  useEffect(() => {
    // Initialize position when not animating or when section becomes active
    if (massRef.current) {
        massRef.current.setAttribute('x', (SVG_EQ_POS - SVG_MASS_WIDTH / 2).toString());
    }
    drawSpring(SVG_EQ_POS);

    if (isAnimating) {
      startTimeRef.current = null; // Reset start time for smooth animation
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isAnimating, animate, sectionIndex, drawSpring]);


  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  // Ensure initial drawing
  useEffect(() => {
    drawSpring(SVG_EQ_POS);
     if (massRef.current) {
        massRef.current.setAttribute('x', (SVG_EQ_POS - SVG_MASS_WIDTH / 2).toString());
        massRef.current.setAttribute('y', (SPRING_Y_CENTER - SVG_MASS_HEIGHT / 2).toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-custom-text-light dark:text-custom-text-dark">Diagrama Interactivo: Sistema Resorte-Masa</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Haz clic en el resorte o la masa para iniciar/detener la simulación.</p>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="250" 
        viewBox="0 0 300 200" 
        onClick={toggleAnimation}
        className="cursor-pointer border border-custom-border-light dark:border-custom-border-dark rounded bg-white"
      >
        {/* Ground */}
        <rect id="ground" x="0" y="160" width="300" height="40" className="fill-gray-300 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500" strokeWidth="1"/>
        {/* Fixed Point */}
        <rect id="fixedPoint" x="40" y="50" width="20" height="110" rx="5" ry="5" className="fill-gray-500 dark:fill-gray-400 stroke-gray-600 dark:stroke-gray-300" strokeWidth="1"/>
        {/* Spring */}
        <path id="spring" ref={springPathRef} d="" className="stroke-gray-700 dark:stroke-gray-200" strokeWidth="3" fill="none"/>
        {/* Mass */}
        <rect 
            id="mass" 
            ref={massRef} 
            x={SVG_EQ_POS - SVG_MASS_WIDTH / 2} 
            y={SPRING_Y_CENTER - SVG_MASS_HEIGHT / 2} 
            width={SVG_MASS_WIDTH} 
            height={SVG_MASS_HEIGHT} 
            rx="8" ry="8" 
            className="fill-yellow-600 dark:fill-yellow-500 stroke-yellow-800 dark:stroke-yellow-700" strokeWidth="2"
        />
        {/* Equilibrium Line and Text */}
        <line x1={SVG_EQ_POS} y1="50" x2={SVG_EQ_POS} y2="160" className="stroke-gray-400 dark:stroke-gray-500" strokeDasharray="3,3"/>
        <text x={SVG_EQ_POS} y="40" textAnchor="middle" fontSize="10" className="fill-custom-text-light dark:fill-custom-text-dark">
          Equilibrio (x=0)
        </text>
      </svg>
    </div>
  );
};
