import { generateWhatsAppLink } from './whatsapp.util';

describe('generateWhatsAppLink', () => {
  it('should generate valid wa.me link', () => {
    const link = generateWhatsAppLink(
      '573001234567',
      'Ramo de Rosas',
      'María',
      2,
    );

    expect(link).toContain('https://wa.me/573001234567');
    expect(link).toContain('text=');
    expect(link).toContain(encodeURIComponent('María'));
    expect(link).toContain(encodeURIComponent('Ramo de Rosas'));
    expect(link).toContain(encodeURIComponent('Cantidad: 2'));
  });

  it('should default to quantity 1', () => {
    const link = generateWhatsAppLink(
      '573001234567',
      'Corona Imperial',
      'Carlos',
    );

    expect(link).toContain(encodeURIComponent('Cantidad: 1'));
  });
});
