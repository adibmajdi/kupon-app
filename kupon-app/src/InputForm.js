import { useState } from "react";

function InputForm({ setMenu }) {
  const [form, setForm] = useState({
    operator: "",
    lokasi: "",
    batchNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);

    // Kirim 2 key ("batchNo" & "batch_no") biar kompatibel dengan backend Anda
    const payload = {
      operator: form.operator.trim(),
      lokasi: form.lokasi.trim(),
      batchNo: form.batchNo.trim(),
      batch_no: form.batchNo.trim(),
    };

    try {
      // Coba ke endpoint RESTful yang kita pakai di Report (POST /api/batch)
      let res = await fetch("http://localhost:5000/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Jika backend lama Anda pakai /api/generate, fallback otomatis
      if (!res.ok) {
        const text = await res.text();
        // coba sekali lagi ke /api/generate
        res = await fetch("http://localhost:5000/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(text || "Gagal generate kupon");
        }
      }

      const data = await res.json();
      const id = data?.batch?.id || data?.id || "-";
      setMsg(`Berhasil generate kupon. ID Batch: ${id}`);
    } catch (e2) {
      setErr(e2.message || "Terjadi kesalahan saat generate kupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold text-gray-800 text-center">Form Input Batch</h2>

      {msg && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm">
          {msg}
        </div>
      )}
      {err && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">Operator</label>
          <input
            type="text"
            name="operator"
            value={form.operator}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Lokasi</label>
          <input
            type="text"
            name="lokasi"
            value={form.lokasi}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">No Batch</label>
          <input
            type="text"
            name="batchNo"
            value={form.batchNo}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="mis. B240905-01"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {loading ? "Memproses…" : "Generate Kupon"}
          </button>

          <button
            type="button"
            onClick={() => setMenu("home")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
          >
            ⬅ Kembali
          </button>

          {msg && (
            <button
              type="button"
              onClick={() => setMenu("report")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              📄 Lihat Laporan
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default InputForm;
