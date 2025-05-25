
// RK4 integrator for solving ODEs of the form m*x'' + beta*x' + k*x = 0
// It solves for x' = v and v' = (-k*x - beta*v) / m

interface RK4State {
  x: number; // position
  v: number; // velocity
}

interface RK4Params {
  m: number;    // mass
  k: number;    // spring constant
  beta: number; // damping coefficient
}

export function rk4Step(dt: number, currentState: RK4State, params: RK4Params): RK4State {
  const { x, v } = currentState;
  const { m, k, beta } = params;

  // Function for acceleration: a = dv/dt = (-k*x - beta*v) / m
  const accelerationFunc = (posX: number, velX: number) => (-k * posX - beta * velX) / m;

  // k1: slopes at the beginning of the interval
  const k1_x_slope = v;
  const k1_v_slope = accelerationFunc(x, v);

  // k2: slopes at the midpoint of the interval, using k1
  const k2_x_slope = v + 0.5 * dt * k1_v_slope;
  const k2_v_slope = accelerationFunc(x + 0.5 * dt * k1_x_slope, v + 0.5 * dt * k1_v_slope);
  
  // k3: slopes at the midpoint, using k2 (more accurate midpoint estimate)
  const k3_x_slope = v + 0.5 * dt * k2_v_slope;
  const k3_v_slope = accelerationFunc(x + 0.5 * dt * k2_x_slope, v + 0.5 * dt * k2_v_slope);

  // k4: slopes at the end of the interval, using k3
  const k4_x_slope = v + dt * k3_v_slope;
  const k4_v_slope = accelerationFunc(x + dt * k3_x_slope, v + dt * k3_v_slope);

  // Weighted average of slopes to get new position and velocity
  const new_x = x + (dt / 6) * (k1_x_slope + 2 * k2_x_slope + 2 * k3_x_slope + k4_x_slope);
  const new_v = v + (dt / 6) * (k1_v_slope + 2 * k2_v_slope + 2 * k3_v_slope + k4_v_slope);

  return { x: new_x, v: new_v };
}
