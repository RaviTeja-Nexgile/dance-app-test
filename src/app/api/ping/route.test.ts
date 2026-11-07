import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/ping", () => {
  it("returns { ok: true } as JSON", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });
});
