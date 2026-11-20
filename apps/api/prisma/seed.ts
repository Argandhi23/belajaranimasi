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
      'Tahan panggung produk optik di layar sambil tiga fase cerita dan modul lensa mengikuti progres scroll.',
    explanation:
      'Pin menahan panggung produk pada area pandang selama rentang scroll tertentu, sementara scrub mengikat kemajuan timeline langsung ke posisi gulir sehingga pengguna dapat memajukan atau memundurkan setiap tahap.\n\nPada contoh bagian peluncuran lensa Seri Monolit M1 ini, bilah progres vertikal dan tiga babak penjelasan (Kalibrasi sasis presisi, Rotasi cincin apertur, dan Fokus makro penuh) disinkronkan dengan gerak modul optik monokrom di sisi kanan.\n\nTimeline memakai label translate, rotate, dan scale: modul optik bergeser horizontal, berputar 180 derajat bersama cincin kalibrasinya, lalu kembali ke pusat sambil membesar. Semua ScrollTrigger dan gaya pin dikembalikan saat komponen dilepas, dan preferensi reduced motion menampilkan seluruh babak secara statis dalam alur dokumen biasa.',
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
      'Buat section showcase produk optik monokrom hitam-putih dengan React TypeScript dan GSAP ScrollTrigger pin & scrub. Susun panggung split setinggi minimal 85svh (dengan jarak atas var(--demo-sticky-top, 0px)): kolom kiri berisi bilah progres vertikal dan tiga babak spesifikasi produk, kolom kanan berisi bingkai gelap dengan modul lensa presisi SVG. Gunakan useGSAP dengan scoped ref dan timeline ease none berlabel translate, rotate, dan scale masing-masing durasi 1: geser X hingga min(110 px, 10% lebar panggung), putar 180 derajat, lalu kembali ke X 0 sambil skala 1.32 sembari menyorot babak aktif dan mengisi bilah progres. Pasang ScrollTrigger start top top, end += 2 kali tinggi viewport, pin true, pinSpacing true, scrub true, invalidateOnRefresh true. Refresh setelah font siap, bersihkan saat unmount, dan gunakan gsap.matchMedia untuk prefers-reduced-motion agar seluruh babak tampil statis dalam alur dokumen biasa. Jangan menjalankan kode dari input pengguna.',
  },
  {
    slug: 'depth-parallax',
    technicalName: 'Depth Parallax',
    indonesianName: 'Lapisan bergerak beda kecepatan',
    shortDescription:
      'Ciptakan kedalaman ruang arsitektural lewat tiga bidang monokrom yang melintas dengan kecepatan berbeda.',
    explanation:
      'Parallax memanfaatkan perbedaan kecepatan gerak antara bidang dekat dan jauh saat halaman digulir untuk menghadirkan kesan kedalaman tanpa model tiga dimensi.\n\nBagian monograf arsitektur monokrom terang ini menata tiga bidang editorial pada satu rentang scroll: pelat tipografi latar belakang bergerak paling lambat (+50 ke -50 px), kartu studi paviliun beton di tengah bergerak sedang (+130 ke -130 px), dan kutipan kurator hitam di depan melintas paling cepat (+240 ke -240 px).\n\nSeluruh gerakan hanya mengubah transform translateY dengan satu pemilik animasi per lapisan. Saat preferensi reduced motion aktif, seluruh bidang tampil diam dan terbaca utuh tanpa saling menutupi.',
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
      'Buat section monograf arsitektur monokrom hitam-putih di React TypeScript dengan efek depth parallax tiga lapis. Gunakan permukaan kertas terang (#fafafa/#f4f4f5) dengan panggung setinggi 110svh minimal 620 px berisi tiga bidang: pelat tipografi arsitektural di latar belakang (data-depth 50), kartu ilustrasi paviliun beton di tengah (data-depth 130), dan kartu kutipan kurator berwarna hitam pekat di depan (data-depth 240). Gunakan useGSAP dan tween fromTo translateY dari +depth ke -depth dengan ease none, ScrollTrigger start top bottom, end bottom top, scrub true, invalidateOnRefresh true pada panggung yang sama. Refresh setelah font siap, bersihkan konteks saat unmount, dan jaga seluruh lapisan tetap diam serta terbaca pada prefers-reduced-motion.',
  },
  {
    slug: 'scroll-cube',
    technicalName: 'Scroll-controlled 3D Rotation',
    indonesianName: 'Kubus berputar mengikuti scroll',
    shortDescription:
      'Putar modul audio Kubik-01 tiga dimensi mengikuti scroll di panggung sticky dengan fallback statis.',
    explanation:
      'Rotasi tiga dimensi yang terikat pada scroll memungkinkan pengunjung memeriksa siluet produk dari berbagai sisi tanpa kontrol kamera yang rumit.\n\nBagian peluncuran perangkat audio monokrom Kubik-01 ini merender sasis kubus multi-bagian menggunakan React Three Fiber di dalam panggung sticky. Scene dimuat secara lazy, membatasi pixel ratio hingga 1.5, memakai frameloop demand, serta hanya memanggil invalidate saat scroll mengubah sudut rotasi ketika canvas terlihat pada tab aktif.\n\nKarena WebGL dapat tidak tersedia atau kehilangan konteks, komponen menyediakan ilustrasi isometrik SVG statis lengkap dengan ErrorBoundary dan pendengar webglcontextlost. Preferensi reduced motion menonaktifkan sticky dan rotasi sehingga panggung kembali ke alur dokumen biasa.',
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
      'Buat section showcase perangkat audio monokrom Kubik-01 dengan React Three Fiber, Three.js, dan GSAP ScrollTrigger. Bangun grup 3D monokrom dari blok aluminium satin (1.56), pita kisi akustik gelap menyilang, dan bingkai wireframe luar dengan rotasi awal [0.35, 0.5, 0], kamera [0, 0, 5] fov 45, dan pencahayaan netral putih-abu. Letakkan dalam track 240svh dan panggung sticky setinggi min(85svh, calc(100svh - var(--demo-sticky-top, 0px))) dengan bilah progres tampak depan ke belakang. Animasikan rotation.x ke Math.PI * 1.3 dan rotation.y ke Math.PI * 2.25 memakai ease none, start top top, end bottom bottom, scrub true. Gunakan frameloop demand, DPR maksimal 1.5, IntersectionObserver, visibilitychange, ErrorBoundary, penanganan webglcontextlost, serta ilustrasi SVG isometrik untuk WebGL tidak tersedia dan prefers-reduced-motion.',
  },
  {
    slug: 'svg-draw',
    technicalName: 'Scroll-linked SVG Stroke Draw',
    indonesianName: 'Garis SVG menggambar saat halaman digulir',
    shortDescription:
      'Gambar jalur proses studio empat fase secara bertahap mengikuti progres scroll pada kertas cetak biru.',
    explanation:
      'Teknik SVG draw memanfaatkan stroke-dasharray dan stroke-dashoffset untuk menyembunyikan lalu menyingkap garis vektor secara mulus. Ketika nilai dash disamakan dengan panjang total kurva dari getTotalLength(), menggerakkan offset menuju nol membuat garis tampak digambar secara langsung.\n\nBagian proses kerja studio monokrom terang ini memadukan kurva cetak biru empat fase (Penemuan, Arsitektur, Produksi, Peluncuran) dengan kartu ringkasan di bawahnya. Progres menggambar terikat pada GSAP ScrollTrigger melalui scrub sehingga mengikuti ritme membaca pengguna.\n\nSaat preferensi reduced motion aktif, animasi dashoffset dimatikan dan jalur vektor langsung tampil utuh sejak awal tanpa perlu digulir.',
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
      'Buat section proses kerja studio monokrom hitam-putih berlatar terang di React TypeScript dengan animasi SVG stroke draw berbasis scroll. Tampilkan diagram cetak biru SVG (viewBox 0 0 760 290) berisi jalur petunjuk putus-putus, kurva utama hitam tebal yang menghubungkan empat titik fase (Penemuan, Arsitektur, Produksi, Peluncuran), serta empat kartu rincian di bawahnya. Gunakan useGSAP dengan scoped ref, hitung panjang kurva via getTotalLength(), lalu animasikan strokeDasharray dan strokeDashoffset dari panjang penuh ke 0 dengan ease none pada ScrollTrigger start top 55%, end bottom 35%, scrub true, invalidateOnRefresh true. Refresh setelah font siap, bersihkan saat unmount, dan gunakan gsap.matchMedia agar jalur langsung tampil utuh saat prefers-reduced-motion aktif.',
  },
  {
    slug: 'svg-morph',
    technicalName: 'Scroll-linked SVG Shape Morph',
    indonesianName: 'Bentuk SVG berubah mengikuti scroll',
    shortDescription:
      'Ubah lambang merek dari lingkaran tenang menjadi kompas empat arah secara mulus mengikuti scroll.',
    explanation:
      'Teknik SVG morphing mengubah satu bentuk vektor menjadi bentuk lain dengan menginterpolasi atribut d pada elemen path. Ketika bentuk awal dan akhir memiliki urutan perintah kurva kubik Bézier (M, empat segmen C, Z) yang sepadan, setiap titik kontrol bergeser presisi tanpa patah.\n\nBagian pembaruan identitas merek monokrom ini menampilkan dua kartu spesimen (Edisi Arsip dan Edisi Kompas) berdampingan dengan bingkai lambang utama yang bermetamorfosis seiring guliran lewat GSAP ScrollTrigger.\n\nSaat preferensi reduced motion aktif, interpolasi dimatikan sehingga kedua kartu spesimen dan lambang dasar tetap jelas dibandingkan secara statis.',
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
      'Buat section evolusi lambang merek monokrom hitam-putih di React TypeScript dengan SVG morphing berbasis scroll. Susun tata letak dua kolom pada panggung gelap minimal 92svh: kolom kiri berisi dua kartu spesimen lambang (Edisi Arsip berbentuk lingkaran dan Edisi Kompas berbentuk bintang empat arah), kolom kanan berisi bingkai galeri SVG viewBox 0 0 360 360 dengan panduan garis tipis dan path utama yang dianimasikan. Gunakan dua path berstruktur identik (M diikuti empat segmen kubik Bézier C dan Z), lalu animasikan attr.d lewat useGSAP dan ScrollTrigger start top 55%, end bottom 35%, scrub true, ease none, invalidateOnRefresh true. Refresh setelah font siap, bersihkan saat unmount, dan hormati prefers-reduced-motion.',
  },
  {
    slug: 'horizontal-story',
    technicalName: 'Horizontal Scroll Gallery',
    indonesianName: 'Galeri mendatar mengikuti gulir vertikal',
    shortDescription:
      'Susuri tiga babak pameran arsitektur monokrom yang bergeser mendatar saat halaman digulir.',
    explanation:
      'ScrollTrigger menahan panggung pameran dengan pin, lalu menghubungkan pergeseran horizontal jalur slide dengan gulir vertikal melalui scrub linear. Jarak tempuh dihitung dari selisih lebar total jalur terhadap lebar panggung sehingga slide terakhir berhenti tepat sejajar tepi layar.\n\nBagian katalog pameran monokrom ini memadukan tiga babak kontras — Monolit Beton (gelap), Garis Cahaya (kertas terang), dan Skala Sunyi (arang) — lengkap dengan ilustrasi arsitektural SVG dan indikator progres. Pada layar sempit maupun saat prefers-reduced-motion aktif, ketiga babak otomatis tersusun vertikal dalam alur baca normal.',
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
      'Buat section galeri pameran arsitektur monokrom hitam-putih di React TypeScript dengan tiga babak penuh (gelap, terang, arang) berisi ilustrasi SVG arsitektural, judul editorial, dan indikator progres. Gunakan useGSAP dan gsap.matchMedia agar jalur flex mendatar dan ScrollTrigger pin/scrub linear hanya aktif pada (min-width: 900px) and (min-height: 550px) and (prefers-reduced-motion: no-preference). Hitung jarak geser dari scrollWidth jalur dikurangi clientWidth panggung, beri jarak atas var(--demo-sticky-top, 0px), aktifkan invalidateOnRefresh, refresh setelah font siap, dan kembalikan ke susunan vertikal pada mobile atau reduced motion.',
  },
  {
    slug: 'kinetic-type',
    technicalName: 'Kinetic Typography Reveal',
    indonesianName: 'Judul muncul kata demi kata',
    shortDescription:
      'Tampilkan judul editorial monograf kata demi kata dari balik masker baris dengan garis pemisah sinkron.',
    explanation:
      'Setiap baris judul dibungkus penampung overflow: clip sehingga tiap kata muncul bersih dari bawah disertai sedikit rotasi tanpa menggeser tata letak di sekitarnya. Stagger memberi ritme antarkata, sementara label timeline menyusul dengan animasi scaleX pada garis pemisah dan kemunculan teks pengantar.\n\nBagian tajuk monograf tipografi berlatar kertas terang ini langsung terbaca utuh saat dimuat dan menyediakan tombol Putar ulang untuk memicu koreografi dari awal. Saat prefers-reduced-motion aktif, seluruh judul tampil utuh dan tombol putar ulang disembunyikan.',
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
      'Buat section tajuk editorial monograf tipografi monokrom berlatar terang (#fafafa, tinta #09090b) di React TypeScript. Tampilkan heading dua baris dengan satu nama aksesibel utuh (Huruf ikut bergerak) di mana tiap baris dimasker overflow: clip. Gunakan useGSAP dan timeline terjeda berlabel reveal dan accent untuk menganimasikan kata dari yPercent 120 dan rotate 7 dengan stagger 0.11, diikuti garis pemisah scaleX 0 ke 1 serta paragraf pengantar. Pastikan judul utuh saat muat awal, sediakan tombol native Putar ulang yang disembunyikan pada prefers-reduced-motion, dan bersihkan konteks saat unmount.',
  },
  {
    slug: 'flip-gallery',
    technicalName: 'FLIP Gallery Layout',
    indonesianName: 'Kartu berpindah dari grid ke daftar',
    shortDescription:
      'Ganti tampilan arsip karya studio antara grid dan daftar dengan transisi posisi dan ukuran yang halus.',
    explanation:
      'FLIP (First, Last, Invert, Play) merekam posisi dan ukuran setiap kartu memakai Flip.getState sebelum React mengganti susunan CSS Grid. Setelah DOM diperbarui, Flip.from membalik transform sementara lalu menganimasikan setiap kartu dan sampul ilustrasinya ke posisi baru secara mulus.\n\nBagian arsip karya monokrom ini menampilkan tiga proyek studio (Paviliun Senja, Monograf Aksara, dan Jam Meja M-04) dengan tombol pengalih Grid dan Daftar berstatus aria-pressed. Saat prefers-reduced-motion aktif, perubahan tata letak tetap bekerja seketika tanpa animasi perpindahan.',
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
      'Buat section arsip karya studio monokrom berlatar terang (#fafafa) di React TypeScript berisi tiga kartu proyek dengan sampul SVG monokrom dan tombol pengalih Grid serta Daftar (aria-pressed). Simpan posisi kartu dan wadah sampul memakai Flip.getState sebelum mengubah state tata letak, lalu jalankan Flip.from (duration 0.55, ease power3.inOut, scale true, nested true) di useGSAP. Pastikan cincin fokus kontras gelap pada permukaan terang, hormati prefers-reduced-motion dengan perpindahan langsung, dan panggil Flip.killFlipsOf saat cleanup.',
  },
  {
    slug: 'motion-path',
    technicalName: 'SVG Motion Path',
    indonesianName: 'Objek menelusuri jalur SVG',
    shortDescription:
      'Geser pengatur progres untuk melacak pergerakan armada menyusuri rute koridor laut.',
    explanation:
      'MotionPathPlugin mengubah kurva SVG menjadi lintasan terukur yang dapat diikuti elemen sambil memutar arahnya otomatis mengikuti garis singgung kurva (autoRotate). Karena tween disimpan dalam kondisi terjeda, nilai progres dari slider atau tombol transit langsung memposisikan penanda di titik yang tepat.\n\nBagian pemantau koridor pelayaran monokrom ini menghubungkan tiga pelabuhan utama (JKT, SMG, SBY) dengan garis rute aktif, indikator jarak kilometer, tombol lompat cepat, dan input range Progres lintasan yang ramah keyboard serta bekerja langsung pada mode reduced motion.',
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
      'Buat section peta pelacakan rute maritim monokrom hitam-putih di React TypeScript menggunakan GSAP MotionPathPlugin. Gambar peta kartografi SVG gelap (viewBox 0 0 760 300) dengan kurva rute melalui tiga titik transit (JKT, SMG, SBY), garis progres putih tersinkron, dan penanda arah SVG dengan autoRotate true pada tween terjeda. Hubungkan input range berlabel Progres lintasan (0—100) serta tombol lompat titik ke tween.progress() secara langsung agar dapat dioperasikan dengan mouse, sentuhan, keyboard, dan tetap mulus pada prefers-reduced-motion. Bersihkan tween saat unmount.',
  },
  {
    slug: 'magnetic-button',
    technicalName: 'Magnetic Button',
    indonesianName: 'Tombol mengikuti arah penunjuk',
    shortDescription:
      'Dekati tombol ajakan kolaborasi studio dengan kursor untuk merasakan tarikan magnet halus.',
    explanation:
      'Area interaksi (hitbox) tombol tetap diam di tempatnya agar target klik tidak kabur, sementara permukaan tombol di dalamnya bergeser halus mengikuti posisi kursor dengan batas jarak melingkar. GSAP quickTo memperbarui tujuan x dan y secara efisien tanpa membuat tween baru di setiap pointermove.\n\nBagian banner ajakan kolaborasi studio monokrom ini menempatkan tombol Mulai diskusi proyek sebagai titik fokus utama. Menekan tombol mengunci pilihan konsultasi (aria-pressed) dan mengembalikan permukaan ke pusat. Efek magnet hanya aktif untuk fine pointer dengan gerak normal, sedangkan pengguna sentuh, keyboard, dan reduced motion tetap dapat menekan tombol sepenuhnya.',
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
      'Buat section ajakan kolaborasi studio monokrom gelap di React TypeScript dengan tombol CTA magnetik (Mulai diskusi proyek). Pisahkan hitbox tombol native yang diam (padding 22 px) dari permukaan visual di dalamnya yang digerakkan gsap.quickTo (duration 0.34, ease power3.out) dengan batas radius 22 px dan kembali ke (0, 0) saat pointerleave atau pointercancel. Batasi efek dengan gsap.matchMedia untuk (prefers-reduced-motion: no-preference) and (any-pointer: fine) and (any-hover: hover). Dukung aria-pressed untuk mengunci tombol ke pusat serta bersihkan seluruh event listener saat unmount.',
  },
  {
    slug: 'stagger-grid',
    technicalName: 'Staggered Grid Reveal',
    indonesianName: 'Petak tampil bergiliran',
    shortDescription:
      'Putar ulang kemunculan enam kartu kapabilitas platform monokrom dengan jeda bergiliran.',
    explanation:
      'Stagger membagi jeda mulai antarkartu dalam satu tween sehingga seluruh grid muncul membentuk gelombang visual yang terarah tanpa perlu menulis animasi terpisah per elemen.\n\nBagian kapabilitas platform monokrom berlatar terang ini menampilkan enam kartu kontras putih dan hitam pekat lengkap dengan ikon garis minimalis dan metrik ringkas. Seluruh kartu langsung terlihat saat halaman dimuat, sementara tombol Putar ulang menjalankan stagger grid [2, 3] memakai transform dan opacity. Pada reduced motion, kartu tetap tampil penuh dan tombol putar ulang dinonaktifkan.',
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
      'Buat section kapabilitas platform monokrom hitam-putih berlatar terang di React TypeScript berisi enam kartu fitur bergantian putih dan hitam pekat dengan ikon SVG minimalis serta metrik ringkas. Biarkan seluruh kartu langsung terlihat saat dimuat. Gunakan useGSAP dan timeline terjeda dengan stagger grid [2, 3] (from start, amount 0.44) pada yPercent, scale, dan opacity yang dipicu tombol Putar ulang aksesibel keyboard. Hormati prefers-reduced-motion dengan menonaktifkan tombol dan memulihkan tampilan statis saat preferensi berubah atau unmount.',
  },
  {
    slug: 'three-torus-orbit',
    technicalName: 'Interactive 3D Torus Knot',
    indonesianName: 'Simpul torus 3D dengan kontrol sudut',
    shortDescription:
      'Tinjau patung aluminium Simpul N-02 tiga dimensi lewat preset sudut pandang, mode rangka, dan slider.',
    explanation:
      'Memadukan R3F dengan GSAP memungkinkan orientasi dan skala objek 3D berinterpolasi halus ketika pengunjung memilih preset sudut pandang atau menggeser pengatur rotasi. Mode frameloop demand memastikan GPU hanya menggambar ulang saat onUpdate memanggil invalidate atau material berubah.\n\nBagian ruang pamer objek monokrom Simpul N-02 ini memisahkan panggung 3D dari panel spesifikasi dan kontrol (Isometrik, Horisontal, Putaran Penuh, Mode rangka, dan Sudut rotasi). Saat prefers-reduced-motion aktif atau WebGL tidak tersedia, pratinjau vektor SVG otomatis tampil dan tetap merespons slider serta mode rangka.',
    difficulty: 'INTERMEDIATE' as const,
    category: '3d',
    keywords: [
      'torus',
      'simpul',
      '3d',
      'webgl',
      'rotasi',
      'wireframe',
      'rangka',
      'slider',
      'interaktif',
    ],
    libraries: ['R3F', 'Three.js', 'GSAP', 'React'],
    tags: ['3d', 'webgl', 'interaction'],
    aiPrompt:
      'Buat section ruang pamer objek koleksi monokrom (Simpul N-02) dengan tata letak dua kolom di React TypeScript menggunakan torusKnotGeometry pada Canvas R3F ber-frameloop demand dan DPR maksimal 1.5. Sediakan panel spesifikasi material beserta tombol preset sudut pandang (Isometrik, Horisontal, Putaran Penuh), toggle Mode rangka (aria-pressed), dan slider Sudut rotasi (0—100) yang menginterpolasi mesh.rotation dan mesh.scale memakai GSAP dengan invalidate() pada onUpdate. Sertakan ErrorBoundary, listener webglcontextlost, dan fallback SVG monokrom untuk prefers-reduced-motion atau WebGL tidak tersedia.',
  },
  {
    slug: 'text-scramble',
    technicalName: 'Scramble Text Decode',
    indonesianName: 'Teks teracak lalu terurai rapi',
    shortDescription:
      'Ganti prinsip manifesto studio sambil karakter acak terurai rapi menjadi judul akhir.',
    explanation:
      'ScrambleTextPlugin mengacak sementara karakter judul sebelum menyingkap kalimat tujuan huruf demi huruf. Menyinkronkannya dengan bilah progres halus dalam satu timeline GSAP memberi ritme transisi yang terukur saat pengunjung berpindah antarprinsip.\n\nBagian manifesto studio monokrom gelap ini langsung menampilkan teks penuh saat dibuka, menyediakan tiga pilihan prinsip dan tombol Putar ulang, serta langsung memperbarui kalimat tanpa efek acak ketika preferensi reduced motion aktif.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'typography',
    keywords: [
      'scramble',
      'decode',
      'teks',
      'huruf',
      'karakter',
      'acak',
      'frasa',
      'tipografi',
      'glitch',
    ],
    libraries: ['GSAP', 'ScrambleTextPlugin', 'React'],
    tags: ['typography', 'scramble', 'interaction'],
    aiPrompt:
      'Buat section manifesto studio monokrom hitam-putih di React TypeScript menggunakan GSAP ScrambleTextPlugin dan useGSAP. Tampilkan judul pernyataan utama (aria-live polite) yang langsung terbaca saat muat awal, teks penjelasan singkat, bilah progres tipis, tiga tombol pemilih prinsip (Gerak memberi makna, Kode membentuk ritme, Interaksi terasa hidup), dan tombol Putar ulang. Sinkronkan scrambleText dengan scaleX bilah progres dalam satu timeline GSAP. Saat prefers-reduced-motion aktif, nonaktifkan tombol putar ulang dan tampilkan kalimat akhir secara langsung.',
  },
  {
    slug: 'timeline-choreography',
    technicalName: 'Multi-Stage Timeline Sequencer',
    indonesianName: 'Urutan tiga tahap dengan satu timeline',
    shortDescription:
      'Koordinasikan tiga gerbang alur rilis produk secara berurutan lewat satu timeline dan slider progres.',
    explanation:
      'Satu gsap.timeline() dapat menyelaraskan banyak elemen secara terpadu memakai label waktu (tahapSatu, tahapDua, tahapTiga) dan jeda tumpang tindih (-=0.15) sehingga transisi antarfase mengalir tanpa kaku.\n\nBagian alur produksi monokrom berlatar terang ini mengoordinasikan kartu, ikon gerbang, dan bilah progres untuk tiga fase kerja (Perencanaan, Perakitan, Peluncuran). Timeline yang tersimpan di ref terhubung ke tombol Putar ulang dan slider Progres timeline untuk meninjau animasi maju maupun mundur, sambil tetap menghormati preferensi reduced motion.',
    difficulty: 'INTERMEDIATE' as const,
    category: 'timeline',
    keywords: [
      'timeline',
      'urutan',
      'koreografi',
      'sekuens',
      'bertahap',
      'label',
      'slider',
      'progres',
    ],
    libraries: ['GSAP', 'React'],
    tags: ['timeline', 'sequence', 'interaction'],
    aiPrompt:
      'Buat section alur produksi tiga fase monokrom berlatar terang di React TypeScript berisi kartu Perencanaan, Perakitan, dan Peluncuran yang dikendalikan satu gsap.timeline() terjeda berlabel tahapSatu, tahapDua, dan tahapTiga dengan overlap -=0.15. Animasikan kartu, lencana ikon SVG, dan bilah progres di setiap fase, lalu hubungkan ke tombol Putar ulang serta slider berlabel Progres timeline (0—100) memakai timeline.progress(). Hormati prefers-reduced-motion dengan menonaktifkan putar ulang sambil menjaga seluruh fase tetap terbaca, dan bersihkan konteks di useGSAP saat unmount.',
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
