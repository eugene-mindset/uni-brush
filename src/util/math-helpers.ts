import { Vector3 } from "three";

/**
 * Generate two random variables produced from the Gaussian distribution, utilizing Box–Muller transform
 * @returns two random numbers
 */
export function randomFromGaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);

  return { z0, z1 };
}

/**
 * Generate two random values from a normal distribution
 * @param mean the average of distribution
 * @param stddev the deviation of distribution
 * @returns two random numbers
 */
export function randomFromNormal(mean: number, stddev: number) {
  const { z0, z1 } = randomFromGaussian();
  return { z0: z0 * stddev + mean, z1: z1 * stddev + mean };
}

/**
 * Generate two random values from a normal distribution approximating percentages between 1 and -1
 * @returns two random numbers
 */
export function randomPercentFromNormal() {
  const { z0, z1 } = randomFromNormal(0, 1 / 4);
  return { z0: clamp(z0, -1, 1), z1: clamp(z1, -1, 1) };
}

/**
 * Generate a random signed number
 * @returns random number
 */
export function randomSigned(): number {
  return Math.random() * 2 - 1;
}

/**
 * Generate a random vector with each coordinate being a normal distribution of signed percentages
 * @returns a random vector
 */
export function randomVectorFromNormal() {
  return new Vector3(
    randomPercentFromNormal().z0,
    randomPercentFromNormal().z0,
    randomPercentFromNormal().z0
  );
}

/**
 * Add randomness to a vector
 * @param vec vector to jitter
 * @param amount amount of change from randomness
 * @returns vector
 */
export function applyJitter(vec: Vector3, amount: number): Vector3 {
  const out = new Vector3();
  const jitter = new Vector3(randomSigned(), randomSigned(), randomSigned());

  return out.addVectors(vec, jitter.multiplyScalar(amount));
}

/**
 *
 * @param x value to clamp
 * @param lo lowest value x can be
 * @param hi highest value x can be
 * @returns clamped x
 */
export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(Math.max(lo, x), hi);
}

/**
 * Interpolate between two values
 * @param start value to shift from
 * @param end value to shift to
 * @param alpha amount to shift between start and end
 * @returns number
 */
export function lerp(start: number, end: number, alpha: number): number {
  return start * (1 - alpha) + end * alpha;
}

export function calculateEllipsoidDistRatio(point: Vector3, dim: Vector3): number {
  return new Vector3(point.x / dim.x, point.y / dim.y, point.z / dim.z).length();
}
