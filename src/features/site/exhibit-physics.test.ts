import { describe, expect, it } from "vitest";
import {
  createMascotState,
  idleRock,
  type MascotInput,
  stepMascot,
} from "./exhibit-physics";

const YAW = -0.25;
const DT = 1 / 60;
const free: MascotInput = {
  dragging: false,
  holdTilt: 0,
  spinDelta: 0,
  spinVelocity: null,
  push: null,
};

function run(
  steps: number,
  input: MascotInput,
  state = createMascotState(),
  t0 = 0,
) {
  let pose = stepMascot(state, input, DT, t0, YAW);
  const poses = [pose];
  for (let i = 1; i < steps; i++) {
    pose = stepMascot(state, input, DT, t0 + i * DT, YAW);
    poses.push(pose);
  }
  return { state, pose, poses, t: t0 + steps * DT };
}

describe("stepMascot", () => {
  it("settles back to the idle rock after a push", () => {
    const state = createMascotState();
    stepMascot(state, { ...free, push: { a: 3.5, b: 0 } }, DT, 0, YAW);
    const { pose, t } = run(20 * 60, free, state, DT);
    expect(Math.abs(pose.tiltA - idleRock(t - DT).a)).toBeLessThan(0.02);
  });

  it("holds the tilt while dragging toward the viewer", () => {
    const { pose } = run(120, { ...free, dragging: true, holdTilt: 0.3 });
    expect(pose.tiltB).toBeCloseTo(0.3 * Math.cos(YAW), 1);
    expect(Math.abs(pose.tiltB - 0.3 * Math.cos(YAW))).toBeLessThan(0.03);
  });

  it("spins by the given delta without a drag (a horizontal mouse swipe)", () => {
    const { pose } = run(1, { ...free, spinDelta: 0.5, spinVelocity: 0 });
    expect(pose.spin).toBeCloseTo(0.5, 5);
  });

  it("springs back past upright when released", () => {
    const held = run(120, { ...free, dragging: true, holdTilt: 0.3 });
    const { poses } = run(90, free, held.state, held.t);
    expect(poses.some((p) => p.tiltB < 0)).toBe(true);
  });

  it("never tilts further than 0.5 rad", () => {
    const state = createMascotState();
    stepMascot(state, { ...free, push: { a: 100, b: -100 } }, DT, 0, YAW);
    const { poses } = run(240, free, state, DT);
    for (const p of poses) {
      expect(Math.abs(p.tiltA)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(p.tiltB)).toBeLessThanOrEqual(0.5);
    }
  });

  it("keeps spinning after a flick, then stops", () => {
    const state = createMascotState();
    stepMascot(state, { ...free, spinVelocity: 6 }, DT, 0, YAW);
    const early = run(30, free, state, DT);
    expect(early.pose.spin).toBeGreaterThan(0.5);
    const late = run(4 * 60, free, state, early.t);
    const last = late.poses.at(-1)!.spin - late.poses.at(-2)!.spin;
    expect(Math.abs(last)).toBeLessThan(0.001);
  });

  it("spins by the drag distance while dragging, without inertia", () => {
    const state = createMascotState();
    stepMascot(state, { ...free, dragging: true, spinDelta: 0.4 }, DT, 0, YAW);
    const after = stepMascot(state, { ...free, dragging: true }, DT, DT, YAW);
    expect(after.spin).toBeCloseTo(0.4, 5);
  });
});
