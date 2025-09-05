// api/users.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW()`;
    return res.status(200).json({ success: true, time: result[0].now });
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
