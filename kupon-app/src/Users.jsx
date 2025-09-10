// src/Users.jsx
import { useEffect, useState } from 'react';

export default function Users() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setList(data);
    setLoading(false);
  }

  async function addUser(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Users</h2>
      <form onSubmit={addUser} style={{ display: 'flex', gap: 8 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nama baru…"
          style={{ flex: 1 }}
        />
        <button type="submit">Tambah</button>
      </form>

      {loading ? <p>Loading…</p> : (
        <ul>
          {list.map(u => (
            <li key={u.id}>{u.name} — {new Date(u.created_at).toLocaleString()}</li>
          ))}
        </ul>
      )}
    </div>
  );
}