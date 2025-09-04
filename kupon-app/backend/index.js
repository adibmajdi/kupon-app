const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));   // bolehkan request JSON sampai 50 MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// koneksi database
const pool = new Pool({
  user: "postgres",   // ganti sesuai user PostgreSQL 
  host: "localhost",
  database: "kupon_db",
  password: "admin", // ganti sesuai password 
  port: 5432,
});

// API untuk tambah batch + kupon
app.post("/api/batch", async (req, res) => {
  try {
    const { operator, lokasi, batchNo, batch_no } = req.body;

    // Simpan batch
    const result = await pool.query(
      "INSERT INTO batches (operator, lokasi, batch_no) VALUES ($1, $2, $3) RETURNING *",
      [operator, lokasi, batchNo || batch_no]
    );

    const batch = result.rows[0];

    // Contoh: generate 10 kupon default
    const coupons = [];
    for (let i = 1; i <= 10; i++) {
      const number = `${batch.batch_no}-${String(i).padStart(4, "0")}`;
      const prize = "Hadiah Acak"; // bisa diganti sesuai logika
      const box = Math.ceil(i / 5);

      const couponRes = await pool.query(
        "INSERT INTO coupons (batch_id, number, prize, box) VALUES ($1, $2, $3, $4) RETURNING *",
        [batch.id, number, prize, box]
      );
      coupons.push(couponRes.rows[0]);
    }

    res.json({ batch, coupons });
  } catch (err) {
    console.error("Error di POST /api/batch:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// API untuk ambil semua batch
app.get("/api/batch", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.operator, b.lokasi, b.batch_no, b.created_at,
             COUNT(c.id) AS total_coupons
      FROM batches b
      LEFT JOIN coupons c ON b.id = c.batch_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// API untuk ambil kupon berdasarkan batch id
// API untuk ambil detail batch + kuponnya
app.get("/api/batch/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ambil data batch
    const batch = await pool.query("SELECT * FROM batches WHERE id=$1", [id]);

    // ambil semua kupon terkait batch
    const coupons = await pool.query(
      "SELECT * FROM coupons WHERE batch_id=$1 ORDER BY number ASC",
      [id]
    );

    res.json({
      batch: batch.rows[0],
      coupons: coupons.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
