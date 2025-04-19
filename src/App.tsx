import React from "react";
import { Routes, Route } from "react-router-dom";
import ListPage from "./pages/ListPage";
import TodoFormPage from "./pages/ToDoFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { TodoItem } from "./types";

export default function App() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("my-todo-list", []);

  const handleSave = (item: TodoItem) => {
    setTodos(prev => {
      const exists = prev.find(t => t.id === item.id);
      if (exists) {
        return prev.map(t => t.id === item.id ? item : t);
      }
      return [...prev, item];
    });
  };

  const handleToggle = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ListPage
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        }
      />
      <Route
        path="/todos/new"
        element={<TodoFormPage todos={todos} onSave={handleSave} />}
      />
      <Route
        path="/todos/:id/edit"
        element={
          <TodoFormPage
            todos={todos}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
