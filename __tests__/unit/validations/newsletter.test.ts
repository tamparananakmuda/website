import { describe, it, expect } from 'vitest';
import { newsletterSchema } from '@/lib/validations/newsletter';

describe('newsletterSchema', () => {
  it('accepts valid email', () => {
    const result = newsletterSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('trims and lowercases email', () => {
    const result = newsletterSchema.safeParse({ email: '  USER@Example.COM  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });

  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'notanemail' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: 'user@' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: '@example.com' }).success).toBe(false);
  });

  it('rejects email over 255 chars', () => {
    const result = newsletterSchema.safeParse({
      email: 'a'.repeat(250) + '@x.com',
    });
    expect(result.success).toBe(false);
  });

  it('defaults topics to empty array', () => {
    const result = newsletterSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topics).toEqual([]);
    }
  });

  it('accepts valid topics', () => {
    const result = newsletterSchema.safeParse({
      email: 'user@example.com',
      topics: ['uang', 'karier', 'mindset'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topics).toEqual(['uang', 'karier', 'mindset']);
    }
  });

  it('rejects more than 10 topics', () => {
    const result = newsletterSchema.safeParse({
      email: 'user@example.com',
      topics: Array(11).fill('topic'),
    });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 10 topics', () => {
    const result = newsletterSchema.safeParse({
      email: 'user@example.com',
      topics: Array(10).fill('topic'),
    });
    expect(result.success).toBe(true);
  });

  it('lowercases and trims topics', () => {
    const result = newsletterSchema.safeParse({
      email: 'user@example.com',
      topics: ['  UANG  ', 'Karier'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topics).toEqual(['uang', 'karier']);
    }
  });
});
