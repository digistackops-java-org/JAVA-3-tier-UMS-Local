import React, { useEffect, useState } from 'react';
import api from '../api';
import { theme } from '../styles/theme.js'; // Import the theme

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  boxShadow: theme.shadows.large,
  borderRadius: theme.borderRadius,
  overflow: 'hidden',
};

const cellStyle = {
  padding: theme.spacing.medium,
  borderBottom: `1px solid ${theme.colors.border}`,
  textAlign: 'left',
};

const headerCellStyle = {
  ...cellStyle,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontWeight: '600',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  marginRight: '5px',
  transition: 'background-color 0.3s ease',
};

const editButtonStyle = { ...buttonStyle, backgroundColor: '#ffc107', color: theme.colors.text };
const deleteButtonStyle = { ...buttonStyle, backgroundColor: theme.colors.error, color: '#fff' };

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
    backgroundColor: theme.colors.card,
    transition: 'background-color 0.3s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: theme.spacing.medium,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    boxSizing: 'border-box',
  };

  if (edit) {
    return (
      <tr style={rowStyle}>
        <td style={cellStyle}><input name="name" value={form.name} onChange={onChange} style={inputStyle} /></td>
        <td style={cellStyle}><input name="email" value={form.email} onChange={onChange} style={inputStyle} /></td>
        <td style={cellStyle}><input name="course" value={form.course} onChange={onChange} style={inputStyle} /></td>
        <td style={cellStyle}><input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} style={inputStyle} /></td>
        <td style={cellStyle}>
          <select name="feesStatus" value={form.feesStatus} onChange={onChange} style={inputStyle}>
            <option>Paid</option><option>Unpaid</option><option>Half-paid</option>
          </select>
        </td>
        <td style={cellStyle}>
          <button onClick={save} style={{ ...editButtonStyle, backgroundColor: theme.colors.success, color: '#fff' }}>Save</button>
          <button onClick={() => setEdit(false)} style={deleteButtonStyle}>Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr style={rowStyle}>
      <td style={cellStyle}>{student.name}</td>
      <td style={cellStyle}>{student.email}</td>
      <td style={cellStyle}>{student.course}</td>
      <td style={cellStyle}>{student.amount}</td>
      <td style={cellStyle}>{student.feesStatus}</td>
      <td style={cellStyle}>
        <button onClick={() => setEdit(true)} style={editButtonStyle}>Edit</button>
        <button onClick={del} style={deleteButtonStyle}>Delete</button>
      </td>
    </tr>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: theme.colors.error }}>{error}</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Name</th><th>Email</th><th>Course</th><th>Amount</th><th>Fees Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <Row key={s.id} student={s} onUpdated={load} onDeleted={load} />
          ))}
        </tbody>
      </table>
    </div>
  );
}