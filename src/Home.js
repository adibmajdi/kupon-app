function Home({ setMenu }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <h1 className="text-4xl font-bold mb-8">🎫 Sistem Kupon</h1>
      <div className="space-y-4">
        <button
          onClick={() => setMenu("input")}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg shadow-lg font-medium transition"
        >
          ➕ Generate Kupon
        </button>
        <button
          onClick={() => setMenu("report")}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow-lg font-medium transition"
        >
          📄 Cetak Laporan
        </button>
      </div>
    </div>
  );
}

export default Home;
