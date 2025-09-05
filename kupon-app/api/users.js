// api/users.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Inisialisasi client tiap request (aman di serverless)
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, name, created_at
        FROM users
        ORDER BY id DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      // Vercel memberi body bisa string/objek, kita amankan parsing
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const name = (body?.name || '').trim();
      if (!name) return res.status(400).json({ error: 'name is required' });

      const [row] = await sql`
        INSERT INTO users (name) VALUES (${name})
        RETURNING id, name, created_at
      `;
      return res.status(201).json(row);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
