import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotal(amounts: string) {
  return amounts
    .split(/[\n,]+/)
    .map((amount) => Number.parseFloat(amount.trim()))
    .filter((amount) => !Number.isNaN(amount))
    .reduce((acc, amount) => acc + amount, 0);
}
