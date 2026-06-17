import { expect, test } from 'vitest';

function esEnlaceWhatsApp(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      (u.hostname === 'wa.me' || u.hostname === 'api.whatsapp.com')
    );
  } catch {
    return false;
  }
}

test('esEnlaceWhatsApp valida correctamente dominios permitidos de WhatsApp', () => {
  expect(esEnlaceWhatsApp('https://wa.me/573001234567?text=hola')).toBe(true);
  expect(esEnlaceWhatsApp('https://api.whatsapp.com/send?phone=573001234567')).toBe(true);
  expect(esEnlaceWhatsApp('http://wa.me/573001234567')).toBe(false); // Requiere HTTPS
  expect(esEnlaceWhatsApp('https://phishing-whatsapp.com/send')).toBe(false); // Host no válido
  expect(esEnlaceWhatsApp('https://evil.com/wa.me/')).toBe(false); // Host malicioso
  expect(esEnlaceWhatsApp('invalido-enlace')).toBe(false); // Formato inválido
});
