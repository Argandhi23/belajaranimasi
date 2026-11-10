# Alur Git untuk Belajar Animasi

Semua perubahan memakai branch khusus, termasuk dokumentasi dan konfigurasi. `main` adalah versi yang sudah diterima. Aturan di AGENTS.md mengarahkan agent; aturan tersebut bukan branch protection teknis GitHub.

| Istilah           | Arti                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| Branch            | Jalur kerja terpisah untuk satu tugas                                            |
| Commit            | Catatan perubahan lokal dengan pesan yang menjelaskan isinya                     |
| Push              | Mengirim commit ke GitHub                                                        |
| Pull request (PR) | Usulan memasukkan perubahan branch ke `main`, beserta diff dan hasil pemeriksaan |
| Merge             | Menggabungkan perubahan yang sudah direview ke branch tujuan                     |
| Pull              | Mengambil dan mengintegrasikan perubahan dari GitHub ke lokal                    |
| Conflict          | Bagian perubahan yang harus dipadukan secara manual karena bertabrakan           |

## Memulai tugas baru

Pastikan tugas sebelumnya sudah selesai dan tidak ada perubahan lokal yang belum ditangani:

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c feat/nama-fitur
```

Gunakan `fix/` untuk perbaikan, `docs/` untuk dokumentasi, dan `chore/` untuk pemeliharaan. Jika `git status` menunjukkan pekerjaan yang belum selesai, jangan memaksa pindah branch atau menghapusnya.

## Menyimpan dan mengusulkan perubahan

Edit file pada branch tugas, periksa diff, lalu jalankan tes yang relevan. Contoh untuk satu perubahan dokumentasi:

```sh
git diff
git add docs/GIT_WORKFLOW.md
git diff --cached
git commit -m "docs: explain branch workflow"
git push -u origin docs/nama-tugas
```

Nama branch pada push harus sesuai branch aktif. Buka PR di GitHub dengan **base: main** dan **compare: branch tugas**. Baca tab Files changed dan hasil Actions. Push belum berarti merge: `main` tetap sama sampai PR digabungkan.

## Review dan merge

Pemilik meninjau perubahan dan memberi instruksi merge. Untuk belajar melihat riwayat branch, opsi **Create a merge commit** mempertahankan commit dan mencatat penggabungan. Jangan merge jika pemeriksaan wajib gagal atau ada konflik yang belum dipahami.

Sesudah merge di GitHub, dengan working tree lokal bersih:

```sh
git switch main
git pull --ff-only origin main
git log --oneline --graph --decorate -12
```

Buat branch baru untuk tugas berikutnya. Branch lama tidak perlu langsung dihapus. Jika `--ff-only` gagal, berhenti dan periksa perbedaan riwayat; jangan memakai force-push atau reset untuk menghilangkan masalah.

## Publikasi pertama proyek ini

Commit baseline aplikasi adalah `16e7763`, dibuat pada `feat/catalogue`. Baseline diterbitkan ke remote `main` karena repository tujuan masih kosong. Aturan workflow ditambahkan secara terpisah pada `docs/git-workflow`, sehingga perubahan aturan dapat dipelajari lewat diff dan PR sebelum merge.
