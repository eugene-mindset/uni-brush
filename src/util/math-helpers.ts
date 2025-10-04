import { Vector3 } from "three";

export function randomFromGaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);

  return { z0, z1 };
}

export function randomFromNormal(mean: number, stddev: number) {
  const { z0, z1 } = randomFromGaussian();
  return { z0: z0 * stddev + mean, z1: z1 * stddev + mean };
}

export function randomPercentFromNormal() {
  const { z0, z1 } = randomFromNormal(0, 1 / 4);
  return { z0: clamp(z0, -1, 1), z1: clamp(z1, -1, 1) };
}

export function randomSigned(): number {
  return Math.random() * 2 - 1;
}

export function randomVectorFromNormal() {
  return new Vector3(
    randomPercentFromNormal().z0,
    randomPercentFromNormal().z0,
    randomPercentFromNormal().z0
  );
}

export function applyJitter(vec: Vector3, amount: number): Vector3 {
  const out = new Vector3();
  const jitter = new Vector3(randomSigned(), randomSigned(), randomSigned());

  return out.addVectors(vec, jitter.multiplyScalar(amount));
}

export function clamp(x: number, a: number, b: number): number {
  return Math.min(Math.max(a, x), b);
}

export function lerp(start: number, end: number, alpha: number): number {
  return start * (1 - alpha) + end * alpha;
}
