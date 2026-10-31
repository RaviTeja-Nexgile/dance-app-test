import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "./auth";

describe("auth", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("password123");
    expect(hash).not.toBe("password123");
    expect(await verifyPassword("password123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("creates and verifies a session token", async () => {
    const token = await createSessionToken("user-1");
    expect(await verifySessionToken(token)).toBe("user-1");
  });

  it("rejects a tampered session token", async () => {
    const token = await createSessionToken("user-1");
    const [userId, sig] = token.split(".");
    const tampered = `${userId}.${"0".repeat(sig.length)}`;
    expect(await verifySessionToken(tampered)).toBeNull();
  });

  it("rejects a token with no signature", async () => {
    expect(await verifySessionToken("user-1")).toBeNull();
  });
});
