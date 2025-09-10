// api/batch.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // dari Neon
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM batches ORDER BY id DESC");
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { operator, lokasi, batchNo } = req.body;
      const result = await pool.query(
        "INSERT INTO batches (operator, lokasi, batch_no) VALUES ($1, $2, $3) RETURNING *",
        [operator, lokasi, batchNo]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
