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
    display: 'grid',
    gap: theme.spacing.medium,
    maxWidth: 420,
    margin: '0 auto',
    padding: theme.spacing.xlarge,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadows.large,
    animation: 'fadeIn 0.5s ease-in-out',
  };

  const inputStyle = {
    width: '100%',
    padding: theme.spacing.medium,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    boxSizing: 'border-box',
  };

  const submitButtonStyle = {
    padding: '12px 24px',
    borderRadius: theme.borderRadius,
    border: 'none',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: theme.colors.primary,
    color: '#fff',
    transition: 'background-color 0.3s ease',
  };

  const messageStyle = (color) => ({
    marginTop: theme.spacing.small,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius,
    color: '#fff',
    backgroundColor: color,
    textAlign: 'center',
  });

  return (
    <form onSubmit={onSubmit} style={formContainerStyle}>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Course
        <input
          name="course"
          value={form.course}
          onChange={onChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Amount
        <input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={onChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Fees Status
        <select
          name="feesStatus"
          value={form.feesStatus}
          onChange={onChange}
          style={inputStyle}
        >
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Half-paid</option>
        </select>
      </label>
      <button type="submit" disabled={loading} style={submitButtonStyle}>
        {loading ? 'Saving...' : 'Save'}
      </button>

      {/* Accessible messages */}
      {error && (
        <div role="alert" style={messageStyle(theme.colors.error)}>
          {error}
        </div>
      )}
      {success && (
        <div role="status" style={messageStyle(theme.colors.success)}>
          {success}
        </div>
      )}
    </form>
  );
}
