import { describe, it, expect } from "bun:test";
import {
  getPagination,
  buildPaginationMeta,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "./pagination";

describe("getPagination", () => {
  it("defaults to page 1 and default page size", () => {
    const p = getPagination(undefined, undefined);
    expect(p.page).toBe(1);
    expect(p.limit).toBe(DEFAULT_PAGE_SIZE);
    expect(p.skip).toBe(0);
    expect(p.take).toBe(DEFAULT_PAGE_SIZE);
  });

  it("computes skip and take from page and limit", () => {
    const p = getPagination("3", "10");
    expect(p.page).toBe(3);
    expect(p.limit).toBe(10);
    expect(p.skip).toBe(20);
    expect(p.take).toBe(10);
  });

  it("clamps invalid page to 1", () => {
    expect(getPagination("0", null).page).toBe(1);
    expect(getPagination("-5", null).page).toBe(1);
  });

  it("clamps limit to minimum 1 and maximum MAX_PAGE_SIZE", () => {
    expect(getPagination("1", "0").limit).toBe(1);
    expect(getPagination("1", String(MAX_PAGE_SIZE + 500)).limit).toBe(MAX_PAGE_SIZE);
  });

  it("treats NaN / non-numeric input as defaults", () => {
    const p = getPagination("abc", "xyz");
    expect(p.page).toBe(1);
    expect(p.limit).toBe(DEFAULT_PAGE_SIZE);
    expect(p.skip).toBe(0);
  });

  it("respects an explicit valid page and limit", () => {
    const p = getPagination("2", "25");
    expect(p).toEqual({ page: 2, limit: 25, skip: 25, take: 25 });
  });
});

describe("buildPaginationMeta", () => {
  it("computes total pages and next/prev flags on the first page", () => {
    const m = buildPaginationMeta(1, 15, 100);
    expect(m.totalPages).toBe(7);
    expect(m.hasNext).toBe(true);
    expect(m.hasPrev).toBe(false);
    expect(m.total).toBe(100);
  });

  it("flags last page correctly", () => {
    const m = buildPaginationMeta(7, 15, 100);
    expect(m.hasNext).toBe(false);
    expect(m.hasPrev).toBe(true);
  });

  it("handles an empty result set", () => {
    const m = buildPaginationMeta(1, 15, 0);
    expect(m.totalPages).toBe(1);
    expect(m.hasNext).toBe(false);
    expect(m.hasPrev).toBe(false);
  });

  it("rounds total pages up", () => {
    expect(buildPaginationMeta(1, 15, 1).totalPages).toBe(1);
    expect(buildPaginationMeta(1, 15, 16).totalPages).toBe(2);
  });
});
