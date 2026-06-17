import { generateSlug } from './slug.util';

describe('generateSlug', () => {
  it('should convert to lowercase', () => {
    expect(generateSlug('HELLO WORLD')).toBe('hello-world');
  });

  it('should handle Spanish accents', () => {
    expect(generateSlug('Ramos Fúnebres')).toBe('ramos-funebres');
    expect(generateSlug('Planificación Exequial')).toBe('planificacion-exequial');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Hello! @World#')).toBe('hello-world');
  });

  it('should collapse multiple hyphens', () => {
    expect(generateSlug('hello   world')).toBe('hello-world');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(generateSlug(' -hello- ')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});
