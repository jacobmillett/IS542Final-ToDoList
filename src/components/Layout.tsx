// src/components/Layout.tsx
import React, { useState, useEffect, useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => {
    // Check for user's preferred color scheme if no preference saved
    if (localStorage.theme === undefined) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return localStorage.theme === "dark";
  });

  // Dark mode color palette - same as our form component
  const darkColors = useMemo(() => ({
    background: '#1a1c23',      // Slightly blue-tinted dark background
    cardBg: '#252836',          // Card background with subtle blue tint
    inputBg: '#2e303e',         // Input background with slight blue tint
    inputBorder: '#40425e',     // Input border with subtle purple tint
    text: '#e2e8f0',            // Light gray text for good contrast
    textSecondary: '#a1a1aa',   // Secondary text color
    purple: {
      light: '#a78bfa',         // Light purple for accents
      default: '#8b5cf6',       // Primary purple
      dark: '#6d28d9',          // Dark purple
      hover: '#7c3aed',         // Hover purple
    },
    shadow: 'rgba(0, 0, 0, 0.4)' // Deeper shadows for dark mode
  }), []);

  // Light mode color palette - same as our form component
  const lightColors = useMemo(() => ({
    background: '#f8fafc',      // Very light gray with blue tint
    cardBg: '#ffffff',          // White
    inputBg: '#ffffff',         // White
    inputBorder: '#e2e8f0',     // Light gray border
    text: '#1e293b',            // Dark text for good contrast
    textSecondary: '#64748b',   // Secondary text color
    purple: {
      light: '#c4b5fd',         // Light purple
      default: '#8b5cf6',       // Primary purple
      dark: '#7c3aed',          // Dark purple
      hover: '#6d28d9',         // Hover purple
    },
    shadow: 'rgba(0, 0, 0, 0.1)' // Light shadows
  }), []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
      
      // Apply CSS variables with our dark mode colors
      Object.entries(darkColors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--color-${key}`, value);
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--color-${key}-${subKey}`, subValue as string);
          });
        }
      });
      
      // Add specific styles for dark mode
      const style = document.createElement('style');
      style.id = 'dark-mode-styles';
      style.innerHTML = `
        .dark {
          color-scheme: dark;
        }
        .dark * {
          --tw-ring-color: transparent !important;
          --tw-ring-offset-color: transparent !important;
        }
        .dark input, 
        .dark select, 
        .dark button {
          border-color: var(--color-inputBorder) !important;
          background-color: var(--color-inputBg) !important;
          color: var(--color-text) !important;
        }
        .dark option {
          background-color: var(--color-inputBg) !important;
          color: var(--color-text) !important;
        }
        .dark input::placeholder {
          color: var(--color-textSecondary) !important;
        }
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
          color: var(--color-text) !important;
        }
      `;
      
      // Remove any existing style before adding the new one
      const existingStyle = document.getElementById('dark-mode-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      document.head.appendChild(style);
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
      
      // Apply CSS variables with our light mode colors
      Object.entries(lightColors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--color-${key}`, value);
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--color-${key}-${subKey}`, subValue as string);
          });
        }
      });
      
      // Remove the dark mode styles
      const darkStyle = document.getElementById('dark-mode-styles');
      if (darkStyle) {
        darkStyle.remove();
      }
    }
    
    // Dispatch an event that our components can listen for
    const event = new CustomEvent('themeChanged', { detail: { isDark: dark } });
    window.dispatchEvent(event);
  }, [dark, darkColors, lightColors]);

  const toggleTheme = () => {
    setDark(prevDark => !prevDark);
    // No page reload needed
  };

  // Current color theme
  const colors = dark ? darkColors : lightColors;

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 relative ${dark ? 'dark' : 'light'}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <header className="py-4 px-6 relative">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 px-4 py-2 text-white rounded-md transition-all duration-300 shadow-lg focus:outline-none"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: `0 4px 12px ${dark ? 'rgba(126, 34, 206, 0.5)' : 'rgba(126, 34, 206, 0.3)'}`,
            width: 'auto',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: colors.purple.default,
            border: 'none',
            outline: 'none',
            transform: 'scale(1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.purple.hover;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.purple.default;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 pb-8 animate-slide-up transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
