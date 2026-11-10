export function Loading() {
  return (
    <div className="feedback" role="status">
      <span className="loading-dot" />
      <h2>Menyiapkan ruang eksplorasi…</h2>
      <p>
        Server gratis mungkin sedang bangun. Permintaan pertama bisa membutuhkan
        sekitar satu menit.
      </p>
    </div>
  );
}
export function Failure({ retry }: { retry: () => void }) {
  return (
    <div className="feedback" role="alert">
      <h2>Katalog belum dapat dimuat</h2>
      <p>Periksa koneksi Anda, lalu coba lagi. Server mungkin masih bangun.</p>
      <button className="button primary" onClick={retry}>
        Coba lagi
      </button>
    </div>
  );
}
