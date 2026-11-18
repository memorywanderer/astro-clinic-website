import { expect, test, vi } from 'vitest';
import { getClinicHome } from '@/content/clinic-home';
import type * as ClinicConfig from '@/config/clinic';

vi.mock('@/config/clinic', async (importOriginal) => ({
  ...(await importOriginal<typeof ClinicConfig>()),
  DEMO_MODE: false,
}));
vi.mock('@/assets/clinic/family-consultation.png', () => ({
  default: { src: '/family.png', width: 1000, height: 800, format: 'png' },
}));
vi.mock('@/assets/clinic/reception.png', () => ({
  default: { src: '/reception.png', width: 1000, height: 800, format: 'png' },
}));
vi.mock('@/assets/clinic/specialist-woman.png', () => ({
  default: { src: '/woman.png', width: 800, height: 1000, format: 'png' },
}));
vi.mock('@/assets/clinic/specialist-man.png', () => ({
  default: { src: '/man.png', width: 800, height: 1000, format: 'png' },
}));
vi.mock('@/assets/material-study.png', () => ({
  default: { src: '/material.png', width: 640, height: 480, format: 'png' },
}));

for (const locale of ['ru', 'kk'] as const)
  test(`${locale}: non-demo contacts resolve through the shared action contract`, () => {
    const c = getClinicHome(locale);
    const whatsapp = new URL(c.contactActions[0].href);
    expect(whatsapp.origin).toBe('https://wa.me');
    expect(whatsapp.pathname).toBe('/77000000000');
    expect(whatsapp.searchParams.get('text')).toContain(c.ui.greeting);
    expect(c.contactActions[1].href).toBe('tel:+77000000000');
    expect(c.treatments.every((item) => item.action.href === '#contact')).toBe(
      true,
    );
    expect(c.faq.items).toHaveLength(5);
  });
