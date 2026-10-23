// Roly-poly motion for the exhibit stage, ported from the approved prototype
// (experiments/nevalyashka/stage-lab.html). Pure and frame-rate independent
// enough to unit-test: the canvas feeds pointer input, this returns the pose
// the shader draws.

export type MascotInput = {
  /** A pointer is down on the stage. */
  dragging: boolean;
  /** Tilt held by the hand while dragging (+ = toward the viewer), already clamped. */
  holdTilt: number;
  /** Spin to add this frame (drag or horizontal swipe), in radians. */
  spinDelta: number;
  /** Sets the free-spin velocity (rad/s), e.g. on release; null keeps it. */
  spinVelocity: number | null;
  /** One-off impulse (rad/s) from a tap. */
  push: { a: number; b: number } | null;
};

export type MascotPose = {
  /** Roll about z and pitch about x, radians. */
  tiltA: number;
  tiltB: number;
  /** Jelly lag of head and antenna, in local units. */
  lagX: number;
  lagZ: number;
  /** Rotation about the mascot's own vertical axis. */
  spin: number;
};

type Spring = { a: number; b: number; va: number; vb: number };
type Lag = { x: number; z: number; vx: number; vz: number };

export type MascotState = {
  /** The spring the mascot rocks on after a push. */
  free: { w: number; zeta: number };
  push: Spring;
  lag: Lag;
  prevA: number;
  prevB: number;
  spin: number;
  spinVel: number;
  hold: number;
};

const FREE = { w: 3.4, zeta: 0.08 };
/**
 * Touch devices rock calmer after a tap: ~1.2 s swings, three or four visible
 * before it settles. The desktop keeps FREE (owner, 2026-10-23).
 */
export const PHONE_SPRING = { w: 2.6, zeta: 0.25 };
const HELD = { w: 9, zeta: 0.9 };
const LAG = { w: 11, zeta: 0.22, gain: 0.05, max: 0.14 };
const MAX_TILT = 0.5;
const SPIN_DECAY = 3;
const HOLD_RATE = 6;

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

export function createMascotState({
  free = FREE,
}: { free?: { w: number; zeta: number } } = {}): MascotState {
  return {
    free,
    push: { a: 0, b: 0, va: 0, vb: 0 },
    lag: { x: 0, z: 0, vx: 0, vz: 0 },
    prevA: 0,
    prevB: 0,
    spin: 0,
    spinVel: 0,
    hold: 0,
  };
}

/** The gentle rocking the mascot does on its own. */
export function idleRock(time: number): { a: number; b: number } {
  return {
    a: 0.16 * Math.sin(time * 2.3) * (0.75 + 0.25 * Math.cos(time * 0.41)),
    b: 0.1 * Math.sin(time * 1.63 + 1.3),
  };
}

export function stepMascot(
  state: MascotState,
  input: MascotInput,
  rawDt: number,
  time: number,
  yaw: number,
): MascotPose {
  const dt = Math.min(Math.max(rawDt, 1e-4), 1 / 30);
  const { push, lag } = state;

  if (input.spinVelocity !== null) state.spinVel = input.spinVelocity;
  state.spin += input.spinDelta;
  if (!input.dragging) {
    state.spin += state.spinVel * dt;
    state.spinVel *= Math.exp(-SPIN_DECAY * dt);
  }

  if (input.push) {
    push.va += input.push.a;
    push.vb += input.push.b;
  }

  // While held, the top is pulled toward the hand's tilt by a stiff spring;
  // released, its own soft spring rocks it back past upright.
  const holding = input.dragging && input.holdTilt !== 0;
  const target = holding
    ? { a: -input.holdTilt * Math.sin(yaw), b: input.holdTilt * Math.cos(yaw) }
    : { a: 0, b: 0 };
  const k = holding ? HELD : state.free;
  push.va +=
    (-k.w * k.w * (push.a - target.a) - 2 * k.zeta * k.w * push.va) * dt;
  push.vb +=
    (-k.w * k.w * (push.b - target.b) - 2 * k.zeta * k.w * push.vb) * dt;
  push.a += push.va * dt;
  push.b += push.vb * dt;

  state.hold += ((holding ? 1 : 0) - state.hold) * Math.min(1, dt * HOLD_RATE);
  const idle = idleRock(time);
  const tiltA = clamp(push.a + (1 - state.hold) * idle.a, MAX_TILT);
  const tiltB = clamp(push.b + (1 - state.hold) * idle.b, MAX_TILT);

  const da = (tiltA - state.prevA) / dt;
  const db = (tiltB - state.prevB) / dt;
  state.prevA = tiltA;
  state.prevB = tiltB;
  lag.vx +=
    (-LAG.w * LAG.w * (lag.x - LAG.gain * da) - 2 * LAG.zeta * LAG.w * lag.vx) *
    dt;
  lag.vz +=
    (-LAG.w * LAG.w * (lag.z + LAG.gain * db) - 2 * LAG.zeta * LAG.w * lag.vz) *
    dt;
  lag.x = clamp(lag.x + lag.vx * dt, LAG.max);
  lag.z = clamp(lag.z + lag.vz * dt, LAG.max);

  return { tiltA, tiltB, lagX: lag.x, lagZ: lag.z, spin: state.spin };
}

// A touch hit lands on release; a flick nudges, a short press swings fully.
const FLICK_MS = 80;
const PRESS_MS = 350;
const FLICK_SHARE = 0.4;

/** Share of the full kick for a touch that rested `heldMs` before release. */
export function tapKick(heldMs: number): number {
  const k = Math.min(
    Math.max((heldMs - FLICK_MS) / (PRESS_MS - FLICK_MS), 0),
    1,
  );
  return FLICK_SHARE + (1 - FLICK_SHARE) * k;
}
