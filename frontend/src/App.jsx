import React, { useState } from 'react';
import AddStudentForm from './components/AddStudentForm.jsx';
import StudentsList from './components/StudentsList.jsx';

export default function App() {
  const [view, setView] = useState('home');

  if (view === 'add') return (
    <div style={{ padding: 20 }}>
      <h1>Student App</h1>
      <button onClick={() => setView('home')}>Home</button>
      <AddStudentForm onDone={() => setView('list')} />
    </div>
  );

  if (view === 'list') return (
    <div style={{ padding: 20 }}>
      <h1>Student App</h1>
      <button onClick={() => setView('home')}>Home</button>
      <StudentsList />
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Student App</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setView('add')}>Add Student</button>
        <button onClick={() => setView('list')}>Students List</button>
      </div>
    </div>
  );
}
