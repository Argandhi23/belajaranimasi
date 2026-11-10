import { describe, expect, it } from 'vitest';
import { validateReaderDestination } from '../scripts/reader-destination.js';

describe('local reader provisioning destination', () => {
  const runtime =
    'postgresql://belajar_reader:example@localhost:5433/belajar_animasi';
  it('accepts owner and runtime on the same local database', () => {
    expect(() =>
      validateReaderDestination(
        'postgresql://owner:example@127.0.0.1:5433/belajar_animasi',
        runtime,
      ),
    ).not.toThrow();
  });
  it.each([
    'postgresql://owner:example@remote.example:5433/belajar_animasi',
    'postgresql://owner:example@localhost:5433/another_database',
    'postgresql://owner:example@localhost:5432/belajar_animasi',
  ])('rejects a different owner destination before connecting', (owner) => {
    expect(() => validateReaderDestination(owner, runtime)).toThrow();
  });
  it('rejects a privileged runtime role', () => {
    expect(() =>
      validateReaderDestination(
        runtime,
        runtime.replace('belajar_reader:', 'postgres:'),
      ),
    ).toThrow();
  });
});
