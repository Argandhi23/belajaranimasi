# Deployment Rp0

Panduan ini menyiapkan deployment personal, nonkomersial. Belum ada akun, proyek cloud, koneksi GitHub, ataupun deployment yang dibuat oleh file konfigurasi ini. Pemilik harus ikut masuk ke akun dan memberi persetujuan sebelum setiap koneksi layanan baru. Jangan membeli domain; gunakan subdomain gratis penyedia. Jangan menambahkan kartu, mencoba paket berbayar, atau mengaktifkan upgrade otomatis. Jika onboarding mewajibkan kartu/pembayaran, berhenti.

## Sepuluh persyaratan sebelum publikasi

1. **Kelayakan:** pastikan penggunaan personal dan nonkomersial memenuhi Vercel Hobby; jangan menerapkan aplikasi bisnis pada paket tersebut.
2. **Anggaran:** periksa kembali batas paket dan kebijakan tagihan di dashboard sebelum menyetujui layanan; pertahankan Rp0 dan tanpa kartu.
3. **Repositori:** pemilik memilih repositori GitHub dan menyetujui koneksi penyedia. Hindari rahasia, `.env`, hasil tes, dan kredensial di Git.
4. **Runtime:** Node 26.13.0 dan pnpm 11.25.0 harus tersedia di penyedia. Jika runtime belum didukung, hentikan deployment dan tinjau alternatif bersama pemilik, jangan diam-diam mengganti versi.
5. **Database:** Neon Free, region dekat API, koneksi TLS, role pemilik terpisah dari pembaca runtime.
6. **Migrasi:** tinjau SQL, cadangkan data yang sudah ada, jalankan migrasi/seed secara manual dari komputer tepercaya. Jangan menjalankannya pada startup API.
7. **API:** Render Free, secret `DATABASE_URL` pembaca, `NODE_ENV=production`, dan origin CORS HTTPS yang tepat.
8. **Frontend:** Vercel Hobby, root repositori, build hanya web, `VITE_API_URL` URL HTTPS API; semua variabel `VITE_*` bersifat publik.
9. **Verifikasi:** CI lulus; cek health, query katalog, validasi input, refresh halaman detail, keyboard, mobile, reduced motion, dan kegagalan jaringan pada URL final.
10. **Operasi:** pantau kuota dan cold start, simpan backup secara lokal dengan aman, serta siapkan rollback kode. Jangan menjanjikan uptime produksi.

## Batas gratis yang diperiksa 10 November 2026

| Layanan        | Batas dan konsekuensi                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel Hobby   | Hanya penggunaan personal nonkomersial. Batas umum mencakup satu build bersamaan dan 100 deployment/hari; pelampauan sebagian kuota mengharuskan menunggu reset. Gunakan hanya static Vite, tanpa fungsi server berbayar. [Hobby](https://vercel.com/docs/plans/hobby), [limits](https://vercel.com/docs/limits).                                                                                                                                              |
| Render Free    | 750 jam instance/workspace/bulan; layanan tidur setelah 15 menit tidak aktif, startup berikutnya lambat. Filesystem sementara dan tidak ada disk persisten gratis. Bandwidth dan menit build juga memiliki kuota dashboard. Dokumentasi menyatakan bandwidth berlebih dapat ditagihkan: pantau dan suspend layanan **sebelum** habis; label Free bukan jaminan semua penggunaan Rp0. Jangan menambahkan kartu. [Free instances](https://render.com/docs/free). |
| Neon Free      | Halaman paket saat pemeriksaan mencantumkan 100 proyek, 10 branch/proyek, 100 CU-hours/proyek/bulan, 1 GB PostgreSQL/proyek dengan total 20 GB, dan 5 GB transfer publik/proyek/bulan. Kuota dapat berubah; ikuti dashboard, jangan upgrade saat habis. [Plans](https://neon.com/docs/introduction/plans).                                                                                                                                                     |
| GitHub Actions | Standard hosted runner pada repositori publik gratis; larger runner tetap berbayar. Repositori privat memiliki allowance dan potensi biaya tambahan. Rekomendasi Rp0: repositori publik setelah audit rahasia, runner standar, tanpa cache/artifact berbayar. [Billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).                                                                                                           |

## 1. Neon: database dan hak akses

Setelah persetujuan pemilik, buat proyek **Free** dan database katalog. Salin URL langsung untuk role pemilik ke lingkungan lokal tepercaya sebagai `DIRECT_DATABASE_URL`. Pertahankan parameter TLS yang diberikan Neon; jangan gunakan `sslmode=disable`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, atau `rejectUnauthorized: false`. Jangan menyalin URL ke chat, screenshot, Git, frontend, atau log.

Tinjau `apps/api/prisma/migrations` lalu jalankan `pnpm db:generate`, `pnpm db:migrate`, dan `pnpm db:seed` dengan environment produksi yang sengaja dipilih. Pastikan variabel lokal pengujian tidak ikut diarahkan ke Neon. Seed mengubah katalog: tinjau dampaknya pada data yang sudah ada dahulu. `prisma.config.ts` memilih `DIRECT_DATABASE_URL` sebelum `DATABASE_URL`.

Buat role `belajar_reader` dengan password acak melalui pengelolaan PostgreSQL yang aman. Jangan gunakan role pemilik sebagai runtime. Role ini memerlukan `CONNECT` pada database, `USAGE` pada schema `public`, dan `SELECT` pada tabel; tetapkan default privileges pemilik untuk tabel berikutnya. Cabut kemampuan create pada schema publik jika tersedia bagi role umum. `default_transaction_read_only=on` merupakan pertahanan tambahan, bukan pengganti pencabutan hak tulis. Verifikasi role tidak dapat INSERT/UPDATE/DELETE maupun CREATE.

Helper `pnpm db:reader` sengaja hanya bekerja untuk database lokal; jangan melonggarkan guard-nya untuk Neon. Simpan URL **pooled** role pembaca sebagai `DATABASE_URL` di Render. URL langsung pemilik tetap lokal untuk migrasi/seed; tidak perlu disimpan di layanan API. Pilih host pooler dari dashboard, bukan mengedit hostname secara spekulatif. TLS tetap aktif untuk kedua URL.

## 2. Render: API NestJS

Dengan persetujuan pemilik, hubungkan repositori dan gunakan Blueprint `render.yaml` atau isikan nilai yang sama secara manual. Root directory tetap root repositori. Pilih paket **Free** dan jangan membuat database Render: database ada di Neon.

```text
Build: pnpm install --frozen-lockfile --ignore-scripts && pnpm db:generate && pnpm --filter @belajar/api build
Start: pnpm --filter @belajar/api start
Health: /health
NODE_VERSION: 26.13.0
PNPM_VERSION: 11.25.0
NODE_ENV: production
DATABASE_URL: pooled TLS URL role pembaca Neon (secret)
CORS_ORIGINS: https://nama-proyek.vercel.app
```

Render menyediakan `PORT`; API membacanya. Jangan menetapkan `DIRECT_DATABASE_URL`, test URL, atau password pemilik di Render. Instalasi membutuhkan devDependencies untuk TypeScript/Prisma; jangan mengubah install menjadi production-only. Build menghasilkan Prisma client dan kompilasi saja, tanpa migrasi/seed. Deploy otomatis dimatikan supaya penerapan dilakukan setelah CI lulus dan pemeriksaan kuota. Cek `/health` serta endpoint data: proses hidup saja tidak membuktikan database terhubung.

## 3. Vercel: frontend Vite

Setelah persetujuan koneksi, import repositori sebagai proyek **Hobby**, root directory `.`. `vercel.json` menyediakan install frozen tanpa lifecycle, build `pnpm --filter @belajar/web build`, output `apps/web/dist`, dan fallback SPA ke `index.html`. Pilih Node 26.x yang mendukung pin proyek. Pastikan log benar-benar memakai pnpm 11.25.0 dari `packageManager`; jangan menerima perubahan lockfile otomatis.

Isi `VITE_API_URL=https://nama-api.onrender.com` di environment build. Tidak ada database secret di Vercel. Nilai ini ditanam dalam bundle, sehingga perubahan memerlukan build ulang. Setelah domain Vercel diketahui, sesuaikan `CORS_ORIGINS` Render ke origin tepat tersebut. Preview deployment membutuhkan origin tersendiri yang disetujui; jangan gunakan wildcard CORS demi preview.

## 4. CI, smoke check, dan pemulihan

Workflow `.github/workflows/ci.yml` berjalan pada PR, push `main`, atau manual. Izin hanya membaca isi repositori; kredensial checkout tidak disimpan; timeout 20 menit dan run lama dibatalkan. Tidak ada deployment secret. `.env` acak dibuat hanya pada runner sementara. Compose memulai database lokal plus database tes sementara, lalu migrasi, role pembaca, seed, kontrak OpenAPI, format/lint/typecheck, unit/integrasi/build, dan Playwright desktop/mobile. Runner tidak menyentuh Neon.

Sesudah deploy manual, pastikan halaman katalog dapat mencari dan memfilter, detail dapat dibuka langsung lalu di-refresh, sumber kode dapat dibaca, serta UI menampilkan pesan yang berguna saat API tidur/gagal. Periksa URL API tidak mengembalikan rahasia pada error dan database menolak operasi tulis role runtime. Uji keyboard dan reduced motion. Tidak ada klaim lolos sebelum pemeriksaan benar-benar dijalankan.

Untuk rollback aplikasi, deploy kembali commit terakhir yang lulus. Migrasi database tidak otomatis dibatalkan oleh rollback kode: gunakan perubahan kompatibel ke belakang, tinjau rencana pemulihan, dan restore backup hanya setelah persetujuan karena dapat mengganti data. Suspend layanan sebelum kuota berisiko biaya habis. Jangan menambah ping keep-alive untuk menghindari kebijakan tidur layanan gratis.
