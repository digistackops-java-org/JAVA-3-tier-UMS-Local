// src/App.jsx

import React, { useState } from 'react';
import AddStudentForm from './components/AddStudentForm.jsx';
import StudentsList from './components/StudentsList.jsx';
import { theme } from './styles/theme.js';

export default function App() {
  const [view, setView] = useState('home');

  const containerStyle = {
    padding: theme.spacing.xxlarge,
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyle = {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xlarge,
    textShadow: `1px 1px 2px ${theme.colors.shadows.onHover.split(',')[0]}`,
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: theme.spacing.large,
    marginTop: theme.spacing.large,
  };

  const commonButtonStyle = {
    padding: '20px 40px',
    borderRadius: theme.borderRadius,
    border: 'none',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: theme.colors.background,
    boxShadow: theme.shadows.neumorphic,
    transition: theme.transition,
  };
  
  const primaryBtn = { ...commonButtonStyle, color: theme.colors.primary };
  const secondaryBtn = { ...commonButtonStyle, color: theme.colors.secondary };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Student Management</h1>
      {view === 'home' ? (
        <div style={buttonContainerStyle}>
          <button style={primaryBtn} onClick={() => setView('add')}>Add Student</button>
          <button style={primaryBtn} onClick={() => setView('list')}>Students List</button>
        </div>
      ) : (
        <>
          <button style={secondaryBtn} onClick={() => setView('home')}>Home</button>
          <div style={{ marginTop: theme.spacing.large, width: '100%', animation: 'fadeIn 0.8s ease-out' }}>
            {view === 'add' ? <AddStudentForm onDone={() => setView('list')} /> : <StudentsList />}
          </div>
        </>
      )}
    </div>
  );
}
