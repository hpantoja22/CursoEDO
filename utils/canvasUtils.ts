
export const exportCanvasAsImage = (canvas: HTMLCanvasElement | null, filename: string) => {
  if (!canvas) return;
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper for drawing axes, if needed across multiple simulations
export const drawAxes = (
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  options?: { 
    padding?: number, 
    xLabel?: string, 
    yLabel?: string, 
    textColor?: string 
  }
) => {
  const padding = options?.padding ?? 50; // Default padding
  const textColor = options?.textColor ?? '#333';

  ctx.save();
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.fillStyle = textColor;
  ctx.font = '12px Arial';

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding / 2);
  ctx.lineTo(padding, canvasHeight - padding / 2);
  ctx.stroke();
  if (options?.yLabel) {
    ctx.textAlign = 'center';
    ctx.fillText(options.yLabel, padding / 2, canvasHeight / 2);
  }


  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding / 2, canvasHeight / 2); // Centered X-axis
  ctx.lineTo(canvasWidth - padding / 2, canvasHeight / 2);
  ctx.stroke();
  if (options?.xLabel) {
    ctx.textAlign = 'right';
    ctx.fillText(options.xLabel, canvasWidth - padding / 2, canvasHeight / 2 + 15);
  }
  
  ctx.restore();
};
