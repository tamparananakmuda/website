import { describe, it, expect } from 'vitest';
import { donasiSchema, getMinAmount } from '@/lib/validations/donasi';

describe('donasiSchema', () => {
  it('accepts valid donation input', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative amount', () => {
    const result = donasiSchema.safeParse({
      amount: -1000,
      payment_type: 'qris',
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero amount', () => {
    const result = donasiSchema.safeParse({
      amount: 0,
      payment_type: 'qris',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid payment type', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'gopay',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid payment types', () => {
    const types = ['qris', 'bni_va', 'bri_va', 'permata_va', 'cimb_niaga_va'];
    for (const type of types) {
      const result = donasiSchema.safeParse({
        amount: 10000,
        payment_type: type,
      });
      expect(result.success).toBe(true);
    }
  });

  it('trims and lowercases email', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
      customer_email: '  TEST@Example.COM  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customer_email).toBe('test@example.com');
    }
  });

  it('rejects email over 255 chars', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
      customer_email: 'a'.repeat(250) + '@x.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects message over 280 chars', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
      message: 'a'.repeat(281),
    });
    expect(result.success).toBe(false);
  });

  it('accepts message of exactly 280 chars', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
      message: 'a'.repeat(280),
    });
    expect(result.success).toBe(true);
  });

  it('defaults is_anonymous to false', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_anonymous).toBe(false);
    }
  });

  it('defaults is_recurring to false', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_recurring).toBe(false);
    }
  });

  it('defaults customer_name to Donatur TAM', () => {
    const result = donasiSchema.safeParse({
      amount: 50000,
      payment_type: 'qris',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customer_name).toBe('Donatur TAM');
    }
  });
});

describe('getMinAmount', () => {
  it('returns 1500 for qris', () => {
    expect(getMinAmount('qris')).toBe(1500);
  });

  it('returns 1000 for VA methods', () => {
    expect(getMinAmount('bni_va')).toBe(1000);
    expect(getMinAmount('bri_va')).toBe(1000);
    expect(getMinAmount('permata_va')).toBe(1000);
    expect(getMinAmount('cimb_niaga_va')).toBe(1000);
  });

  it('returns 1000 for unknown payment type', () => {
    expect(getMinAmount('unknown')).toBe(1000);
  });
});
