import React, { useState } from 'react';
import AddStudentForm from './components/AddStudentForm.jsx';
import StudentsList from './components/StudentsList.jsx';
import { theme } from './styles/theme.js';

export default function App() {
  const [view, setView] = useState('home');

  const containerStyle = {
    padding: theme.spacing.xlarge,
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
  };

  const headerStyle = {
    color: theme.colors.primary,
    marginBottom: theme.spacing.large,
    textShadow: theme.shadows.small,
    fontSize: theme.typography.fontSize.h1,
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: theme.borderRadius,
    border: 'none',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: theme.shadows.small,
  };

  const primaryBtn = { ...buttonStyle, backgroundColor: theme.colors.primary, color: '#fff' };
  const secondaryBtn = { ...buttonStyle, backgroundColor: theme.colors.secondary, color: theme.colors.text };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>SapSecOps Student App</h1>
      {view === 'home' ? (
        <div style={{ display: 'flex', gap: theme.spacing.medium, justifyContent: 'center' }}>
          <button style={primaryBtn} onClick={() => setView('add')}>Add Student</button>
          <button style={primaryBtn} onClick={() => setView('list')}>Students List</button>
        </div>
      ) : (
        <>
          <button style={secondaryBtn} onClick={() => setView('home')}>Home</button>
          <div style={{ marginTop: theme.spacing.large }}>
            {view === 'add' ? <AddStudentForm onDone={() => setView('list')} /> : <StudentsList />}
          </div>
        </>
      )}
    </div>
  );
}