import { describe, it, expect } from 'vitest';
import { resolveTarget, parseDefaultUid } from '../../src/utils/target.js';

describe('resolveTarget', () => {
  it('returns explicit "to" even when a default exists (override)', () => {
    expect(resolveTarget('U111', 'Udefault')).toEqual({ ok: true, to: 'U111' });
  });

  it('falls back to the default when "to" is omitted', () => {
    expect(resolveTarget(undefined, 'Udefault')).toEqual({ ok: true, to: 'Udefault' });
  });

  it('errors when neither "to" nor default is present', () => {
    const result = resolveTarget(undefined, undefined);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('DEFAULT_UID');
  });
});

describe('parseDefaultUid', () => {
  it('treats undefined as no default', () => {
    expect(parseDefaultUid(undefined)).toEqual({ ok: true, value: undefined });
  });

  it('treats empty string as no default', () => {
    expect(parseDefaultUid('')).toEqual({ ok: true, value: undefined });
  });

  it('treats whitespace-only as no default', () => {
    expect(parseDefaultUid('   ')).toEqual({ ok: true, value: undefined });
  });

  it('trims surrounding whitespace from a valid value', () => {
    expect(parseDefaultUid('  U123  ')).toEqual({ ok: true, value: 'U123' });
  });

  it('rejects a value that does not start with "U"', () => {
    const result = parseDefaultUid('C123');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('U');
  });

  it('accepts a valid U-prefixed value', () => {
    expect(parseDefaultUid('U456')).toEqual({ ok: true, value: 'U456' });
  });
});
