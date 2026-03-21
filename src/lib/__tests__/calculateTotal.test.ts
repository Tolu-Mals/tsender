import { describe, it, expect } from "vitest";
import { calculateTotal } from "../utils";

describe("calculateTotal", () => {
  it("should calculate the total of a list of numbers", () => {
    const amounts = "1\n2\n3\n4\n5";
    expect(calculateTotal(amounts)).toBe(15);
  });

  it("should calculate the total of a list of numbers with commas", () => {
    const amounts = "1,2,3,4,5";
    expect(calculateTotal(amounts)).toBe(15);
  });

  it("should calculate the total of a list of numbers with newlines and commas", () => {
    const amounts = "1,2\n3,4\n5";
    expect(calculateTotal(amounts)).toBe(15);
  });

  it("should calculate the total of a list of numbers with newlines and commas and spaces", () => {
    const amounts = "1, 2\n 3, 4\n 5";
    expect(calculateTotal(amounts)).toBe(15);
  });

  it("should calculate the total of a list of numbers with newlines and commas and spaces and extra spaces", () => {
    const amounts = "1, 2\n 3, 4\n 5";
    expect(calculateTotal(amounts)).toBe(15);
  });

  it("should ignore non-numeric values", () => {
    const amounts = "1, 2\n x, 4\n 5";
    expect(calculateTotal(amounts)).toBe(12);
  });

  it("should return 0 if no numeric values are found", () => {
    const amounts = "x, y\n z, a\n b";
    expect(calculateTotal(amounts)).toBe(0);
  });

  it("should return 0 if the string is empty", () => {
    const amounts = "";
    expect(calculateTotal(amounts)).toBe(0);
  });
});