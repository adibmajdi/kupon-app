import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const db = await sql`SELECT current_database(), current_schema()`;
    res.json({ db });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

