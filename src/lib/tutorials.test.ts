import { describe, it, expect } from "vitest";
import { isLevel, LEVELS } from "./tutorials";

describe("isLevel", () => {
  it("returns true for each LEVELS member", () => {
    for (const level of LEVELS) {
      expect(isLevel(level)).toBe(true);
    }
  });

  it("returns false for a non-level name", () => {
    expect(isLevel("Expert")).toBe(false);
    expect(isLevel("")).toBe(false);
  });
});
