
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SliderControl } from '../SliderControl';
import { rk4Step } from '../../utils/math';
import { exportCanvasAsImage, drawAxes } from '../../utils/canvasUtils';
import { InteractiveAreaProps } from '../../types';

const MAX_TIME_PLOT = 10; // seconds to plot
const DT_PLOT = 0.05; // time step for plotting points

export const DampedOscillationCanvas: React.FC<InteractiveAreaProps> = ({ sectionIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mass, setMass] = useState(1.0);
  const [springConstant, setSpringConstant] = useState(10);
  const [dampingCoefficient, setDampingCoefficient] = useState(0.5); // beta

  const [discriminantInfo, setDiscriminantInfo] = useState({ value: 0, type: 'Subamortiguado', color: 'text-green-500 dark:text-green-400' });

  const drawSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const textColor = theme === 'dark' ? '#ecf0f1' : '#333';
    const plotLineColor = theme === 'dark' ? '#60a5fa' : 'blue';


    drawAxes(ctx, canvas.width, canvas.height, { 
      padding: 50, 
      xLabel: 'Tiempo (s)', 
      yLabel: 'Posición (x)',
      textColor: textColor
    });
    
    let simX = 1; // Initial displacement
    let simV = 0; // Initial velocity
    const historyPoints: {t: number, x: number}[] = [];

    for (let t = 0; t <= MAX_TIME_PLOT; t += DT_PLOT) {
      historyPoints.push({ t, x: simX });
      const newState = rk4Step(DT_PLOT, { x: simX, v: simV }, { m: mass, k: springConstant, beta: dampingCoefficient });
      simX = newState.x;
      simV = newState.v;
    }

    ctx.strokeStyle = plotLineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xOffset = 50; // axes padding
    const yOffset = canvas.height / 2; // x-axis position
    const xScale = (canvas.width - xOffset * 1.5) / MAX_TIME_PLOT;
    const yScale = canvas.height / 4; // Max amplitude 1, so scale to 1/4 of height from center

    if (historyPoints.length > 0) {
      ctx.moveTo(xOffset + historyPoints[0].t * xScale, yOffset - historyPoints[0].x * yScale);
      historyPoints.forEach(point => {
        ctx.lineTo(xOffset + point.t * xScale, yOffset - point.x * yScale);
      });
    }
    ctx.stroke();

  }, [mass, springConstant, dampingCoefficient]);

  useEffect(() => {
    drawSimulation();
  }, [drawSimulation, sectionIndex]); // sectionIndex to redraw if section re-activated

  useEffect(() => {
    const d = dampingCoefficient * dampingCoefficient - 4 * mass * springConstant;
    let type = '';
    let color = '';
    if (d > 0.01) { // Add a small epsilon for floating point comparison
      type = 'Sobreamortiguado';
      color = 'text-red-500 dark:text-red-400';
    } else if (d < -0.01) {
      type = 'Subamortiguado';
      color = 'text-green-500 dark:text-green-400';
    } else {
      type = 'Críticamente Amortiguado';
      color = 'text-yellow-500 dark:text-yellow-400';
    }
    setDiscriminantInfo({ value: d, type, color });
  }, [mass, springConstant, dampingCoefficient]);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-custom-text-light dark:text-custom-text-dark">Explora los casos de amortiguamiento:</h3>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <SliderControl id="mass_m2" label="Masa (m)" min={0.1} max={5} step={0.1} value={mass} onChange={setMass} unit="kg" />
        <SliderControl id="k_m2" label="Constante Resorte (k)" min={1} max={100} step={1} value={springConstant} onChange={setSpringConstant} unit="N/m" />
        <SliderControl id="beta_m2" label="Coef. Amortiguamiento (β)" min={0} max={20} step={0.1} value={dampingCoefficient} onChange={setDampingCoefficient} unit="Ns/m" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Discriminante: Δ = β<sup>2</sup> - 4mk = <span className="font-bold">{discriminantInfo.value.toFixed(2)}</span></p>
      <h3 className={`text-md font-semibold my-2 ${discriminantInfo.color}`}>Tipo de Movimiento: {discriminantInfo.type}</h3>
      <canvas ref={canvasRef} width="600" height="300" className="border border-custom-border-light dark:border-custom-border-dark rounded bg-white dark:bg-gray-800 mx-auto max-w-full"></canvas>
       <button 
        onClick={() => exportCanvasAsImage(canvasRef.current, 'movimiento_amortiguado.png')}
        className="mt-4 px-4 py-2 bg-custom-secondary-button-bg-light hover:bg-custom-secondary-button-hover-light dark:bg-custom-secondary-button-bg-dark dark:hover:bg-custom-secondary-button-hover-dark text-white rounded-md transition-colors text-sm"
      >
        Exportar Gráfica
      </button>
    </div>
  );
};
