import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { TodoItem, Priority } from "../types";
import { Category } from "../constants/categories";
import { CATEGORIES } from "../constants/categories";

interface Props {
  todos: TodoItem[];
  onSave: (item: TodoItem) => void;
  onDelete?: (id: string) => void;
}

export default function TodoFormPage({ todos, onSave, onDelete }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const existing = todos.find((t) => t.id === id);

  const [title, setTitle] = useState(existing?.title || "");
  const [dueDate, setDueDate] = useState(existing?.dueDate || "");
  const [priority, setPriority] = useState<Priority>(existing?.priority || "low");
  const [category, setCategory] = useState<Category | "">(existing?.category as Category || "");
  
  // Button hover states
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  
  // Theme state
  const [themeChanged, setThemeChanged] = useState(0);

  useEffect(() => {
    if (isEditing && !existing) {
      navigate("/");
    }
  }, [existing, isEditing, navigate]);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure selected category is valid
    const validCategory = category as Category;
    
    const newItem: TodoItem = {
      id: existing?.id || Date.now().toString(),
      title,
      dueDate,
      priority,
      category: validCategory,
      completed: existing?.completed || false,
    };
    onSave(newItem);
    navigate("/");
  };
  
  // Get current theme from document class
  const isDarkMode = useMemo(() => {
    console.log("Theme changed:", themeChanged);
    return document.documentElement.classList.contains('dark');
  }, [themeChanged]);
  
  // Get colors from CSS variables - recalculate when theme changes
  const getColor = useCallback((name: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  }, [themeChanged]);
  
  // Common styles for form elements
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${getColor('inputBorder')}`,
    boxShadow: `0 2px 4px ${getColor('shadow')}`,
    backgroundColor: getColor('inputBg'),
    color: getColor('text'),
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
  };
  
  // Common button styles
  const buttonStyle = {
    borderRadius: '12px',
    padding: '10px 16px',
    fontWeight: '500',
    boxShadow: `0 4px 8px ${getColor('shadow')}`,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '42px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{
      padding: '32px',
      maxWidth: '800px',
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
          {isEditing ? "Edit Task" : "New Task"}
        </h1>
        <div 
          className="h-1 w-24 mx-auto rounded-full"
          style={{ 
            backgroundColor: getColor('purple-default'),
            boxShadow: isDarkMode ? `0 0 8px ${getColor('purple-default')}` : 'none'
          }}
        ></div>
      </header>
      
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '28px',
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? `0 8px 16px ${getColor('shadow')}, 0 0 1px #6366f1` 
            : `0 4px 12px ${getColor('shadow')}`,
          border: isDarkMode ? 'none' : `1px solid ${getColor('inputBorder')}`,
          backgroundColor: getColor('cardBg'),
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="title" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: getColor('text')
            }}
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              ...inputStyle,
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="dueDate" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: getColor('text')
            }}
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              ...inputStyle,
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '28px'
        }}>
          <div>
            <label 
              htmlFor="priority" 
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: getColor('text')
              }}
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              style={{
                ...inputStyle,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(isDarkMode ? getColor('purple-light') : '#6366f1')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px',
                paddingRight: '30px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label 
              htmlFor="category" 
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: getColor('text')
              }}
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
              style={{
                ...inputStyle,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(isDarkMode ? getColor('purple-light') : '#6366f1')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px',
                paddingRight: '30px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          gap: '16px', 
          marginTop: '32px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="submit"
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
              style={{
                ...buttonStyle,
                backgroundColor: isDarkMode
                  ? (saveHovered ? getColor('purple-hover') : getColor('purple-dark'))
                  : (saveHovered ? getColor('purple-hover') : getColor('purple-default')),
                color: 'white',
                boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                minWidth: '150px',
                height: '42px',
                transition: 'all 0.2s ease',
                transform: saveHovered ? 'translateY(-1px)' : 'translateY(0)',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
            
            <Link
              to="/"
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                ...buttonStyle,
                backgroundColor: isDarkMode 
                  ? (cancelHovered ? '#374151' : '#1f2937')
                  : (cancelHovered ? '#f3f4f6' : 'white'),
                color: isDarkMode ? '#d1d5db' : '#4b5563',
                border: isDarkMode ? 'none' : '1px solid #e5e7eb',
                boxShadow: `0 4px 6px ${getColor('shadow')}`,
                textDecoration: 'none',
                minWidth: '150px',
                height: '42px',
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                transform: cancelHovered ? 'translateY(-1px)' : 'translateY(0)',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </Link>
          </div>
          
          {isEditing && onDelete && (
            <button
              type="button"
              onMouseEnter={() => setDeleteHovered(true)}
              onMouseLeave={() => setDeleteHovered(false)}
              onClick={() => {
                onDelete(id!);
                navigate("/");
              }}
              style={{
                ...buttonStyle,
                backgroundColor: isDarkMode
                  ? (deleteHovered ? '#991b1b' : '#7f1d1d')
                  : (deleteHovered ? '#fef2f2' : 'white'),
                color: isDarkMode ? '#fca5a5' : '#ef4444',
                border: isDarkMode ? 'none' : '2px solid #ef4444',
                boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(248, 113, 113, 0.2)'}`,
                minWidth: '100px',
                transition: 'all 0.2s ease',
                transform: deleteHovered ? 'translateY(-1px)' : 'translateY(0)',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
