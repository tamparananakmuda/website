-- Fix category colors for WCAG AA contrast compliance
-- Darken colors that failed accessibility contrast checks

UPDATE categories SET color = '#7B2DB0' WHERE slug = 'bisnis';
UPDATE categories SET color = '#2563B5' WHERE slug = 'karier';
UPDATE categories SET color = '#1A8050' WHERE slug = 'kehidupan';
UPDATE categories SET color = '#A66E15' WHERE slug = 'uang';
