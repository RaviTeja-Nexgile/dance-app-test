import { describe, it, expect } from "vitest";
import { CATEGORIES, isCategory } from "./tutorials";

describe("isCategory", () => {
  it("returns true for each offered category", () => {
    for (const category of CATEGORIES) {
      expect(isCategory(category)).toBe(true);
    }
  });

  it("returns false for a value that is not a category", () => {
    expect(isCategory("Beginner")).toBe(false);
    expect(isCategory("")).toBe(false);
    expect(isCategory("Hip Hop")).toBe(false);
  });
});
