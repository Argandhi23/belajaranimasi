# Deployment Rp0

Panduan ini menyiapkan deployment personal, nonkomersial dengan arsitektur **full-stack terpisah (decoupled)**: dua proyek terpisah di **Vercel Hobby** (Frontend Vite + Backend API NestJS) dan database PostgreSQL di **Neon Free**. Belum ada akun, proyek cloud, koneksi GitHub, ataupun deployment yang dibuat otomatis oleh file konfigurasi ini. Pemilik harus ikut masuk ke akun dan memberi persetujuan sebelum setiap koneksi layanan baru. Jangan membeli domain; gunakan subdomain gratis penyedia. Jangan menambahkan kartu, mencoba paket berbayar, atau mengaktifkan upgrade otomatis. Jika onboarding mewajibkan kartu/pembayaran, berhenti.

## Sepuluh persyaratan sebelum publikasi

1. **Kelayakan:** pastikan penggunaan personal dan nonkomersial memenuhi Vercel Hobby; jangan menerapkan aplikasi bisnis pada paket tersebut.
2. **Anggaran:** periksa kembali batas paket dan kebijakan tagihan di dashboard sebelum menyetujui layanan; pertahankan Rp0 dan tanpa kartu.
3. **Repositori:** pemilik memilih repositori GitHub dan menyetujui koneksi penyedia. Hindari rahasia, `.env`, hasil tes, dan kredensial di Git.
4. **Runtime:** Node 26.x (`26.13.0` di lokal/CI) dan pnpm 11.25.0 harus tersedia di penyedia. Jika runtime belum didukung, hentikan deployment dan tinjau alternatif bersama pemilik, jangan diam-diam mengganti versi.
5. **Database:** Neon Free, region dekat API (Singapura `ap-southeast-1`), koneksi TLS, role pemilik terpisah dari pembaca runtime.
6. **Migrasi:** tinjau SQL, cadangkan data yang sudah ada, jalankan migrasi/seed secara manual dari komputer tepercaya. Jangan menjalankannya pada startup API.
7. **API (Vercel Project 2):** Vercel Hobby dengan NestJS + Fluid Compute (`Root Directory: apps/api`, region `sin1`), secret `DATABASE_URL` pooled role pembaca, `NODE_ENV=production`, dan origin CORS HTTPS yang tepat.
8. **Frontend (Vercel Project 1):** Vercel Hobby (`Root Directory: .`), build hanya web, `VITE_API_URL` URL HTTPS API; semua variabel `VITE_*` bersifat publik.
9. **Verifikasi:** CI lulus; cek `/health`, query katalog, header `Cache-Control`, validasi input, refresh halaman detail, keyboard, mobile, reduced motion, dan kegagalan jaringan pada URL final.
10. **Operasi:** pantau kuota Vercel Hobby & Neon Free, simpan backup secara lokal dengan aman, serta siapkan rollback kode. Jangan menjanjikan uptime produksi.

## Batas gratis yang diperiksa 19 November 2026

| Layanan        | Batas dan konsekuensi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel Hobby   | Hanya penggunaan personal nonkomersial, tanpa kartu kredit. Mendukung hingga 200 proyek, Node.js `26.x`, serta NestJS + Fluid Compute (1 region per proyek, mis. `sin1`). Kuota fungsi per siklus 30 hari mencakup **1.000.000 invocations**, **4 Active CPU-hours** (waktu tunggu I/O ke database tidak dihitung), **360 GB-hours provisioned memory**, dan timeout hingga 300 detik. Jika kuota habis, layanan menunggu reset siklus 30 hari. [Hobby](https://vercel.com/docs/plans/hobby), [NestJS on Vercel](https://vercel.com/docs/frameworks/backend/nestjs). |
| Neon Free      | Tanpa kartu kredit. **100 proyek**, **10 branch/proyek**, **100 CU-hours/proyek/bulan** (ukuran minimum 0,25 CU ≈ 400 jam aktif/bulan, autoscale hingga 2 CU), **scale-to-zero otomatis setelah 5 menit idle** (terkunci di Free, bangun kembali dalam beberapa ratus milidetik), **1 GB PostgreSQL/proyek** (total 20 GB), dan **5 GB transfer publik/proyek/bulan**. Jika kuota habis, compute di-pause hingga siklus berikutnya. [Plans](https://neon.com/docs/introduction/plans).                                                                               |
| GitHub Actions | Standard hosted runner pada repositori publik gratis; larger runner tetap berbayar. Repositori privat memiliki allowance dan potensi biaya tambahan. Rekomendasi Rp0: repositori publik setelah audit rahasia, runner standar, tanpa cache/artifact berbayar. [Billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).                                                                                                                                                                                                                 |

## 1. Neon: database dan hak akses

Setelah persetujuan pemilik, buat proyek **Free** di region **Singapore (`ap-southeast-1`)** agar sejajar dengan region `sin1` API Vercel. Salin URL langsung (_direct_) untuk role pemilik ke lingkungan lokal tepercaya sebagai `DIRECT_DATABASE_URL`. Pertahankan parameter TLS yang diberikan Neon; jangan gunakan `sslmode=disable`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, atau `rejectUnauthorized: false`. Jangan menyalin URL ke chat, screenshot, Git, frontend, atau log.

Tinjau `apps/api/prisma/migrations` lalu jalankan `pnpm db:generate`, `pnpm db:migrate`, dan `pnpm db:seed` dengan environment produksi yang sengaja dipilih. Pastikan variabel lokal pengujian tidak ikut diarahkan ke Neon. Seed mengubah katalog: tinjau dampaknya pada data yang sudah ada dahulu. `prisma.config.ts` memilih `DIRECT_DATABASE_URL` sebelum `DATABASE_URL`.

Buat role `belajar_reader` dengan password acak melalui pengelolaan PostgreSQL yang aman. Jangan gunakan role pemilik sebagai runtime. Role ini memerlukan `CONNECT` pada database, `USAGE` pada schema `public`, dan `SELECT` pada tabel; tetapkan default privileges pemilik untuk tabel berikutnya. Cabut kemampuan create pada schema publik jika tersedia bagi role umum. `default_transaction_read_only=on` merupakan pertahanan tambahan, bukan pengganti pencabutan hak tulis. Verifikasi role tidak dapat INSERT/UPDATE/DELETE maupun CREATE.

Helper `pnpm db:reader` sengaja hanya bekerja untuk database lokal; jangan melonggarkan guard-nya untuk Neon. Simpan URL **pooled** (`-pooler`) role pembaca sebagai `DATABASE_URL` di Project API Vercel. URL langsung pemilik tetap lokal untuk migrasi/seed; tidak perlu disimpan di layanan API. Pilih host pooler dari dashboard Neon, bukan mengedit hostname secara spekulatif. TLS tetap aktif untuk kedua URL.

## 2. Vercel Project 2: Backend API NestJS (Fluid Compute)

Dengan persetujuan pemilik, import repositori GitHub di Vercel sebagai proyek **Hobby** khusus backend (mis. `belajar-animasi-api`) dengan pengaturan:

```text
Root Directory: apps/api
Framework Preset: NestJS (otomatis terbaca dari apps/api/vercel.json)
Install Command: cd ../.. && pnpm install --frozen-lockfile --ignore-scripts
Build Command: pnpm build (menjalankan prisma generate && tsc -p tsconfig.build.json)
Region: sin1 (Singapura — diatur di apps/api/vercel.json)
Node.js Version: 26.x
```

Environment Variables pada Project API (jangan sertakan `DIRECT_DATABASE_URL` atau password pemilik):

```text
NODE_ENV: production
DATABASE_URL: pooled TLS URL role pembaca Neon (belajar_reader)
CORS_ORIGINS: https://nama-web-proyek.vercel.app
```

File `apps/api/vercel.json` sudah menyiapkan preset `nestjs`, region tunggal `sin1`, frozen install dari root monorepo, dan build `tsconfig.build.json` yang menjalankan `prisma generate` sebelum kompilasi hanya `src/**/*.ts` (tanpa menyertakan test/seed/script ke bundle function). Untuk menekan pemakaian kuota Vercel Hobby (invocations, Active CPU, provisioned memory, transfer) dan Neon Free (CU-hours):

- Endpoint katalog publik (`/api/animations`, `/api/animations/:slug`, `/api/categories`) mengirim `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300` sekaligus `CDN-Cache-Control` dan `Vercel-CDN-Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` sehingga Vercel Edge CDN melayani respons hingga 1 jam tanpa memicu Fluid Compute maupun membangunkan Neon, dan tetap melayani stale hingga 24 jam sambil revalidasi latar belakang. `/health` serta respons error memakai `no-store` di ketiga header tersebut.
- Query daftar animasi digabung ke satu CTE PostgreSQL (tanpa transaksi ganda, tanpa `JOIN` kategori saat filter kategori kosong) dan langsung berhenti saat hasil kosong; pool `pg` dibatasi `max: 3`, `idleTimeoutMillis: 5000`, `allowExitOnIdle: true` agar Neon Free bisa scale-to-zero dengan bersih. Body parser dimatikan karena API bersifat read-only (`GET` saja), dan preflight CORS dicache `maxAge: 86400`.
- Frontend memakai cache TanStack Query in-memory (`staleTime` 10 menit, `gcTime` 30 menit, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`), menormalisasi query pencarian agar memaksimalkan Edge CDN hit rate, menyaring kategori & tingkat kesulitan secara lokal saat seluruh katalog sudah termuat, mengisi halaman detail dari cache katalog, serta menunda pemuatan highlighter Shiki hingga panel kode mendekati viewport agar kunjungan demo layar penuh tidak mengunduh paket syntax highlighter. Aset hashed Vite di `/assets/*` dicache `immutable` 1 tahun lewat `vercel.json`.

_(Catatan: file `render.yaml` tetap dipertahankan hanya sebagai referensi cadangan apabila suatu saat ingin membandingkan deployment container tradisional di Render Free; deployment utama menggunakan Vercel Hobby agar tidak terkena spin-down 15 menit / cold start ~60 detik Render Free.)_

## 3. Vercel Project 1: Frontend Vite

Import repositori GitHub yang sama sebagai proyek **Hobby** terpisah (mis. `belajar-animasi-web`) dengan **Root Directory: `.`**. File `vercel.json` di root menyediakan install frozen tanpa lifecycle script, build `pnpm --filter @belajar/web build`, output `apps/web/dist`, dan fallback SPA ke `index.html`. Pilih Node `26.x`.

Isi Environment Variable build:

```text
VITE_API_URL: https://nama-api-proyek.vercel.app
```

Tidak ada database secret di proyek Frontend. Nilai `VITE_API_URL` ditanam dalam bundle static Vite, sehingga perubahan URL API memerlukan build ulang. Setelah domain final Frontend diketahui, perbarui `CORS_ORIGINS` di Project API Vercel ke origin persis tersebut (tanpa garis miring di akhir dan tanpa wildcard `*`).

## 4. CI, smoke check, dan pemulihan

Workflow `.github/workflows/ci.yml` berjalan pada PR, push `main`, atau manual. Izin hanya membaca isi repositori; kredensial checkout tidak disimpan; timeout 20 menit dan run lama dibatalkan. Tidak ada deployment secret. `.env` acak dibuat hanya pada runner sementara. Compose memulai database lokal plus database tes sementara, lalu migrasi, role pembaca, seed, kontrak OpenAPI, format/lint/typecheck, unit/integrasi/build, dan Playwright desktop/mobile. Runner tidak menyentuh Neon.

Sesudah deploy, verifikasi langsung pada URL produksi:

- `GET https://<api>/health` mengembalikan `200` dengan `{"status":"ok"}` dan header `Cache-Control: no-store`.
- `GET https://<api>/api/animations` mengembalikan katalog 14 demo dan header `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`.
- `GET https://<api>/api/docs` menampilkan Swagger UI.
- Halaman frontend dapat mencari (kalimat Indonesia), memfilter kategori/kesulitan, membuka halaman detail lalu refresh langsung, menyalin kode & prompt, mengganti tema gelap/terang, serta bekerja dengan keyboard dan `prefers-reduced-motion`.
- Database menolak operasi tulis dari role runtime `belajar_reader` dan respons error API tidak membocorkan rahasia.

Untuk rollback, gunakan fitur **Instant Rollback** di dashboard Vercel ke deployment terakhir yang lulus. Migrasi database tidak otomatis dibatalkan oleh rollback kode: gunakan perubahan kompatibel ke belakang, tinjau rencana pemulihan, dan restore backup hanya setelah persetujuan. Jangan menambah ping keep-alive untuk mengakali batas layanan gratis.
