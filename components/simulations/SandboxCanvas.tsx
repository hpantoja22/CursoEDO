
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SliderControl } from '../SliderControl';
import { rk4Step } from '../../utils/math';
import { exportCanvasAsImage, drawAxes } from '../../utils/canvasUtils';
import { InteractiveAreaProps } from '../../types';

const MAX_HISTORY_SANDBOX = 500; // Points for graph plotting
const DT_SIM_SANDBOX = 0.02; // Simulation time step

export const SandboxCanvas: React.FC<InteractiveAreaProps> = ({ sectionIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const [mass, setMass] = useState(1.0);
  const [springConstant, setSpringConstant] = useState(10);
  const [dampingCoefficient, setDampingCoefficient] = useState(0.5);
  
  const simState = useRef({ x: 0.8, v: 0, time: 0 });
  const history = useRef<number[]>([]);

  const resetSimulation = useCallback(() => {
    simState.current = { x: 0.8, v: 0, time: 0 };
    history.current = [];
  }, []);

  useEffect(() => {
    resetSimulation();
  }, [mass, springConstant, dampingCoefficient, sectionIndex, resetSimulation]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const textColor = theme === 'dark' ? '#ecf0f1' : '#333';
    const plotLineColor = theme === 'dark' ? '#60a5fa' : 'blue';

    drawAxes(ctx, canvasWidth, canvasHeight, { padding: 50, textColor });

    ctx.strokeStyle = plotLineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const xOffset = 50; // axes padding
    const yOffset = canvasHeight / 2; // x-axis position
    const xScale = (canvasWidth - xOffset * 1.5) / MAX_HISTORY_SANDBOX;
    const yScale = canvasHeight / 4; // Max amplitude visual scale

    if (history.current.length > 0) {
      ctx.moveTo(xOffset, yOffset - history.current[0] * yScale);
      for (let i = 1; i < history.current.length; i++) {
        ctx.lineTo(xOffset + i * xScale, yOffset - history.current[i] * yScale);
      }
    }
    ctx.stroke();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newState = rk4Step(DT_SIM_SANDBOX, simState.current, { m: mass, k: springConstant, beta: dampingCoefficient });
    simState.current = { ...newState, time: simState.current.time + DT_SIM_SANDBOX };

    history.current.push(simState.current.x);
    if (history.current.length > MAX_HISTORY_SANDBOX) {
      history.current.shift();
    }
    
    draw(ctx, canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [mass, springConstant, dampingCoefficient, draw]);

  useEffect(() => {
    resetSimulation(); // Ensure reset when parameters change
    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, mass, springConstant, dampingCoefficient, sectionIndex, resetSimulation]);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-custom-text-light dark:text-custom-text-dark">Simulador Combinado</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Modifica los deslizadores y observa el movimiento y la gráfica.</p>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <SliderControl id="mass_s" label="Masa (m)" min={0.1} max={5} step={0.1} value={mass} onChange={setMass} unit="kg" />
        <SliderControl id="k_s" label="Constante Resorte (k)" min={1} max={100} step={1} value={springConstant} onChange={setSpringConstant} unit="N/m" />
        <SliderControl id="beta_s" label="Coef. Amortiguamiento (β)" min={0} max={20} step={0.1} value={dampingCoefficient} onChange={setDampingCoefficient} unit="Ns/m" />
      </div>
      <canvas ref={canvasRef} width="600" height="300" className="border border-custom-border-light dark:border-custom-border-dark rounded bg-white dark:bg-gray-800 mx-auto max-w-full"></canvas>
       <button 
        onClick={() => exportCanvasAsImage(canvasRef.current, 'sandbox_simulacion.png')}
        className="mt-4 px-4 py-2 bg-custom-secondary-button-bg-light hover:bg-custom-secondary-button-hover-light dark:bg-custom-secondary-button-bg-dark dark:hover:bg-custom-secondary-button-hover-dark text-white rounded-md transition-colors text-sm"
      >
        Exportar Gráfica
      </button>
    </div>
  );
};
