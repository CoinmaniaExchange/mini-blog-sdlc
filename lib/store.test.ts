import { describe, expect, it } from "vitest";
import { storeErrorResponse } from "./store";

describe("storeErrorResponse", () => {
  it("EROFS → 503 დემო-რეჟიმის ქართული მესიჯით", async () => {
    const err = Object.assign(new Error("read-only"), { code: "EROFS" });
    const res = storeErrorResponse(err);
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch("დემო რეჟიმში");
  });

  it("უცნობი ერორი → 500", async () => {
    const res = storeErrorResponse(new Error("boom"));
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch("სერვერის შეცდომა");
  });
});
