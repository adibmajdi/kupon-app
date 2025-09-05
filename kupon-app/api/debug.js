import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const db = await sql`SELECT current_database() as db, current_schema() as schema`;
    const tables = await sql`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `;

    res.status(200).json({ db: db[0], tables });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
