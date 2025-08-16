// src/components/StudentsList.jsx

import React, { useEffect, useState } from 'react';
import api from '../api';
import { theme } from '../styles/theme.js';

function Row({ student, onUpdated, onDeleted }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...student });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    await api.put(`/students/${student.id}`, { ...form, amount: Number(form.amount) });
    onUpdated();
    setEdit(false);
  };

  const del = async () => {
    if (!confirm('Delete this student?')) return;
    await api.delete(`/students/${student.id}`);
    onDeleted();
  };

  const rowStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadows.neumorphic,
    padding: theme.spacing.large,
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: theme.spacing.medium,
    alignItems: 'center',
    transition: theme.transition,
    // Add hover effects in a CSS stylesheet for full functionality
  };

  const labelStyle = {
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.small,
  };
  
  const contentStyle = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  };

  const buttonStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: theme.transition,
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: theme.shadows.neumorphic,
  };

  const editButtonStyle = { ...buttonStyle, backgroundColor: theme.colors.primary, color: 'white' };
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: theme.colors.error, color: 'white' };

  if (edit) {
    return (
      <div style={{ ...rowStyle, backgroundColor: theme.colors.surface, boxShadow: theme.shadows.onHover }}>
        <input name="name" value={form.name} onChange={onChange} style={inputStyle} />
        <input name="email" value={form.email} onChange={onChange} style={inputStyle} />
        <input name="course" value={form.course} onChange={onChange} style={inputStyle} />
        <input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} style={inputStyle} />
        <select name="feesStatus" value={form.feesStatus} onChange={onChange} style={inputStyle}>
          <option>Paid</option><option>Unpaid</option><option>Half-paid</option>
        </select>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={save} style={{ ...editButtonStyle, backgroundColor: theme.colors.accent }}>Save</button>
          <button onClick={() => setEdit(false)} style={deleteButtonStyle}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={rowStyle}>
      <div>
        <div style={labelStyle}>Name</div>
        <div style={contentStyle}>{student.name}</div>
      </div>
      <div>
        <div style={labelStyle}>Email</div>
        <div style={contentStyle}>{student.email}</div>
      </div>
      <div>
        <div style={labelStyle}>Course</div>
        <div style={contentStyle}>{student.course}</div>
      </div>
      <div>
        <div style={labelStyle}>Amount</div>
        <div style={contentStyle}>{student.amount}</div>
      </div>
      <div>
        <div style={labelStyle}>Status</div>
        <div style={contentStyle}>{student.feesStatus}</div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setEdit(true)} style={editButtonStyle}>Edit</button>
        <button onClick={del} style={deleteButtonStyle}>Delete</button>
      </div>
    </div>
  );
}

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: theme.spacing.xlarge, color: theme.colors.primary }}>Loading...</div>;
  if (error) return <div style={{ color: theme.colors.error, textAlign: 'center', marginTop: theme.spacing.xlarge }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.medium, maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.8s ease-out' }}>
      {students.map(s => (
        <Row key={s.id} student={s} onUpdated={load} onDeleted={load} />
      ))}
    </div>
  );
}
