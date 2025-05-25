
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SliderControl } from '../SliderControl';
import { rk4Step } from '../../utils/math';
import { exportCanvasAsImage, drawAxes } from '../../utils/canvasUtils';
import { InteractiveAreaProps } from '../../types';

const MAX_HISTORY = 300; // Points for graph plotting

export const UndampedOscillationCanvas: React.FC<InteractiveAreaProps> = ({ sectionIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const [mass, setMass] = useState(1.0); // kg
  const [springConstant, setSpringConstant] = useState(10); // N/m
  
  // Simulation state
  const simState = useRef({ x: 0.8, v: 0, time: 0 }); // Initial displacement 0.8m, initial velocity 0 m/s
  const history = useRef<number[]>([]);

  const resetSimulation = useCallback(() => {
    simState.current = { x: 0.8, v: 0, time: 0 };
    history.current = [];
  }, []);

  // Effect to reset simulation when parameters change or section becomes active
  useEffect(() => {
    resetSimulation();
  }, [mass, springConstant, sectionIndex, resetSimulation]);


  const draw = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const textColor = theme === 'dark' ? '#ecf0f1' : '#333';
    const springColor = theme === 'dark' ? '#e0e0e0' : '#000000';
    const massColor = theme === 'dark' ? '#a0522d' : '#8B4513'; // Sienna for dark, Brown for light
    const massStrokeColor = theme === 'dark' ? '#80320d' : '#5a2c0a';
    const fixedWallColor = theme === 'dark' ? '#4a5568' : '#696969'; // Gray-700 for dark, DarkGray for light
    const historyLineColor = theme === 'dark' ? '#60a5fa' : 'blue'; // Lighter blue for dark

    drawAxes(ctx, canvasWidth, canvasHeight, { padding: 50, textColor });

    // Physical simulation drawing part (left side of canvas)
    const simWidth = canvasWidth * 0.4; // Use 40% of canvas for physical sim
    const graphWidth = canvasWidth * 0.6; // 60% for graph

    // Fixed wall
    ctx.fillStyle = fixedWallColor;
    ctx.fillRect(0, 0, 50, canvasHeight);

    // Spring and Mass
    const springY = canvasHeight / 2;
    const equilibriumX = 50 + simWidth * 0.3; // Equilibrium position of spring attachment to wall
    const currentMassCenterX = equilibriumX + simState.current.x * 50; // Scale displacement for drawing
    const massSize = 30;

    // Draw Spring
    ctx.strokeStyle = springColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, springY); // Fixed end of spring
    const numCoils = 10;
    const springRestLength = simWidth*0.3 - 10; // visual rest length
    const currentSpringVisualLength = springRestLength + simState.current.x * 50;

    if (currentSpringVisualLength > 5) { // only draw if not too compressed
        for (let i = 0; i < numCoils; i++) {
            const coilX = 50 + (i + 0.5) * (currentSpringVisualLength / numCoils);
            const coilYOffset = (i % 2 === 0 ? -1 : 1) * 8; // Zig-zag
            ctx.lineTo(coilX, springY + coilYOffset);
        }
    }
    ctx.lineTo(currentMassCenterX - massSize / 2, springY); // Connect to mass
    ctx.stroke();

    // Draw Mass
    ctx.fillStyle = massColor;
    ctx.strokeStyle = massStrokeColor;
    ctx.lineWidth = 1;
    ctx.fillRect(currentMassCenterX - massSize / 2, springY - massSize / 2, massSize, massSize);
    ctx.strokeRect(currentMassCenterX - massSize / 2, springY - massSize / 2, massSize, massSize);

    // History graph part (right side of canvas)
    ctx.strokeStyle = historyLineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const graphStartX = simWidth;
    const graphYCenter = canvasHeight / 2;
    const xScale = graphWidth / MAX_HISTORY;
    const yScale = canvasHeight / 4; // Max amplitude visual scale

    if (history.current.length > 0) {
      ctx.moveTo(graphStartX, graphYCenter - history.current[0] * yScale);
      for (let i = 1; i < history.current.length; i++) {
        ctx.lineTo(graphStartX + i * xScale, graphYCenter - history.current[i] * yScale);
      }
    }
    ctx.stroke();

  }, []);


  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = 0.02; // time step
    const newState = rk4Step(dt, simState.current, { m: mass, k: springConstant, beta: 0 });
    simState.current = { ...newState, time: simState.current.time + dt };

    history.current.push(simState.current.x);
    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    }
    
    draw(ctx, canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [mass, springConstant, draw]);

  useEffect(() => {
    resetSimulation(); // Reset on mount or when key props change
    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, mass, springConstant, sectionIndex, resetSimulation]); // sectionIndex dependency ensures re-init

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-custom-text-light dark:text-custom-text-dark">Simulador: Movimiento Libre No Amortiguado</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Ajusta los parámetros para ver cómo afectan el movimiento oscilatorio.</p>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <SliderControl id="mass_m1" label="Masa (m)" min={0.1} max={5} step={0.1} value={mass} onChange={setMass} unit="kg" />
        <SliderControl id="k_m1" label="Constante Resorte (k)" min={1} max={100} step={1} value={springConstant} onChange={setSpringConstant} unit="N/m" />
      </div>
      <canvas ref={canvasRef} width="600" height="300" className="border border-custom-border-light dark:border-custom-border-dark rounded bg-white dark:bg-gray-800 mx-auto max-w-full"></canvas>
      <button 
        onClick={() => exportCanvasAsImage(canvasRef.current, 'movimiento_no_amortiguado.png')}
        className="mt-4 px-4 py-2 bg-custom-secondary-button-bg-light hover:bg-custom-secondary-button-hover-light dark:bg-custom-secondary-button-bg-dark dark:hover:bg-custom-secondary-button-hover-dark text-white rounded-md transition-colors text-sm"
      >
        Exportar Gráfica
      </button>
    </div>
  );
};

