import { expect, test } from 'vitest';
import { contactDestination, formatKzPhone, openingStatus } from '@/lib/clinic';
import { clinic, DEMO_MODE } from '@/config/clinic';
import { clinicCopy } from '@/content/clinic-polish';

test('demo defaults and real action URLs use the same fixture and encode messages', () => {
  expect(DEMO_MODE).toBe(true);
  expect(contactDestination('call', '')).toBe('tel:+77000000000');
  const url = new URL(
    contactDestination('whatsapp', 'Здравствуйте! Гигиена & консультация'),
  );
  expect(url.pathname).toBe('/77000000000');
  expect(url.searchParams.get('text')).toBe(
    'Здравствуйте! Гигиена & консультация',
  );
  expect(clinic.prices.implants.amount).toBe(180000);
  expect(clinic.prices.orthodontics.amount).toBe(250000);
});
test('KZ mask accepts pasted international, national and local mobile numbers', () => {
  for (const input of [
    '+77012345678',
    '87012345678',
    '7012345678',
    '+7 (701) 234-56-78',
  ])
    expect(formatKzPhone(input)).toBe('+7 (701) 234-56-78');
  expect(formatKzPhone('')).toBe('+7');
});
test('Almaty opening status handles opening boundaries, Saturday and Sunday', () => {
  // 2026-11-12 is Thursday; Almaty is UTC+5.
  expect(openingStatus(new Date('2026-11-12T03:59:00Z'), 'ru')).toContain(
    '09:00',
  );
  expect(openingStatus(new Date('2026-11-12T04:00:00Z'), 'ru')).toContain(
    'Сейчас открыто',
  );
  expect(openingStatus(new Date('2026-11-12T15:00:00Z'), 'ru')).toContain(
    'завтра',
  );
  expect(openingStatus(new Date('2026-11-14T05:00:00Z'), 'kk')).toContain(
    '16:00',
  );
  expect(openingStatus(new Date('2026-11-14T11:00:00Z'), 'ru')).toContain(
    'в понедельник',
  );
  expect(openingStatus(new Date('2026-11-15T06:00:00Z'), 'kk')).toContain(
    'ертең',
  );
});
test('RU and KK action copy keeps matching keys and action counts', () => {
  expect(Object.keys(clinicCopy.ru)).toEqual(Object.keys(clinicCopy.kk));
  expect(clinicCopy.ru.actions.length).toBe(clinicCopy.kk.actions.length);
});
