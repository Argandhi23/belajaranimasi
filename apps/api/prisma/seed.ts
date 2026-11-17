import { pathToFileURL } from 'node:url';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { loadLocalEnvironment } from '../src/environment.js';
const categories = [
  ['pinning', 'Pin & scrub'],
  ['scrubbing', 'Scroll scrubbing'],
  ['parallax', 'Depth parallax'],
  ['3d', 'Scroll-controlled 3D'],
  ['timeline', 'Multi-stage timeline'],
  ['horizontal', 'Horizontal storytelling'],
  ['typography', 'Kinetic typography'],
  ['svg-morph', 'SVG morph & draw'],
  ['motion-path', 'Motion path'],
  ['flip', 'FLIP layout'],
  ['stagger', 'Stagger'],
  ['cursor', 'Cursor interaction'],
] as const;
const records = [
  {
    slug: 'pin-scrub',
    technicalName: 'ScrollTrigger Pin & Scrub',
    indonesianName: 'Elemen tetap saat halaman digulir',
    shortDescription:
      'Tahan sebuah panel di layar sambil progres animasinya mengikuti jarak scroll.',
    explanation:
      'Pin menahan panel pada area pandang selama rentang scroll tertentu. Scrub menghubungkan kemajuan timeline dengan posisi scroll, sehingga pengguna dapat memajukan dan memundurkan animasi.\n\nGunakan untuk menjelaskan proses bertahap tanpa berpindah halaman. Berikan ruang scroll yang cukup, titik awal dan akhir yang jelas, serta isi yang tetap terbaca ketika gerak dikurangi. Pada contoh ini, sebuah kartu bergerak dan berubah ukuran saat bagian laboratorium ditahan.\n\nTimeline memakai label translate, rotate, dan scale: kartu bergeser, berputar, lalu membesar. Semua ScrollTrigger dan gaya pin dikembalikan ketika komponen dilepas. Preferensi reduced motion menampilkan kotak statis dalam alur dokumen biasa.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'pinning',
    keywords: [
      'elemen',
      'tetap',
      'diam',
      'menempel',
      'lengket',
      'tahan',
      'layar',
      'scroll',
      'gulir',
      'menggulir',
      'pin',
      'scrub',
      'progres',
      'sticky',
      'panel',
      'objek',
      'tengah',
      'membesar',
      'berputar',
    ],
    libraries: ['GSAP', 'ScrollTrigger', 'React'],
    tags: ['scroll', 'pin', 'scrub'],
    aiPrompt:
      'Buat komponen React TypeScript yang menjelaskan pin dan scrub GSAP ScrollTrigger. Buat kotak 100 × 100 px pada panggung setinggi 85svh, minimal 360 px. Gunakan useGSAP dengan scoped ref dan timeline ease none berlabel translate, rotate, scale, masing-masing durasi 1: geser X ke min(240 px, 25% lebar panggung), putar ke 180 derajat, lalu skala ke 1.5 sambil X kembali ke 0. ScrollTrigger mulai top top, berakhir setelah 2 kali tinggi viewport, pin true, pinSpacing true, scrub true, invalidateOnRefresh true. Refresh setelah font siap. Bersihkan saat unmount dan gunakan gsap.matchMedia untuk prefers-reduced-motion. Mode tanpa gerak harus memakai alur dokumen biasa. Jangan menjalankan kode dari input pengguna.',
  },
  {
    slug: 'depth-parallax',
    technicalName: 'Depth Parallax',
    indonesianName: 'Lapisan bergerak beda kecepatan',
    shortDescription:
      'Ciptakan kesan kedalaman melalui tiga lapisan yang bergerak dengan kecepatan berbeda.',
    explanation:
      'Parallax adalah perbedaan pergerakan yang tampak antara objek dekat dan jauh. Lapisan depan bergerak lebih cepat, sementara latar bergerak lebih lambat. Perbedaan ini memberi petunjuk kedalaman tanpa harus memakai model tiga dimensi.\n\nContoh ini menggunakan tiga bidang geometris dengan transform translateY. Tiga tween memakai rentang scroll yang sama; setiap lapisan memiliki satu pemilik animasi. Hindari memindahkan isi penting jauh dari posisi bacanya atau menggunakan parallax untuk navigasi wajib.\n\nLapisan belakang berpindah dari +50 ke -50 px, tengah +130 ke -130 px, dan depan +240 ke -240 px. Pada reduced motion, seluruh lapisan diam dan penjelasan tetap terlihat. Pembersihan konteks mengembalikan transform sehingga navigasi kembali tidak menumpuk animasi.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'parallax',
    keywords: [
      'latar',
      'belakang',
      'lapisan',
      'bergerak',
      'beda',
      'berbeda',
      'kecepatan',
      'kedalaman',
      'depth',
      'parallax',
      'paralaks',
      'scroll',
      'gulir',
      'depan',
      'jauh',
      'dekat',
    ],
    libraries: ['GSAP', 'ScrollTrigger', 'React'],
    tags: ['scroll', 'parallax', 'depth'],
    aiPrompt:
      'Buat demo depth parallax React TypeScript dengan tiga lapisan dekoratif. Buat panggung setinggi 110svh, minimal 600 px, dengan tiga bentuk dekoratif berukuran responsif. Gunakan GSAP useGSAP dan tiga tween fromTo translateY: belakang +50 ke -50 px, tengah +130 ke -130 px, depan +240 ke -240 px. Semua memakai ease none, ScrollTrigger start top bottom, end bottom top, scrub true, invalidateOnRefresh true pada panggung yang sama. Jelaskan jarak total 100, 260, dan 480 px. Refresh setelah font siap tanpa pembacaan layout setiap frame. Bersihkan konteks dan matchMedia saat unmount. Reduced motion mempertahankan lapisan statis dan penjelasan yang terbaca.',
  },
  {
    slug: 'scroll-cube',
    technicalName: 'Scroll-controlled 3D Rotation',
    indonesianName: 'Kubus berputar mengikuti scroll',
    shortDescription:
      'Putar objek tiga dimensi dengan scroll, lengkap dengan fallback tanpa WebGL.',
    explanation:
      'Rotasi tiga dimensi mengubah orientasi objek pada sumbu X dan Y. Dengan menghubungkan sudut rotasi ke progres scroll, pengguna dapat memeriksa bentuk dari beberapa sisi secara terarah.\n\nReact Three Fiber menggambar kubus menggunakan Three.js. Scene dimuat hanya saat dibutuhkan, membatasi pixel ratio, dan memakai demand rendering agar GPU tidak terus bekerja ketika objek diam. Scroll controller menjadi satu-satunya penulis nilai rotasi.\n\nWebGL dapat tidak tersedia, kehilangan konteks, atau gagal memuat. Karena itu, contoh menyediakan representasi statis dan penjelasan teks. Preferensi reduced motion menghentikan rotasi. Geometri dan material dimiliki scene serta dibersihkan ketika scene dilepas.',
    difficulty: 'ADVANCED' as const,
    category: '3d',
    keywords: [
      'kubus',
      'kotak',
      'berputar',
      'putar',
      'rotasi',
      'tiga',
      'dimensi',
      '3d',
      'scroll',
      'gulir',
      'webgl',
      'objek',
      'benda',
    ],
    libraries: ['React Three Fiber', 'Three.js', 'GSAP', 'ScrollTrigger'],
    tags: ['scroll', '3d', 'webgl'],
    aiPrompt:
      'Buat demo React Three Fiber TypeScript berupa kubus yang berputar mengikuti progres scroll. Gunakan boxGeometry 1.7 × 1.7 × 1.7, rotasi awal [0.35, 0.5, 0], kamera tetap [0, 0, 5] dengan fov 45, ambientLight 1.5 dan directionalLight 3. Track 240svh dan panggung sticky 85svh, minimal 400 px. GSAP mengubah rotation.x ke Math.PI * 1.3 dan rotation.y ke Math.PI * 2.25 dengan ease none; ScrollTrigger start top top, end bottom bottom, scrub true. Lazy-load scene, gunakan demand rendering dan DPR maksimal 1.5, serta satu pemilik rotasi. Invalidate hanya saat scroll mengubah rotasi dan canvas terlihat di tab aktif; hentikan observer dan listener saat unmount. Sediakan fallback jika WebGL tidak tersedia atau konteks hilang, reduced motion statis, dan cleanup resource serta listener saat unmount.',
  },
  {
    slug: 'svg-draw',
    technicalName: 'Scroll-linked SVG Stroke Draw',
    indonesianName: 'Garis SVG menggambar saat halaman digulir',
    shortDescription:
      'Gambar jalur vektor secara bertahap dari awal hingga akhir mengikuti progres scroll.',
    explanation:
      'Teknik SVG draw memanfaatkan properti stroke-dasharray dan stroke-dashoffset untuk menyembunyikan lalu menyingkap jalur vektor. Ketika panjang jeda dash disamakan dengan panjang total kurva dari getTotalLength(), menggerakkan offset dari panjang penuh menuju nol membuat garis tampak digambar secara langsung.\n\nDengan menghubungkan perubahan stroke-dashoffset ke GSAP ScrollTrigger melalui scrub, kecepatan menggambar mengikuti posisi gulir pengguna. Pendekatan ini cocok untuk diagram alur, peta rute, atau ilustrasi editorial yang ingin memandu fokus mata dari satu titik ke titik berikutnya.\n\nPada contoh ini, kurva utama memiliki panjang yang dihitung ulang saat ukuran layar berubah melalui invalidateOnRefresh. Preferensi reduced motion mematikan animasi dashoffset sehingga gambar vektor tampil utuh sejak awal tanpa perlu digulir.',
    difficulty: 'BEGINNER' as const,
    category: 'svg-morph',
    keywords: [
      'svg',
      'draw',
      'gambar',
      'menggambar',
      'garis',
      'jalur',
      'path',
      'vektor',
      'stroke',
      'dashoffset',
      'dasharray',
      'mengikuti',
      'scroll',
      'gulir',
      'menggulir',
      'sketsa',
      'kurva',
      'tumbuh',
      'ilustrasi',
    ],
    libraries: ['GSAP', 'ScrollTrigger', 'React'],
    tags: ['scroll', 'svg', 'draw'],
    aiPrompt:
      'Buat komponen React TypeScript untuk demo SVG Draw yang menggambar jalur vektor mengikuti progres scroll. Buat panggung setinggi 110svh, minimal 560 px, berisi SVG viewBox 0 0 600 260 dengan jalur petunjuk tipis dan jalur utama melengkung. Gunakan useGSAP dengan scoped ref, hitung panjang kurva memakai getTotalLength(), lalu animasikan strokeDasharray dan strokeDashoffset dari panjang penuh ke 0 dengan ease none. Hubungkan ke ScrollTrigger pada panggung dengan start top 65%, end bottom 35%, scrub true, dan invalidateOnRefresh true. Refresh setelah font siap. Gunakan gsap.matchMedia untuk prefers-reduced-motion agar gambar SVG tampil lengkap secara statis ketika gerak dikurangi, serta bersihkan semua trigger saat unmount.',
  },
  {
    slug: 'svg-morph',
    technicalName: 'Scroll-linked SVG Shape Morph',
    indonesianName: 'Bentuk SVG berubah mengikuti scroll',
    shortDescription:
      'Ubah satu bentuk vektor menjadi bentuk lain secara mulus mengikuti progres scroll.',
    explanation:
      'Teknik SVG morphing mengubah satu bentuk vektor menjadi bentuk lain dengan menginterpolasi atribut d pada elemen path. Ketika bentuk awal dan bentuk akhir disusun dengan urutan perintah kurva kubik Bézier (M, C, Z) dan jumlah titik kontrol yang sepadan, setiap pasangan koordinat dapat bergeser secara presisi dari posisi asal ke posisi tujuan.\n\nDengan menghubungkan perubahan atribut d ke GSAP ScrollTrigger melalui scrub, transisi bentuk berlangsung seiring jarak gulir pengguna. Pendekatan ini berguna untuk menceritakan perubahan status, evolusi ikon, atau ilustrasi konsep yang bertransformasi secara bertahap.\n\nPada contoh ini, lingkaran empat segmen berubah menjadi bintang empat sudut sambil menampilkan siluet awal dan akhir sebagai pembanding. Saat preferensi reduced motion aktif, animasi atribut d dimatikan dan kedua bentuk pembanding tetap tampil statis sehingga transformasi tetap dapat dipahami tanpa gerak.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'svg-morph',
    keywords: [
      'svg',
      'morph',
      'morphing',
      'bentuk',
      'berubah',
      'perubahan',
      'transformasi',
      'transisi',
      'wujud',
      'lingkaran',
      'bintang',
      'siluet',
      'path',
      'vektor',
      'kurva',
      'bezier',
      'mengikuti',
      'scroll',
      'gulir',
      'menggulir',
    ],
    libraries: ['GSAP', 'ScrollTrigger', 'React'],
    tags: ['scroll', 'svg', 'morph'],
    aiPrompt:
      'Buat komponen React TypeScript untuk demo SVG Morph yang mengubah bentuk lingkaran menjadi bintang empat sudut mengikuti progres scroll. Buat panggung setinggi 100svh, minimal 520 px, berisi SVG viewBox 0 0 640 320 dengan siluet pembanding bentuk awal di kiri, siluet bentuk akhir di kanan, kontur tujuan di tengah, dan path utama yang dianimasikan. Gunakan dua string path dengan empat segmen kubik Bézier (M dan 4 perintah C lalu Z) yang memiliki jumlah titik sepadan. Gunakan useGSAP dengan scoped ref untuk menganimasikan attr.d dari path awal ke path akhir dengan ease none, ScrollTrigger start top 65%, end bottom 35%, scrub true, dan invalidateOnRefresh true. Refresh setelah font siap. Gunakan gsap.matchMedia untuk prefers-reduced-motion agar perbandingan bentuk statis tetap jelas ketika gerak dikurangi, serta bersihkan trigger saat unmount.',
  },
  {
    slug: 'horizontal-story',
    technicalName: 'Horizontal Scroll Gallery',
    indonesianName: 'Galeri mendatar mengikuti gulir vertikal',
    shortDescription:
      'Susuri tiga poster geometris yang bergeser mendatar saat halaman digulir.',
    explanation:
      'ScrollTrigger menahan panggung dengan pin, lalu menghubungkan perpindahan horizontal jalur galeri dengan gulir vertikal lewat scrub. Jarak tempuh berasal dari selisih lebar konten dan lebar panggung, sehingga panel terakhir berhenti sejajar dengan tepi layar.\n\nGunakan teknik ini untuk menyusun seri karya atau cerita visual. Pada layar kecil dan saat prefers-reduced-motion aktif, ketiga poster tersusun vertikal dan tetap terbaca dalam alur halaman.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'horizontal',
    keywords: [
      'horizontal',
      'mendatar',
      'poster',
      'panel',
      'galeri',
      'storytelling',
    ],
    libraries: ['GSAP', 'ScrollTrigger', 'React'],
    tags: ['scroll', 'horizontal', 'pin'],
    aiPrompt:
      'Buat demo React TypeScript yang menampilkan tiga poster dalam urutan vertikal. Gunakan useGSAP dan gsap.matchMedia untuk membuat jalur flex mendatar hanya pada layar lebar dengan tinggi memadai dan prefers-reduced-motion: no-preference. Hubungkan tween linear ke ScrollTrigger dengan pin, scrub, dan invalidateOnRefresh. Hitung jarak tempuh dari scrollWidth jalur dikurangi clientWidth panggung. Refresh setelah font siap dan kembalikan gaya serta pin saat preferensi, ukuran layar, atau rute berubah.',
  },
  {
    slug: 'kinetic-type',
    technicalName: 'Kinetic Typography Reveal',
    indonesianName: 'Judul muncul kata demi kata',
    shortDescription:
      'Mainkan kembali judul tebal yang muncul bertahap dari balik masker.',
    explanation:
      'Setiap kata berada dalam baris yang memotong bagian visual di luar batasnya. GSAP menggerakkan kata dari bawah dengan sedikit rotasi. Stagger memberi jeda antarkata, lalu label timeline menempatkan gerak garis aksen tepat setelah teks mulai muncul.\n\nTeks tampil lengkap saat panggung dimuat. Tombol putar ulang menjalankan timeline dari awal, dan heading memiliki satu nama yang dapat dibaca pembaca layar. Dengan pengurangan gerak aktif, judul tetap lengkap dan tombol animasi disembunyikan.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'typography',
    keywords: [
      'kinetik',
      'tipografi',
      'teks',
      'judul',
      'kata',
      'mask',
      'reveal',
      'stagger',
      'replay',
    ],
    libraries: ['GSAP', 'React'],
    tags: ['typography', 'timeline', 'stagger'],
    aiPrompt:
      'Buat panggung tipografi React TypeScript dengan heading dua baris yang dapat dibaca sebagai satu frasa. Masker setiap baris dengan overflow: clip, lalu buat timeline GSAP terjeda di useGSAP dengan label reveal dan accent. Animasikan tiap kata dari yPercent 120 dan rotasi kecil memakai stagger, lalu animasikan garis aksen dengan scaleX. Biarkan judul utuh saat dimuat. Sediakan tombol native untuk restart dan gunakan gsap.matchMedia agar teks utuh saat gerak dikurangi.',
  },
  {
    slug: 'flip-gallery',
    technicalName: 'FLIP Gallery Layout',
    indonesianName: 'Kartu berpindah dari grid ke daftar',
    shortDescription:
      'Ganti tata letak galeri dan ikuti perpindahan setiap kartu di antara dua susunan.',
    explanation:
      'FLIP adalah singkatan dari First, Last, Invert, Play. Ambil posisi dan ukuran elemen dengan Flip.getState sebelum mengubah layout. Setelah React menerapkan susunan baru, Flip.from memasang transform yang membuat kartu seolah masih berada di posisi lama, lalu menganimasikannya ke posisi baru.\n\nKedua tombol dapat digunakan dengan keyboard dan aria-pressed menandai pilihan aktif. Pengguna yang mengurangi gerak tetap dapat berganti tata letak secara langsung.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'flip',
    keywords: [
      'layout',
      'tata letak',
      'grid',
      'daftar',
      'kartu',
      'galeri',
      'flip',
    ],
    libraries: ['GSAP', 'Flip', 'React'],
    tags: ['flip', 'layout', 'interaction'],
    aiPrompt:
      'Buat galeri React TypeScript berisi tiga kartu dengan pilihan Grid dan Daftar. Sebelum mengubah state layout, simpan posisi dan ukuran kartu memakai Flip.getState. Setelah DOM diperbarui, jalankan Flip.from dengan scale dan easing power3.inOut di useGSAP. Beri tombol aria-pressed, hormati prefers-reduced-motion, dan bersihkan animasi milik galeri ketika preferensi berubah atau komponen unmount.',
  },
  {
    slug: 'motion-path',
    technicalName: 'SVG Motion Path',
    indonesianName: 'Objek menelusuri jalur SVG',
    shortDescription:
      'Geser pengatur progres untuk membawa penanda menyusuri kurva.',
    explanation:
      'MotionPathPlugin mengubah sebuah path SVG menjadi lintasan yang dapat diikuti elemen. Tween yang dijeda bisa diposisikan dengan progress, sehingga pengatur progres menentukan langsung posisi penanda di sepanjang kurva.\n\nInput range dapat digeser dengan sentuhan atau tombol arah. Titik pada lintasan membantu membaca posisi awal, tengah, dan akhir.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'motion-path',
    keywords: [
      'motion path',
      'lintasan',
      'jalur',
      'orbit',
      'kurva',
      'slider',
      'pengatur progres',
    ],
    libraries: ['GSAP', 'MotionPathPlugin', 'React'],
    tags: ['svg', 'motion-path', 'interaction'],
    aiPrompt:
      'Buat demo React TypeScript yang menampilkan jalur SVG melengkung dan sebuah penanda. Gunakan useGSAP dan MotionPathPlugin untuk menyelaraskan penanda dengan path dan buat tween terjeda. Hubungkan input range berlabel Progres lintasan ke tween.progress agar penanda bergerak ketika pengguna memakai mouse, sentuhan atau tombol arah. Tampilkan seluruh jalur dan penanda dari awal, serta bersihkan tween ketika komponen dilepas.',
  },
  {
    slug: 'magnetic-button',
    technicalName: 'Magnetic Button',
    indonesianName: 'Tombol mengikuti arah penunjuk',
    shortDescription:
      'Dekati tombol dengan kursor untuk melihat efek tarikan magnet.',
    explanation:
      'Area interaksi tetap berada di tempatnya sementara permukaan tombol bergeser mengikuti posisi penunjuk. GSAP quickTo memperbarui tujuan transform tanpa membuat tween baru pada setiap peristiwa pointermove. Permukaan kembali ke pusat ketika penunjuk keluar atau saat tombol dikunci.\n\nTombol asli tetap bisa ditekan dengan sentuhan dan keyboard. Pengaturan pengurangan gerak mematikan tarikan penunjuk, sementara tombol tetap bisa digunakan.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'cursor',
    keywords: [
      'magnet',
      'magnetik',
      'tombol',
      'cursor',
      'kursor',
      'pointer',
      'hover',
      'quickto',
    ],
    libraries: ['GSAP', 'React'],
    tags: ['pointer', 'interaction', 'transform'],
    aiPrompt:
      'Buat tombol magnetik React TypeScript dengan area interaksi yang tetap dan permukaan visual yang dapat diterjemahkan. Gunakan useGSAP dan gsap.quickTo untuk memperbarui x dan y dari posisi penunjuk. Batasi jarak gerak dan kembalikan ke pusat saat penunjuk keluar. Aktifkan efek hanya untuk fine pointer dan preferensi gerak normal. Jaga tombol asli beserta aria-pressed agar berfungsi dengan sentuhan dan keyboard, lalu bersihkan semua listener saat unmount.',
  },
  {
    slug: 'stagger-grid',
    technicalName: 'Staggered Grid Reveal',
    indonesianName: 'Petak tampil bergiliran',
    shortDescription:
      'Putar ulang pengungkapan enam petak dengan jeda berurutan.',
    explanation:
      'Stagger memberi jeda antarelemen yang berbagi satu tween. Perubahan posisi, skala, dan opacity setiap petak dimulai bergiliran sehingga pengguna dapat mengikuti arah kemunculannya.\n\nSusunan lengkap langsung terlihat saat demo dimuat. Tombol putar ulang menjalankan gerak sesuai permintaan. Saat pengurangan gerak aktif, semua petak tetap tampil.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'stagger',
    keywords: [
      'stagger',
      'petak',
      'berurutan',
      'bergiliran',
      'grid reveal',
      'jeda',
    ],
    libraries: ['GSAP', 'React'],
    tags: ['stagger', 'reveal', 'grid'],
    aiPrompt:
      'Buat panggung React TypeScript berisi enam petak geometris yang sudah terlihat saat dimuat. Gunakan useGSAP dan tween terjeda dengan stagger untuk memunculkan petak secara berurutan lewat transform dan opacity. Sediakan tombol Putar ulang yang dapat diakses keyboard. Hormati prefers-reduced-motion dan pulihkan keadaan statis ketika pengaturan berubah atau komponen dilepas.',
  },
];
export async function seed(prisma: PrismaClient) {
  await prisma.$transaction(
    async (tx) => {
      for (const [slug, name] of categories)
        await tx.animationCategory.upsert({
          where: { slug },
          create: { id: slug, slug, name },
          update: { name },
        });
      for (const record of records) {
        const { category, tags, ...content } = record;
        const data = {
          ...content,
          demoId: content.slug,
          codeExampleId: content.slug,
          published: true,
          categoryId: category,
        };
        const animation = await tx.animation.upsert({
          where: { slug: content.slug },
          create: data,
          update: data,
        });
        await tx.animationTagRelation.deleteMany({
          where: { animationId: animation.id },
        });
        for (const name of tags) {
          const tag = await tx.animationTag.upsert({
            where: { name },
            create: { name },
            update: {},
          });
          await tx.animationTagRelation.create({
            data: { animationId: animation.id, tagId: tag.id },
          });
        }
      }
    },
    { maxWait: 15000, timeout: 60000 },
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  loadLocalEnvironment();
  const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('Database URL required');
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });
  try {
    await seed(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
