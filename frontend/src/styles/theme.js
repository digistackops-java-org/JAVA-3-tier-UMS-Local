// src/styles/theme.js

export const theme = {
  colors: {
    background: '#e0e5ec', // Soft gray
    surface: '#ecf0f3',    // Lighter gray for interactive elements
    primary: '#4a90e2',    // A clean, cool blue
    secondary: '#8aabe2',
    accent: '#50c473',     // A fresh green for success
    text: '#334257',       // Dark blue-gray
    border: '#d1d9e6',     // Soft border for inner shadow
    error: '#e74c3c',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px',
  },
  shadows: {
    neumorphic: '6px 6px 12px #b8b8d1, -6px -6px 12px #ffffff',
    neumorphicInset: 'inset 2px 2px 5px #b8b8d1, inset -2px -2px 5px #ffffff',
    onHover: '8px 8px 16px #b8b8d1, -8px -8px 16px #ffffff',
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: {
      base: '16px',
      h1: '3.5rem',
      h2: '2rem',
    }
  },
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
};
