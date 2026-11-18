import type { Price } from '@/content/business';

/** Illustrative fixtures only. Replace and verify every value before a real launch. */
export const DEMO_MODE = true;
export const clinic = {
  phone: '+7 (700) 000-00-00',
  number: '+77000000000',
  timezone: 'Asia/Almaty',
  maps: {
    twoGis: 'https://2gis.kz/almaty',
    google: 'https://www.google.com/maps/search/?api=1&query=Almaty',
  },
  hours: [
    null,
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['10:00', '16:00'],
  ],
  prices: {
    hygiene: { kind: 'exact', amount: 18000, currency: 'KZT' },
    child: { kind: 'from', amount: 12000, currency: 'KZT' },
    care: { kind: 'from', amount: 22000, currency: 'KZT' },
    crowns: { kind: 'range', min: 85000, max: 120000, currency: 'KZT' },
    implants: { kind: 'from', amount: 180000, currency: 'KZT' },
    orthodontics: { kind: 'from', amount: 250000, currency: 'KZT' },
    extraction: { kind: 'from', amount: 15000, currency: 'KZT' },
    consultation: { kind: 'exact', amount: 5000, currency: 'KZT' },
  } satisfies Record<string, Price>,
  promo: { amount: 20000, currency: 'KZT', validUntil: '2026-12-31' },
  doctors: { aida: { years: 8 }, daniel: { years: 11 } },
} as const;
