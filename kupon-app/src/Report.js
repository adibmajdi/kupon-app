import { useState, useEffect } from "react";

function Report({ setMenu }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [coupons, setCoupons] = useState([]);

  // Ambil daftar batch
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/batch");
        const data = await res.json();
        setBatches(data);
      } catch (err) {
        console.error("Error ambil batch:", err);
      }
    };
    fetchBatches();
  }, []);

  // Ambil detail kupon per batch
  const fetchDetail = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/batch/${id}`);
      const data = await res.json();
      setSelectedBatch(data.batch);
      setCoupons(data.coupons);
    } catch (err) {
      console.error("Error ambil detail:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-6">📄 Laporan Kupon</h2>

      {!selectedBatch ? (
        <>
          {/* Tabel daftar batch */}
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">ID Batch</th>
                <th className="px-4 py-2 border">Operator</th>
                <th className="px-4 py-2 border">Lokasi</th>
                <th className="px-4 py-2 border">No Batch</th>
                <th className="px-4 py-2 border">Tanggal</th>
                <th className="px-4 py-2 border">Total Kupon</th>
                <th className="px-4 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{b.id}</td>
                  <td className="px-4 py-2 border">{b.operator}</td>
                  <td className="px-4 py-2 border">{b.lokasi}</td>
                  <td className="px-4 py-2 border">{b.batch_no}</td>
                  <td className="px-4 py-2 border">
                    {new Date(b.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{b.total_coupons}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => fetchDetail(b.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Detail batch */}
          <h3 className="text-lg font-semibold mb-2">
            Batch {selectedBatch.batch_no}
          </h3>
          <p>
            <b>Operator:</b> {selectedBatch.operator}
          </p>
          <p>
            <b>Lokasi:</b> {selectedBatch.lokasi}
          </p>
          <p>
            <b>Tanggal:</b>{" "}
            {new Date(selectedBatch.created_at).toLocaleString()}
          </p>

          {/* Tabel detail kupon */}
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden text-sm mt-4">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">No Kupon</th>
                <th className="px-4 py-2 border">Hadiah</th>
                <th className="px-4 py-2 border">Box</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{c.number}</td>
                  <td className="px-4 py-2 border">{c.prize}</td>
                  <td className="px-4 py-2 border">{c.box}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setSelectedBatch(null)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              ⬅ Kembali ke Daftar Batch
            </button>
          </div>
        </>
      )}

      {/* Tombol back ke home SELALU tampil */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setMenu("home")}
          className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          ⬅ Kembali ke Home
        </button>
      </div>
    </div>
  );
}

export default Report;
