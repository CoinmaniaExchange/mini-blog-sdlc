import { describe, expect, it } from "vitest";
import {
  excerpt,
  normalizePage,
  normalizePageSize,
  parseTags,
  validateComment,
  validatePost,
} from "./validation";

describe("parseTags", () => {
  it("ყოფს მძიმით და ასუფთავებს", () => {
    expect(parseTags("nextjs, sdlc , NextJS")).toEqual(["nextjs", "sdlc"]);
  });

  it("აშორებს დუბლიკატებს და ზღუდავს 5-მდე", () => {
    expect(parseTags("a, b, c, d, e, f, g")).toHaveLength(5);
    expect(parseTags("x, x, y")).toEqual(["x", "y"]);
  });

  it("ცარიელი სტრიქონი → ცარიელი მასივი", () => {
    expect(parseTags("")).toEqual([]);
  });
});

describe("validatePost", () => {
  it("ვალიდური მონაცემები → ერორები არ არის", () => {
    const errors = validatePost({
      title: "სწორი სათაური",
      content: "ეს კონტენტი საკმარისად გრძელია ვალიდაციისთვის.",
      tags: ["nextjs"],
    });
    expect(errors).toEqual({});
  });

  it("მოკლე სათაური და კონტენტი → ქართული ერორები", () => {
    const errors = validatePost({ title: "აბ", content: "მოკლე", tags: [] });
    expect(errors.title).toMatch("მინიმუმ 5");
    expect(errors.content).toMatch("მინიმუმ 20");
  });

  it("6 თეგი → ერორი", () => {
    const errors = validatePost({
      title: "სწორი სათაური",
      content: "ეს კონტენტი საკმარისად გრძელია ვალიდაციისთვის.",
      tags: ["a1", "b1", "c1", "d1", "e1", "f1"],
    });
    expect(errors.tags).toBeDefined();
  });
});

describe("validateComment", () => {
  it("ანონიმური (ცარიელი სახელი) დასაშვებია", () => {
    const errors = validateComment({ authorName: "", text: "კარგი პოსტია!" });
    expect(errors).toEqual({});
  });

  it("მოკლე ტექსტი → ერორი", () => {
    const errors = validateComment({ authorName: "", text: "ა" });
    expect(errors.text).toMatch("მინიმუმ 2");
  });

  it("გრძელი სახელი → ერორი", () => {
    const errors = validateComment({
      authorName: "ა".repeat(31),
      text: "კარგი პოსტია",
    });
    expect(errors.authorName).toMatch("მაქსიმუმ 30");
  });
});

describe("normalizePage", () => {
  it("ვალიდური რიცხვი → იგივე", () => {
    expect(normalizePage("3")).toBe(3);
  });

  it("უარყოფითი, ნული, ტექსტი, ცარიელი → 1", () => {
    expect(normalizePage("0")).toBe(1);
    expect(normalizePage("-2")).toBe(1);
    expect(normalizePage("abc")).toBe(1);
    expect(normalizePage(null)).toBe(1);
    expect(normalizePage(undefined)).toBe(1);
    expect(normalizePage("")).toBe(1);
  });
});

describe("normalizePageSize", () => {
  it("ზღვრებში ჯდება 1..50", () => {
    expect(normalizePageSize("10")).toBe(10);
    expect(normalizePageSize("0")).toBe(1);
    expect(normalizePageSize("999")).toBe(50);
    expect(normalizePageSize("abc")).toBe(5);
    expect(normalizePageSize(null)).toBe(5);
    expect(normalizePageSize(undefined)).toBe(5);
  });
});

describe("excerpt", () => {
  it("მოკლე ტექსტი უცვლელად ბრუნდება", () => {
    expect(excerpt("მოკლე")).toBe("მოკლე");
  });

  it("გრძელი ტექსტი იჭრება …-ით", () => {
    const long = "ა".repeat(200);
    const out = excerpt(long, 120);
    expect(out).toHaveLength(121);
    expect(out.endsWith("…")).toBe(true);
  });
});
