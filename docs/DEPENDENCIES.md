# Dependensi dan reproduksibilitas

Runtime proyek dipatok pada Node 26.13.0 dan pnpm 11.25.0; TypeScript 6.0.3. `package.json` tiap workspace menyatakan dependensi dan `pnpm-lock.yaml` mengunci resolusi lengkap. Gunakan `pnpm install --frozen-lockfile --ignore-scripts`; jangan memperbarui lockfile diam-diam di CI atau hosting.

React/Vite/Tailwind menangani UI; GSAP dan `@gsap/react` menangani lifecycle animasi; React Three Fiber/Three.js dimuat untuk contoh 3D. NestJS, Prisma dengan adapter `pg`, dan PostgreSQL menangani REST dan data. `openapi-typescript` menghasilkan tipe frontend dari Swagger. Vitest, Playwright, ESLint, dan Prettier memberikan pemeriksaan lokal.

Skrip lifecycle pihak ketiga tidak diaktifkan otomatis. Prisma client dibuat secara eksplisit dengan `pnpm db:generate`, browser pengujian dengan `pnpm exec playwright install chromium`. Jika paket baru memerlukan installer, tinjau sumber dan efeknya sebelum mengizinkan skrip tertentu; jangan mengaktifkan semua skrip untuk mengatasi error.

CI memakai rilis resmi yang diperiksa 10 November 2026: [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0), dan [pnpm/action-setup v6.1.1](https://github.com/pnpm/action-setup/releases/tag/v6.1.1). Versi action berbeda dari versi Node/pnpm aplikasi. Perbarui secara sengaja dan ulangi seluruh pemeriksaan setelah perubahan.

Tidak ada Sentry, Nest Observe, layanan AI berbayar, Supabase, Firebase, atau Stripe yang diperlukan. Pustaka perangkat lunak tidak otomatis memberi izin memakai layanan hostingnya. Semua koneksi akun baru tetap memerlukan keputusan pemilik.

GSAP dipakai sesuai stack yang diminta dan lisensi standar tanpa biaya. Lisensinya berbeda dari lisensi open-source MIT; jangan menyebut seluruh dependency sebagai MIT. Tinjau [lisensi GSAP](https://gsap.com/standard-license/) sebelum redistribusi atau perubahan penggunaan. Skill GSAP berlisensi MIT tidak mengubah lisensi pustakanya.
