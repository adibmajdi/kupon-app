// api/users.js
import { sql } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM public.users ORDER BY id DESC`;
      return res.json(rows);
    }

    if (req.method === "POST") {
      const { name } = req.body;
      const result = await sql`
        INSERT INTO public.users (name) 
        VALUES (${name}) 
        RETURNING *`;
      return res.json(result[0]);
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
