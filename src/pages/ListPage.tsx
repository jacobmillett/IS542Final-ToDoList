import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import TodoCard from "../components/TodoCard";
import type { TodoItem } from "../types";

interface Props {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ListPage({ todos, onToggle, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [sortKey, setSortKey] = useState<"dueDate" | "title">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // Theme state to track changes
  const [themeChanged, setThemeChanged] = useState(0);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeChanged(prev => prev + 1);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // derive unique categories
  const categories = useMemo(() => {
    const cats = todos.map((t) => t.category).filter((c) => c);
    return Array.from(new Set(cats));
  }, [todos]);

  // filter, search, sort
  const filtered = useMemo(() => {
    return todos
      .filter((t) => {
        if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (statusFilter === "completed" && !t.completed) return false;
        if (statusFilter === "pending" && t.completed) return false;
        if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortKey === "dueDate") {
          comp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          comp = a.title.localeCompare(b.title);
        }
        return sortOrder === "asc" ? comp : -comp;
      });
  }, [todos, searchTerm, statusFilter, categoryFilter, sortKey, sortOrder]);

  // Get current theme from document class - update when theme changes
  const isDarkMode = useMemo(() => {
    return document.documentElement.classList.contains('dark');
  }, [themeChanged]);
  
  // Get colors from CSS variables - update when theme changes
  const getColor = useCallback((name: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  }, [themeChanged]);

  // Common input style for consistency - 70% of previous size
  const inputStyle = useMemo(() => ({
    padding: '8px 12px', // reduced from 12px 16px
    borderRadius: '12px',
    border: `1px solid ${getColor('inputBorder')}`,
    boxShadow: `0 2px 4px ${getColor('shadow')}`,
    backgroundColor: getColor('inputBg'),
    color: getColor('text'),
    fontSize: '0.9rem', // reduced from 0.95rem
    width: '160px', // fixed width for consistency
    height: '38px', // consistent height for all inputs
  }), [getColor]);

  // Dropdown specific styles
  const selectStyle = useMemo(() => ({
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(isDarkMode ? getColor('purple-light') : '#6366f1')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '12px',
    paddingRight: '30px',
  }), [inputStyle, isDarkMode, getColor]);

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: getColor('background'),
      color: getColor('text'),
      minHeight: '100vh',
      transition: 'all 0.3s ease',
    }}>
      {/* Centered and styled title */}
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 
          className="text-3xl font-light tracking-wide" 
          style={{ 
            color: getColor('text'),
            marginBottom: '12px'
          }}
        >
          Your To-Do List
        </h1>
        <div 
          className="h-1 w-24 mx-auto rounded-full" 
          style={{ 
            backgroundColor: getColor('purple-default'),
            boxShadow: isDarkMode ? `0 0 8px ${getColor('purple-default')}` : 'none' 
          }}
        ></div>
      </header>

      {/* Controls with improved styling */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '32px',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: isDarkMode 
          ? `0 8px 16px ${getColor('shadow')}, 0 0 1px #6366f1` 
          : `0 4px 12px ${getColor('shadow')}`,
        alignItems: 'center',
        border: isDarkMode ? 'none' : `1px solid ${getColor('inputBorder')}`,
        backgroundColor: getColor('cardBg'),
        transition: 'all 0.3s ease',
      }}>
        <div style={{ width: '100%', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...inputStyle,
              width: '100%',
              boxSizing: 'border-box',
            }}
            className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none transition-colors duration-200"
          />
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '12px',
          width: '100%',
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "completed" | "pending")}
              style={selectStyle}
              className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={selectStyle}
              className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as "dueDate" | "title")}
                style={selectStyle}
                className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>

              <button
                onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                style={{
                  ...inputStyle,
                  width: '44px',
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  border: isDarkMode ? 'none' : `1px solid ${getColor('inputBorder')}`,
                }}
                className="hover:bg-opacity-80 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:outline-none"
                title="Toggle sort order"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <Link
            to="/todos/new"
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: getColor('purple-default'),
              color: 'white',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '160px', // Match the width of filters
              height: '38px', // Consistent height
              border: 'none',
            }}
            className="hover:bg-opacity-90 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:outline-none"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getColor('purple-hover');
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = getColor('purple-default');
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{
              width: '16px',
              height: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              fontSize: '14px',
              lineHeight: 1,
              fontWeight: 'bold'
            }}>+</span> 
            New Task
          </Link>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px', 
          borderRadius: '12px',
          backgroundColor: getColor('cardBg'),
          border: isDarkMode ? 'none' : `1px solid ${getColor('inputBorder')}`,
          boxShadow: isDarkMode 
            ? `0 4px 12px ${getColor('shadow')}` 
            : `0 4px 6px ${getColor('shadow')}`,
        }}>
          <p style={{ color: isDarkMode ? getColor('textSecondary') : '#6b7280' }}>No tasks match your criteria.</p>
        </div>
      ) : (
        <div style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
          {filtered.map((item) => (
            <TodoCard
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
