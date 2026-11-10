# Verifikasi milestone pertama

Tanggal: 10 November 2026. Implementasi lokal, bukan laporan deployment cloud. Node 26.13.0, pnpm 11.25.0, TypeScript 6.0.3, PostgreSQL 17.7 melalui Rancher Desktop/Moby pada Windows.

## Cakupan yang diuji

- Workspace React/Vite → NestJS HTTP → Prisma → PostgreSQL; dua migrasi nyata, seed idempoten tiga animasi, database pengujian terpisah di port 5434.
- Pencarian kalimat Indonesia, filter, pagination, publikasi/draft, input salah, parameter SQL, dan perubahan metadata yang memperbarui indeks GIN.
- Pin/scrub dengan transform nyata, parallax dengan kecepatan berbeda, canvas WebGL aktual yang berubah saat scroll, reduced motion, fallback WebGL, context loss, serta cleanup pin ketika navigasi/remount.
- Clipboard kode dan prompt, navigasi keyboard, tema tersimpan, kondisi kosong/404/API tidak tersedia, desktop dan emulasi mobile.

Perintah pemeriksaan: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:reader`, `pnpm db:seed`, `pnpm db:test:prepare`, `pnpm contracts`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build`, `pnpm test:e2e`.

Hasil suite lokal: 10 unit test, 4 tes integrasi PostgreSQL, 18 tes Playwright (9 skenario × desktop/mobile) lulus. Suite Playwright juga dijalankan ulang terhadap API hasil kompilasi dan Vite production preview: 18/18 lulus. Generator kontrak diperiksa agar deterministik; format, lint, strict typecheck, dan build lulus. CI tersedia tetapi belum dijalankan di GitHub.

## Pemeriksaan tampilan

Playwright MCP dipakai untuk inspeksi langsung; Browser plugin/skill tidak tersedia. Screenshot desktop 1440×1000 dan mobile 393×851 diambil dan dibaca dengan `view_image`. Acuan desain adalah spesifikasi berbasis kode di ARCHITECTURE.md, bukan konsep ImageGen: tidak memakai layanan AI gambar untuk menjaga batas anggaran.

Lima aspek yang diperiksa: hierarki judul/pencarian, grid tiga kolom ke satu kolom, palet netral dan aksen tiap kategori, keterbacaan label/kontrol, serta spasi dan overflow mobile. Tema gelap dan demo kubus juga diperiksa. Teks dan section mengikuti spesifikasi; tidak ada raster yang menggantikan UI. Perubahan yang diperbaiki mencakup filter pinning yang terlewat, fallback cube yang aktif prematur, dan kondisi balapan filter cepat pada mobile.

## Sampel performa dan batasnya

Perangkat pengukuran: Intel Core i5-13450HX, renderer ANGLE Intel UHD Graphics/D3D11, browser Chromium melalui Playwright MCP, viewport 1440×1000. Sampel scroll 120 frame pada dev build setelah scene kubus dimuat:

| Metrik                      | Hasil                                  |
| --------------------------- | -------------------------------------- |
| Interval frame median / p95 | 16,7 / 16,9 ms                         |
| Long task selama sampel     | 0                                      |
| Draw call per render kubus  | 1                                      |
| Geometri / tekstur renderer | 1 / 1                                  |
| JS heap saat sampel         | sekitar 84,7 MB (termasuk dev tooling) |
| Cleanup navigasi            | R3F root 1 → 0; canvas 0; pin spacer 0 |

Ini sampel singkat, bukan jaminan 60 fps di semua perangkat dan bukan tes kebocoran memori jangka panjang. Ponsel fisik berdaya rendah, Safari/Firefox, dan koneksi cloud belum diuji. R3F/Three mengeluarkan peringatan deprecation `THREE.Clock` dari dependency; tidak ada error aplikasi pada alur normal yang diperiksa.

Build menghasilkan entry sekitar 382 KB (126 KB gzip) dan chunk 3D lazy sekitar 895 KB (239 KB gzip). Vite masih memberi peringatan ukuran chunk 3D; chunk tersebut hanya dimuat saat membuka demo 3D. Shiki dibatasi pada grammar TSX dan satu tema, tanpa seluruh bundle bahasa.

## Status publikasi dan biaya

Belum ada akun/proyek hosting yang dibuat, koneksi GitHub yang diaktifkan, push, atau deployment cloud. Semua tetap lokal. Ketersediaan runtime di penyedia, kelayakan akun Free, kuota aktual, dan konektivitas domain final harus diperiksa saat pemilik ikut deployment. Panduan DEPLOYMENT.md menjelaskan batas Rp0 dan larangan upgrade otomatis. Free-tier tidak menjamin uptime produksi.
