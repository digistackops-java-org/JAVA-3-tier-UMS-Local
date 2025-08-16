// src/components/AddStudentForm.jsx

import React, { useState } from 'react';
import api from '../api';
import { theme } from '../styles/theme.js';

const initialForm = { name: '', email: '', course: '', amount: '', feesStatus: 'Paid' };

export default function AddStudentForm({ onDone }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      await api.post('/students', payload);
      setSuccess('Student added successfully!');
      setForm(initialForm);
      if (onDone) onDone();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formContainerStyle = {
    maxWidth: 500,
    margin: '0 auto',
    padding: theme.spacing.xlarge,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadows.neumorphic,
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    borderRadius: '10px',
    boxShadow: theme.shadows.neumorphicInset,
    transition: theme.transition,
    color: theme.colors.text,
  };

  const submitButtonStyle = {
    padding: '20px 40px',
    borderRadius: theme.borderRadius,
    border: 'none',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: theme.colors.primary,
    color: 'white',
    boxShadow: theme.shadows.neumorphic,
    transition: theme.transition,
  };

  return (
    <form onSubmit={onSubmit} style={formContainerStyle}>
      <h2 style={{ fontSize: theme.typography.fontSize.h2, textAlign: 'center', marginBottom: theme.spacing.large, color: theme.colors.primary }}>Add New Student</h2>
      <div style={{ display: 'grid', gap: theme.spacing.large }}>
        <input name="name" value={form.name} onChange={onChange} required placeholder="Name" style={inputStyle} />
        <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="Email" style={inputStyle} />
        <input name="course" value={form.course} onChange={onChange} required placeholder="Course" style={inputStyle} />
        <input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} required placeholder="Amount" style={inputStyle} />
        <select name="feesStatus" value={form.feesStatus} onChange={onChange} style={inputStyle}>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Half-paid</option>
        </select>
        <button type="submit" disabled={loading} style={submitButtonStyle}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <div style={{ color: theme.colors.error, textAlign: 'center', marginTop: theme.spacing.medium }}>{error}</div>}
      {success && <div style={{ color: theme.colors.accent, textAlign: 'center', marginTop: theme.spacing.medium }}>{success}</div>}
    </form>
  );
}
