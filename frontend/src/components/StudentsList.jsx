import React, { useEffect, useState } from 'react';
import api from '../api';

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

  if (edit) return (
    <tr>
      <td><input name="name" value={form.name} onChange={onChange} /></td>
      <td><input name="email" value={form.email} onChange={onChange} /></td>
      <td><input name="course" value={form.course} onChange={onChange} /></td>
      <td><input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} /></td>
      <td>
        <select name="feesStatus" value={form.feesStatus} onChange={onChange}>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Half-paid</option>
        </select>
      </td>
      <td>
        <button onClick={save}>Save</button>
        <button onClick={() => setEdit(false)}>Cancel</button>
      </td>
    </tr>
  );

  return (
    <tr>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.course}</td>
      <td>{student.amount}</td>
      <td>{student.feesStatus}</td>
      <td>
        <button onClick={() => setEdit(true)}>Edit</button>
        <button onClick={del}>Delete</button>
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
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <table border="1" cellPadding="6" cellSpacing="0">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Course</th><th>Amount</th><th>Fees Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <Row key={s.id} student={s} onUpdated={load} onDeleted={load} />
        ))}
      </tbody>
    </table>
  );
}
