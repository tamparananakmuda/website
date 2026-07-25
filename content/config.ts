export interface CategoryConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  color: string;
}

export interface SubcategoryConfig {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface AuthorConfig {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialLinkedin: string | null;
}

export interface SeriesConfig {
  id: string;
  title: string;
  slug: string;
  description: string | null;
}

export const categories: CategoryConfig[] = [
  { id: '53135a88-ce72-408c-9bc1-9fe32eb82548', title: 'Bisnis', slug: 'bisnis', description: 'Bangun dari nol, bukan dari mimpi.', color: '#A040D9' },
  { id: 'a085b98d-c314-485e-a989-d5fc7078ec04', title: 'Karier', slug: 'karier', description: 'Bukan ikut arus, tapi cari arah.', color: '#4080D9' },
  { id: '3f5fcde6-2a00-418b-88a6-4b485c122067', title: 'Kehidupan', slug: 'kehidupan', description: 'Hal-hal yang tidak diajarkan sekolah.', color: '#40B880' },
  { id: '3a71ab8a-526f-4d19-a434-f54814f233dd', title: 'Mindset', slug: 'mindset', description: 'Cara pikir yang menentukan cara hidup.', color: '#D13A3A' },
  { id: '92366694-94ef-419c-bb1a-cfd502b0d028', title: 'Teknologi', slug: 'teknologi', description: 'Tools, bukan hype.', color: '#6040D9' },
  { id: '62d4cac7-789f-4d35-9cd8-35f25a5bb042', title: 'Uang', slug: 'uang', description: 'Kelola, tumbuhkan, pahami.', color: '#D9A040' },
];

export const subcategories: SubcategoryConfig[] = [
  { id: '032410c0-f83c-46f9-90ba-c8c96eb344da', categoryId: '3a71ab8a-526f-4d19-a434-f54814f233dd', title: 'Mindset & Realita', slug: 'mindset-realita', description: 'Cara pikir yang menentukan cara hidup.', sortOrder: 1 },
  { id: 'ab202ef9-235c-452f-b5ae-7239bedd9d82', categoryId: 'a085b98d-c314-485e-a989-d5fc7078ec04', title: 'Karier & Dunia Kerja', slug: 'karier-dunia-kerja', description: 'Panduan dunia kerja yang tidak diajarkan sekolah.', sortOrder: 1 },
  { id: '468e4682-46cd-4fa1-84a1-d5f7931735e7', categoryId: '62d4cac7-789f-4d35-9cd8-35f25a5bb042', title: 'Keuangan & Uang', slug: 'keuangan-uang', description: 'Budgeting, investasi, cara dapat uang online, freelance, affiliate.', sortOrder: 1 },
  { id: '65335459-4daf-49a8-9a73-c5d12d514f80', categoryId: '53135a88-ce72-408c-9bc1-9fe32eb82548', title: 'Bisnis', slug: 'bisnis', description: 'Realita bisnis, bukan motivasi bisnis.', sortOrder: 1 },
  { id: 'b3392405-8115-4dcd-b2d8-269f0854fd17', categoryId: '92366694-94ef-419c-bb1a-cfd502b0d028', title: 'Teknologi & AI', slug: 'teknologi-ai', description: 'Tools, bukan hype.', sortOrder: 1 },
  { id: '955c31e8-f4a6-44b4-8899-e49a45ce46b2', categoryId: '3f5fcde6-2a00-418b-88a6-4b485c122067', title: 'Hubungan Sosial', slug: 'hubungan-sosial', description: 'Memilih teman, networking, lingkungan, mentor.', sortOrder: 1 },
  { id: '0a7927f0-d7de-4bc1-81b3-5c1792a0f617', categoryId: 'a085b98d-c314-485e-a989-d5fc7078ec04', title: 'Produktivitas', slug: 'produktivitas', description: 'Cara fokus dan kelola waktu yang benar-benar bekerja.', sortOrder: 2 },
  { id: '700d336a-dd65-4b07-8835-74c556aabb17', categoryId: '3a71ab8a-526f-4d19-a434-f54814f233dd', title: 'Psikologi', slug: 'psikologi', description: 'Psikologi kehidupan sehari-hari, bukan kesehatan mental klinis.', sortOrder: 2 },
  { id: '412ab379-263e-459a-b581-a0c65b7428dc', categoryId: '92366694-94ef-419c-bb1a-cfd502b0d028', title: 'Analisis Fenomena', slug: 'analisis-fenomena', description: 'Membongkar tren dan fenomena sosial dengan lensa tajam.', sortOrder: 2 },
  { id: '746db88a-e1c1-41d9-a8dd-5376545eb7f2', categoryId: '3f5fcde6-2a00-418b-88a6-4b485c122067', title: 'Lifestyle', slug: 'lifestyle', description: 'Minimalisme, digital detox, morning routine, traveling produktif.', sortOrder: 2 },
  { id: 'b6c624f5-7a95-4fe4-941b-f1f89372480d', categoryId: '53135a88-ce72-408c-9bc1-9fe32eb82548', title: 'Skill Masa Depan', slug: 'skill-masa-depan', description: 'Skill yang relevan 5-10 tahun ke depan.', sortOrder: 2 },
  { id: 'c6ce0d34-fe6e-4b7c-857e-e933e5b3de56', categoryId: '3f5fcde6-2a00-418b-88a6-4b485c122067', title: 'Sejarah Orang Sukses', slug: 'sejarah-orang-sukses', description: 'Pelajaran dari orang sukses, bukan sekadar biografi.', sortOrder: 3 },
  { id: '34e195d3-be9b-44d7-b331-1caf6c9254c0', categoryId: 'a085b98d-c314-485e-a989-d5fc7078ec04', title: 'Komunikasi', slug: 'komunikasi', description: 'Public speaking, storytelling, negosiasi, presentasi.', sortOrder: 3 },
  { id: '4b207d01-a718-4b87-9034-57521ae41116', categoryId: '3a71ab8a-526f-4d19-a434-f54814f233dd', title: 'Filosofi Hidup', slug: 'filosofi-hidup', description: 'Stoicism, ikigai, essentialism, dan filosofi praktis lainnya.', sortOrder: 3 },
  { id: '632d3697-381d-4355-b372-77fcbe1c3c3a', categoryId: '3a71ab8a-526f-4d19-a434-f54814f233dd', title: 'Tamparan', slug: 'tamparan', description: 'Artikel dengan tone tamparan khas TAM. Ciri khas media.', sortOrder: 4 },
  { id: '0d25dffa-d891-4e56-9081-db777acb9717', categoryId: '3f5fcde6-2a00-418b-88a6-4b485c122067', title: 'Ulasan Buku', slug: 'ulasan-buku', description: 'Review buku yang relevan untuk anak muda.', sortOrder: 4 },
  { id: '1ed83881-d2bc-433f-880b-db74ec8b3171', categoryId: 'a085b98d-c314-485e-a989-d5fc7078ec04', title: 'Pendidikan', slug: 'pendidikan', description: 'Kuliah, jurusan, skill masa depan, belajar mandiri.', sortOrder: 4 },
];

export const authors: AuthorConfig[] = [
  { id: '30268f32-de51-4080-ba1b-20c20fff3c6b', name: 'Yovie Setiawan', slug: 'yovie-setiawan', bio: 'Founder TAMPARAN ANAK MUDA.', avatarUrl: null, socialInstagram: null, socialTwitter: null, socialLinkedin: null },
];

export const series: SeriesConfig[] = [
  { id: '7505a15c-085b-456e-ab31-0aa21793e581', title: 'Mental Health di Era Digital: Sistem yang Menjual Luka, Bukan Obat', slug: 'kesehatan-mental-era-digital', description: 'Setiap kali kamu mencari bantuan untuk mental health, kamu masuk lebih dalam ke dalam sistem yang membuatmu sakit. 12 part investigasi dari gejala sampai arsitek.' },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id);
}

export function getSubcategoryBySlug(slug: string): SubcategoryConfig | undefined {
  return subcategories.find((s) => s.slug === slug);
}

export function getSubcategoryById(id: string): SubcategoryConfig | undefined {
  return subcategories.find((s) => s.id === id);
}

export function getSubcategoriesByCategorySlug(categorySlug: string): SubcategoryConfig[] {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return subcategories
    .filter((s) => s.categoryId === cat.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAuthorBySlug(slug: string): AuthorConfig | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorById(id: string): AuthorConfig | undefined {
  return authors.find((a) => a.id === id);
}

export function getSeriesBySlug(slug: string): SeriesConfig | undefined {
  return series.find((s) => s.slug === slug);
}

export function getSeriesById(id: string): SeriesConfig | undefined {
  return series.find((s) => s.id === id);
}
