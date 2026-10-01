import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots.txt", () => {
  it("bloque /go/ et /admin/ pour tous les robots", () => {
    const rules = robots().rules;
    const list = Array.isArray(rules) ? rules : [rules];
    expect(list).toContainEqual(
      expect.objectContaining({
        userAgent: "*",
        disallow: expect.arrayContaining(["/go/", "/admin/"]),
      }),
    );
  });
});
