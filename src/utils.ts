import { clsx, type ClassValue } from "clsx";
import { v4 as uuidv4 } from "uuid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle() {
  return Math.random() - 0.5;
}

export function getUniqueId(): number {
  return parseInt(uuidv4().replace("-", ""), 16);
}
