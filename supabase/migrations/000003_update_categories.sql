-- Update categories to new topic structure
-- Old: Mindset, Karir & Tujuan, Relasi, Keuangan, Identitas
-- New: Mindset, Karier, Kehidupan, Uang, Bisnis, Teknologi

-- Add updated_at column to categories (trigger exists but column doesn't)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update existing categories
UPDATE categories SET title = 'Karier', slug = 'karier', color = '#4080D9', description = 'Bukan ikut arus, tapi cari arah.' WHERE slug = 'karir-tujuan';
UPDATE categories SET title = 'Kehidupan', slug = 'kehidupan', color = '#40B880', description = 'Hal-hal yang tidak diajarkan sekolah.' WHERE slug = 'relasi';
UPDATE categories SET title = 'Uang', slug = 'uang', color = '#D9A040', description = 'Kelola, tumbuhkan, pahami.' WHERE slug = 'keuangan';
UPDATE categories SET title = 'Bisnis', slug = 'bisnis', color = '#A040D9', description = 'Bangun dari nol, bukan dari mimpi.' WHERE slug = 'identitas';
UPDATE categories SET title = 'Mindset', slug = 'mindset', color = '#D13A3A', description = 'Cara pikir yang menentukan cara hidup.' WHERE slug = 'mindset';

-- Insert new Teknologi category
INSERT INTO categories (title, slug, color, description)
SELECT 'Teknologi', 'teknologi', '#6040D9', 'Tools, bukan hype.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'teknologi');
