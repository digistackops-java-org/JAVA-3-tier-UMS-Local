import React, { useState } from 'react';
import api from '../api';

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
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      await api.post('/students', payload);
      setSuccess('Student added.');
      setForm(initialForm);
      if (onDone) onDone();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
      <label>Name<input name="name" value={form.name} onChange={onChange} required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
      <label>Course<input name="course" value={form.course} onChange={onChange} required /></label>
      <label>Amount<input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} required /></label>
      <label>Fees Status
        <select name="feesStatus" value={form.feesStatus} onChange={onChange}>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Half-paid</option>
        </select>
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
}
