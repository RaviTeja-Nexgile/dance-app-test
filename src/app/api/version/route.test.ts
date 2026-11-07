import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/version", () => {
  it("returns the version as JSON", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ version: "0.1.0" });
  });
});
