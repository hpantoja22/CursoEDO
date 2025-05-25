
import React from 'react';
import { Section } from './types';
import { IntroSpringMassSVG } from './components/simulations/IntroSpringMassSVG';
import { UndampedOscillationCanvas } from './components/simulations/UndampedOscillationCanvas';
import { DampedOscillationCanvas } from './components/simulations/DampedOscillationCanvas';
import { SandboxCanvas } from './components/simulations/SandboxCanvas';

// Generic Icon (can be replaced with specific icons later)
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V13H8.5v-2H11V6.5h2V11h2.5v2H13v4.5h-2z"/>
  </svg>
);


export const courseSections: Section[] = [
  {
    id: 'intro',
    title: 'Introducción al Sistema Resorte-Masa',
    Icon: InfoIcon,
    learningObjectives: [
      'Comprender los componentes básicos de un sistema resorte-masa.',
      'Familiarizarse con los conceptos de fuerza restauradora y la Ley de Hooke.',
      'Visualizar el movimiento oscilatorio simple.',
    ],
    introduction: (
      <p className="mb-4">Un sistema resorte-masa es un modelo fundamental en física e ingeniería para estudiar el movimiento oscilatorio. Consiste en una masa unida a un resorte, que se mueve a lo largo de una dirección (generalmente horizontal o vertical) sin fricción.</p>
    ),
    contentBlocks: [
      { type: 'heading', level: 3, text: 'Conceptos Clave:' },
      { type: 'list', items: [
        '<strong>Fuerza Restauradora:</strong> Es la fuerza que ejerce el resorte para devolver la masa a su posición de equilibrio. Siempre actúa en dirección opuesta al desplazamiento.',
        '<strong>Ley de Hooke:</strong> Establece que la fuerza restauradora (F<sub>s</sub>) de un resorte es directamente proporcional al desplazamiento (x) del resorte desde su posición de equilibrio, pero en dirección opuesta. Matemáticamente: F<sub>s</sub> = -kx, donde (k) es la constante del resorte (rigidez).',
        '<strong>Masa (m):</strong> La cantidad de inercia del objeto unido al resorte.'
      ]},
    ],
    interactiveArea: IntroSpringMassSVG,
    exercise: {
      type: 'text',
      question: 'Si un resorte se estira 0.2 metros y la constante del resorte es 50 N/m, ¿cuál es la magnitud de la fuerza restauradora?',
      correctAnswer: 10,
      feedbackKey: 'intro_exercise_feedback',
      inputId: 'intro_exercise_answer',
      explanation: 'La fuerza restauradora F = kx = 50 N/m * 0.2 m = 10 N. La magnitud es 10 N.'
    },
  },
  {
    id: 'module1',
    title: 'Módulo 1: Movimiento Libre No Amortiguado',
    Icon: InfoIcon,
    learningObjectives: [
      'Deducir la Ecuación Diferencial Ordinaria (EDO) para el movimiento libre no amortiguado.',
      'Comprender la solución general y su naturaleza oscilatoria.',
      'Simular el movimiento y observar el impacto de la masa y la constante del resorte.',
    ],
    introduction: (
      <>
        <h3 className="text-xl font-semibold mb-2 text-custom-header-bg-light dark:text-custom-header-bg-dark">Deducción de la EDO:</h3>
        <p className="mb-2">Aplicamos la Segunda Ley de Newton (F = ma) al sistema resorte-masa. La única fuerza que actúa sobre la masa es la fuerza restauradora del resorte (F<sub>s</sub> = -kx), asumiendo que no hay fricción ni amortiguamiento.</p>
        <p className="mb-2">Entonces, ma = -kx.</p>
        <p className="mb-2">Sabemos que la aceleración (a) es la segunda derivada de la posición (x) con respecto al tiempo (t), es decir, a = d<sup>2</sup>x/dt<sup>2</sup>.</p>
        <p className="mb-2">Sustituyendo esto en la ecuación, obtenemos la EDO:</p>
        <p className="text-lg text-center font-bold my-4 p-2 bg-custom-input-bg-light dark:bg-custom-input-bg-dark rounded">m(d<sup>2</sup>x/dt<sup>2</sup>) + kx = 0</p>
        <p className="mb-2">Esta es una ecuación diferencial lineal homogénea de segundo orden con coeficientes constantes. Su solución describe un Movimiento Armónico Simple (MAS).</p>
      </>
    ),
    contentBlocks: [
      { type: 'heading', level: 3, text: 'Solución General:' },
      { type: 'paragraph', text: 'La solución general de esta EDO es una combinación lineal de funciones seno y coseno:' },
      { type: 'formula', text: 'x(t) = Acos(ω<sub>0</sub>t) + Bsin(ω<sub>0</sub>t)', className: 'text-lg text-center font-bold my-4 p-2 bg-custom-input-bg-light dark:bg-custom-input-bg-dark rounded' },
      { type: 'paragraph', text: 'O, de forma equivalente:' },
      { type: 'formula', text: 'x(t) = Ccos(ω<sub>0</sub>t - δ)', className: 'text-lg text-center font-bold my-4 p-2 bg-custom-input-bg-light dark:bg-custom-input-bg-dark rounded' },
      { type: 'paragraph', text: 'Donde:' },
      { type: 'list', items: [
          'A y B son constantes que dependen de las condiciones iniciales (x(0) y x\'(0)).',
          'C = √(A<sup>2</sup> + B<sup>2</sup>) es la amplitud del movimiento.',
          'δ = arctan(B/A) es el desfase.',
          'ω<sub>0</sub> = √(k/m) es la frecuencia angular natural del sistema (en rad/s).',
      ]},
      { type: 'paragraph', text: 'La frecuencia natural (f<sub>0</sub>) es ω<sub>0</sub> / (2π) y el período (T<sub>0</sub>) es 1/f<sub>0</sub> = 2π/ω<sub>0</sub>.'},
    ],
    interactiveArea: UndampedOscillationCanvas,
    exercise: {
      type: 'radio',
      question: 'Si la masa se duplica, ¿qué le sucede aproximadamente al período de oscilación?',
      options: [
        { label: 'Se duplica', value: 'duplica' },
        { label: 'Se reduce a la mitad', value: 'mitad' },
        { label: 'Aumenta por un factor de √2', value: 'raiz2' },
        { label: 'Disminuye por un factor de 1/√2', value: '1/raiz2' },
      ],
      correctAnswer: 'raiz2',
      feedbackKey: 'm1_exercise_feedback',
      radioGroupName: 'm1_q1',
      explanation: 'El período T = 2π√(m/k). Si m se duplica, T aumenta por √2.'
    },
  },
  {
    id: 'module2',
    title: 'Módulo 2: Movimiento Amortiguado',
    Icon: InfoIcon,
    learningObjectives: [
      'Comprender el concepto de amortiguamiento en sistemas oscilatorios.',
      'Deducir la EDO para el movimiento amortiguado.',
      'Clasificar los tipos de movimiento amortiguado (subamortiguado, críticamente amortiguado, sobreamortiguado).',
      'Observar gráficamente el impacto del coeficiente de amortiguamiento.',
    ],
    introduction: (
      <>
        <h3 className="text-xl font-semibold mb-2 text-custom-header-bg-light dark:text-custom-header-bg-dark">Modelado del Movimiento Amortiguado:</h3>
        <p className="mb-2">En la realidad, la fricción o resistencia del aire disipa energía del sistema. Esta fuerza de amortiguamiento (F<sub>d</sub>) es generalmente proporcional a la velocidad de la masa, pero en dirección opuesta:</p>
        <p className="text-lg text-center font-bold my-4 p-2 bg-custom-input-bg-light dark:bg-custom-input-bg-dark rounded">F<sub>d</sub> = -β(dx/dt)</p>
        <p className="mb-2">Donde β (beta) es el coeficiente de amortiguamiento, una constante positiva.</p>
        <p className="mb-2">Aplicando de nuevo la Segunda Ley de Newton, ahora sumamos ambas fuerzas (F<sub>s</sub> y F<sub>d</sub>):</p>
        <p className="mb-2">ΣF = ma ⇒ -kx - β(dx/dt) = m(d<sup>2</sup>x/dt<sup>2</sup>)</p>
        <p className="mb-2">Reorganizando, obtenemos la EDO para el movimiento amortiguado:</p>
        <p className="text-lg text-center font-bold my-4 p-2 bg-custom-input-bg-light dark:bg-custom-input-bg-dark rounded">m(d<sup>2</sup>x/dt<sup>2</sup>) + β(dx/dt) + kx = 0</p>
      </>
    ),
    contentBlocks: [
        { type: 'heading', level: 3, text: 'Clasificación de Casos:'},
        { type: 'paragraph', text: 'La naturaleza de la solución de esta EDO depende del valor del coeficiente de amortiguamiento β en relación con la masa m y la constante del resorte k. Esto se determina analizando las raíces de la ecuación característica. El discriminante clave es Δ = β<sup>2</sup> - 4mk.'},
        { type: 'heading', level: 4, text: 'Descripción de los Casos:'},
        { type: 'list', items: [
            '<strong>Sobreamortiguado (β<sup>2</sup> - 4mk > 0):</strong> El sistema vuelve a la posición de equilibrio lentamente sin oscilar. El amortiguamiento es tan fuerte que impide cualquier oscilación. Gráfica: Decaimiento exponencial suave.',
            '<strong>Críticamente Amortiguado (β<sup>2</sup> - 4mk = 0):</strong> El sistema regresa a la posición de equilibrio lo más rápido posible sin oscilar. Es el punto óptimo entre la rapidez de retorno y evitar oscilaciones. Gráfica: Decaimiento exponencial rápido sin oscilación.',
            '<strong>Subamortiguado (β<sup>2</sup> - 4mk < 0):</strong> El sistema oscila con una amplitud que disminuye gradualmente hasta detenerse. Es el caso más común en la realidad cuando hay amortiguamiento pero no es excesivo. Gráfica: Oscilación con amplitud decreciente (envolvente exponencial).'
        ]}
    ],
    interactiveArea: DampedOscillationCanvas,
  },
   {
    id: 'sandbox',
    title: 'Sandbox: Combina Modelos y Experimenta',
    Icon: InfoIcon,
    learningObjectives: [
      'Aplicar los conocimientos de los modelos no amortiguado y amortiguado.',
      'Experimentar libremente con todos los parámetros.',
      'Visualizar cómo cada parámetro influye en el comportamiento del sistema.',
    ],
    introduction: (
      <>
        <p className="mb-4">¡Bienvenido al laboratorio de sistemas resorte-masa! Aquí puedes ajustar la masa, la constante del resorte y el coeficiente de amortiguamiento para ver cómo el sistema se comporta bajo diferentes condiciones. Puedes simular desde oscilaciones perpetuas hasta decaimientos rápidos.</p>
        <p className="mb-4">¡Felicidades! Has completado el curso sobre sistemas resorte-masa y ecuaciones diferenciales.</p>
      </>
    ),
    contentBlocks: [],
    interactiveArea: SandboxCanvas,
  },
];
