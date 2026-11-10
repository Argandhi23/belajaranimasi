# Belajar Animasi

Katalog pola animasi web berbahasa Indonesia: pencarian, filter, halaman detail, penjelasan, dan contoh yang dapat dipelajari. React/Vite berkomunikasi dengan REST NestJS; PostgreSQL menyimpan katalog, OpenAPI menghasilkan tipe klien.

## Jalankan lokal

Gunakan Node **26.13.0**, pnpm **11.25.0**, dan engine Docker Compose yang sudah tersedia. Instalasi sistem atau layanan baru membutuhkan persetujuan pemilik komputer.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm local:setup
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm db:reader
pnpm db:seed
pnpm dev
```

`local:setup` membuat `.env` terabaikan Git berisi kata sandi acak, serta mempertahankan `.env` yang sudah ada. Jangan membagikan file itu. Web tersedia di `http://localhost:5173`, API di `http://localhost:3000`, Swagger di `/api/docs`. PostgreSQL lokal hanya terikat ke loopback port 5433. Role API hanya membaca; migrasi/seed menggunakan role pemilik.

## Pemeriksaan

```sh
docker compose --profile test up -d --wait
pnpm db:test:prepare
pnpm contracts
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Jalankan persiapan lokal terlebih dahulu. Pengujian integrasi menggunakan database sementara `belajar_animasi_test` pada port 5434; jangan gunakan URL produksi. Playwright menjalankan server lokal dan proyek Chromium desktop/mobile. Pengujian bukan bukti performa pada semua perangkat.

Hentikan kontainer dengan `docker compose --profile test down`. Jangan tambahkan `--volumes`: volume database pengembangan harus dipertahankan.

## Struktur dan penerapan

- `apps/web`: UI dan penemuan animasi.
- `apps/api`: REST, validasi, Prisma, migrasi, seed.
- `packages/shared`: kontrak OpenAPI dan tipe yang dihasilkan.
- `packages/animation-demos`: contoh animasi terisolasi.
- [Arsitektur](docs/ARCHITECTURE.md), [dependensi](docs/DEPENDENCIES.md), dan [panduan deployment Rp0](DEPLOYMENT.md).
- [Hasil verifikasi dan batas pengujian](docs/VERIFICATION.md).

Konfigurasi deployment disiapkan untuk Vercel Hobby, Render Free, dan Neon Free. Akun, koneksi repositori, serta deployment belum dilakukan oleh konfigurasi ini; pemilik harus memverifikasi kelayakan dan menyetujui koneksi eksternal.
