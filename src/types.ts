// src/types.ts
import { Category } from "./constants/categories";

export type Priority = "low" | "medium" | "high";

export interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  category: Category;
  completed: boolean;
}
