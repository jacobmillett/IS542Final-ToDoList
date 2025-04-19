// src/components/TodoCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { TodoItem, Priority } from "../types";

// We're not using these in dark mode to avoid unwanted borders
const categoryColors: Record<string, string> = {
  Work:     "bg-blue-100 border-blue-500",
  Personal: "bg-green-100 border-green-500",
  Shopping: "bg-yellow-100 border-yellow-500",
  default:  "bg-gray-100 border-gray-400",
};

// Priority icons similar to Jira
const priorityIcons: Record<Priority, string> = {
  low: "↓",    // Downward arrow for low priority
  medium: "→",  // Rightward arrow for medium priority
  high: "↑",   // Upward arrow for high priority
};

const priorityColors: Record<Priority, {bg: string, text: string, icon: string, border: string}> = {
  low: {
    bg: '#e6fff2',
    text: '#047857',
    icon: '#10b981',
    border: '#d1fae5'
  },
  medium: {
    bg: '#fffbeb',
    text: '#b45309',
    icon: '#f59e0b',
    border: '#fef3c7'
  },
  high: {
    bg: '#fee2e2',
    text: '#b91c1c',
    icon: '#ef4444',
    border: '#fecaca'
  }
};

interface Props {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ item, onToggle, onDelete }: Props) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Only use category colors in light mode
  const bgClass = !isDarkMode 
    ? categoryColors[item.category] ?? categoryColors.default
    : "";

  const cardStyle = {
    borderRadius: '28px',
    padding: '20px',
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '20px',
    marginRight: '20px',
    boxShadow: isDarkMode ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: isDarkMode ? 'none' : '2px solid #e2e8f0',
    borderLeft: isDarkMode ? 'none' : '8px solid #e2e8f0',
    backgroundColor: isDarkMode ? '#232730' : undefined,
  };

  const buttonStyle = {
    borderRadius: '12px',
    padding: '8px 16px',
    margin: '4px',
    fontWeight: '500',
    backgroundColor: isDarkMode ? '#374151' : 'white',
    color: isDarkMode ? 'white' : '#6b7280',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  };

  // Button hover/active states
  const [isDeleteActive, setIsDeleteActive] = React.useState(false);
  const [isEditHovered, setIsEditHovered] = React.useState(false);
  const [isToggleHovered, setIsToggleHovered] = React.useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = React.useState(false);

  // Priority colors based on theme
  const priorityColor = isDarkMode
    ? { 
        bg: '#1f2937', 
        text: item.priority === 'high' ? '#f87171' : item.priority === 'medium' ? '#fbbf24' : '#34d399',
        icon: item.priority === 'high' ? '#f87171' : item.priority === 'medium' ? '#fbbf24' : '#34d399',
        border: '#374151'
      }
    : priorityColors[item.priority];

  return (
    <div style={{ margin: '40px 20px' }}>
      <div
        style={cardStyle}
        className={bgClass}
      >
        <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
          <div style={{ padding: '8px' }}>
            <h3
              className={`text-lg sm:text-xl font-medium tracking-wide ${
                item.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
              }`}
              style={{ marginBottom: '8px' }}
            >
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400" style={{ marginTop: '8px' }}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </p>
            
            {/* Jira-style priority badge */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginTop: '8px',
                width: 'fit-content',
                padding: '4px 10px',
                borderRadius: '4px',
                backgroundColor: priorityColor.bg,
                border: `1px solid ${priorityColor.border}`,
                fontSize: '0.85rem'
              }}
            >
              <span 
                style={{ 
                  marginRight: '6px', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  color: priorityColor.icon
                }}
              >
                {priorityIcons[item.priority]}
              </span>
              <span style={{ color: priorityColor.text, fontWeight: '500' }}>
                Priority: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{item.priority}</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
            <Link
              to={`/todos/${item.id}/edit`}
              onMouseEnter={() => setIsEditHovered(true)}
              onMouseLeave={() => setIsEditHovered(false)}
              className="focus:outline-none focus:ring-0 transition-all duration-200"
              style={{
                backgroundColor: isDarkMode 
                  ? (isEditHovered ? '#4c1d95' : '#374151')  // Dark purple on hover in dark mode
                  : (isEditHovered ? '#f3f0ff' : 'white'),   // Light purple on hover in light mode
                color: isDarkMode ? '#a78bfa' : '#8b5cf6',  // Light purple text in dark mode
                border: isDarkMode ? '2px solid #a78bfa' : '2px solid #8b5cf6',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '34px',
                width: '70px',
                fontSize: '0.9rem',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              Edit
            </Link>
          </div>
        </div>

        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          padding: '8px'
        }}>
          <button
            onClick={() => onToggle(item.id)}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            className="focus:outline-none focus:ring-0 transition-all duration-200"
            style={{
              ...buttonStyle,
              backgroundColor: isDarkMode
                ? (isToggleHovered ? '#065f46' : '#374151')  // Dark green on hover in dark mode
                : (isToggleHovered 
                   ? '#ecfdf5'  // Light green on hover in light mode
                   : (item.completed ? '#d1fae5' : 'white')),  // Light green when completed in light mode
              color: isDarkMode 
                ? '#34d399'  // Light green text in dark mode
                : (item.completed ? '#065f46' : (isToggleHovered ? '#065f46' : '#6b7280')), 
              boxShadow: '0 4px 12px rgba(52, 211, 153, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '38px',
              minWidth: '120px',
            }}
          >
            {item.completed ? "Mark Undone" : "Mark Done"}
          </button>
          <button
            onClick={() => {
              setIsDeleteActive(true);
              // Small delay before actual deletion to show the active state
              setTimeout(() => {
                onDelete(item.id);
                setIsDeleteActive(false);
              }, 300);
            }}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            className="focus:outline-none focus:ring-0 transition-all duration-200"
            style={{
              ...buttonStyle,
              backgroundColor: isDarkMode
                ? (isDeleteActive ? '#881337' : (isDeleteHovered ? '#7f1d1d' : '#374151'))  // Darker red on hover in dark mode
                : (isDeleteActive ? '#fee2e2' : (isDeleteHovered ? '#fef2f2' : 'white')),   // Light red on hover in light mode
              color: isDarkMode 
                ? '#f87171'  // Light red text in dark mode 
                : (isDeleteActive ? '#b91c1c' : (isDeleteHovered ? '#b91c1c' : '#6b7280')),
              boxShadow: '0 4px 12px rgba(248, 113, 113, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '38px',
              minWidth: '120px',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
