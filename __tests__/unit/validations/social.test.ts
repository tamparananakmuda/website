import { describe, it, expect } from 'vitest';
import { socialImportSchema, socialPostUpdateSchema } from '@/lib/validations/social';

describe('socialImportSchema', () => {
  it('accepts X/Twitter URL', () => {
    expect(socialImportSchema.safeParse({ url: 'https://x.com/user/status/123' }).success).toBe(true);
    expect(socialImportSchema.safeParse({ url: 'https://twitter.com/user/status/123' }).success).toBe(true);
  });

  it('accepts Instagram URL', () => {
    expect(socialImportSchema.safeParse({ url: 'https://instagram.com/p/abc123' }).success).toBe(true);
  });

  it('accepts TikTok URL', () => {
    expect(socialImportSchema.safeParse({ url: 'https://tiktok.com/@user/video/123' }).success).toBe(true);
  });

  it('accepts YouTube URL', () => {
    expect(socialImportSchema.safeParse({ url: 'https://youtube.com/watch?v=abc' }).success).toBe(true);
    expect(socialImportSchema.safeParse({ url: 'https://youtu.be/abc' }).success).toBe(true);
  });

  it('rejects non-social URL', () => {
    expect(socialImportSchema.safeParse({ url: 'https://example.com' }).success).toBe(false);
    expect(socialImportSchema.safeParse({ url: 'https://google.com' }).success).toBe(false);
  });

  it('rejects invalid URL', () => {
    expect(socialImportSchema.safeParse({ url: 'not a url' }).success).toBe(false);
    expect(socialImportSchema.safeParse({ url: '' }).success).toBe(false);
  });
});

describe('socialPostUpdateSchema', () => {
  it('accepts valid update with id only', () => {
    const result = socialPostUpdateSchema.safeParse({ id: 1 });
    expect(result.success).toBe(true);
  });

  it('rejects missing id', () => {
    expect(socialPostUpdateSchema.safeParse({ title: 'test' }).success).toBe(false);
  });

  it('rejects negative id', () => {
    expect(socialPostUpdateSchema.safeParse({ id: -1 }).success).toBe(false);
  });

  it('accepts valid status values', () => {
    for (const status of ['draft', 'published', 'archived']) {
      expect(socialPostUpdateSchema.safeParse({ id: 1, status }).success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    expect(socialPostUpdateSchema.safeParse({ id: 1, status: 'deleted' }).success).toBe(false);
  });

  it('rejects title over 200 chars', () => {
    expect(socialPostUpdateSchema.safeParse({ id: 1, title: 'a'.repeat(201) }).success).toBe(false);
  });

  it('rejects excerpt over 500 chars', () => {
    expect(socialPostUpdateSchema.safeParse({ id: 1, excerpt: 'a'.repeat(501) }).success).toBe(false);
  });

  it('rejects more than 10 tags', () => {
    expect(socialPostUpdateSchema.safeParse({ id: 1, tags: Array(11).fill('tag') }).success).toBe(false);
  });
});
