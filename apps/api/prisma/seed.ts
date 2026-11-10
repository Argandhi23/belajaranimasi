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
  ['svg-morph', 'SVG morph'],
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
      'Buat komponen React TypeScript yang menjelaskan pin dan scrub GSAP ScrollTrigger. Buat kotak 100 � 100 px pada panggung setinggi 85svh, minimal 360 px. Gunakan useGSAP dengan scoped ref dan timeline ease none berlabel translate, rotate, scale, masing-masing durasi 1: geser X ke min(240 px, 25% lebar panggung), putar ke 180 derajat, lalu skala ke 1.5 sambil X kembali ke 0. ScrollTrigger mulai top top, berakhir setelah 2 � tinggi viewport, pin true, pinSpacing true, scrub true, invalidateOnRefresh true. Refresh setelah font siap. Bersihkan saat unmount dan gunakan gsap.matchMedia untuk prefers-reduced-motion. Mode tanpa gerak harus memakai alur dokumen biasa. Jangan menjalankan kode dari input pengguna.',
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
      'Buat demo React Three Fiber TypeScript berupa kubus yang berputar mengikuti progres scroll. Gunakan boxGeometry 1.7 � 1.7 � 1.7, rotasi awal [0.35, 0.5, 0], kamera tetap [0, 0, 5] dengan fov 45, ambientLight 1.5 dan directionalLight 3. Track 240svh dan panggung sticky 85svh, minimal 400 px. GSAP mengubah rotation.x ke Math.PI � 1.3 dan rotation.y ke Math.PI � 2.25 dengan ease none; ScrollTrigger start top top, end bottom bottom, scrub true. Lazy-load scene, gunakan demand rendering dan DPR maksimal 1.5, serta satu pemilik rotasi. Invalidate hanya saat scroll mengubah rotasi dan canvas terlihat di tab aktif; hentikan observer dan listener saat unmount. Sediakan fallback jika WebGL tidak tersedia atau konteks hilang, reduced motion statis, dan cleanup resource serta listener saat unmount.',
  },
];
export async function seed(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
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
  });
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
