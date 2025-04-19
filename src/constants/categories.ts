// src/constants/categories.ts
export const CATEGORIES = ["Work", "Personal", "Shopping"] as const;
export type Category = (typeof CATEGORIES)[number];
