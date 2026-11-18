import { expect, test } from 'vitest';
import { emailHref, httpHref, phoneHref, hasContactInfo } from '@/lib/contact';

test('contact URLs omit empty and malformed values', () => {
  for (const value of [undefined, '', '  ']) {
    expect(phoneHref(value)).toBeUndefined();
    expect(emailHref(value)).toBeUndefined();
    expect(httpHref(value)).toBeUndefined();
  }
  for (const value of ['call us', '++12345', '123 ext 4', '12'])
    expect(phoneHref(value)).toBeUndefined();
  for (const value of [
    'missing-at.example',
    'a@b',
    'a@example.com?subject=bad',
    'a@example.com\r\nBcc:x@example.com',
  ])
    expect(emailHref(value)).toBeUndefined();
  for (const value of [
    'javascript:alert(1)',
    'mailto:a@example.com',
    '/map',
    'https://user:secret@example.com',
  ])
    expect(httpHref(value)).toBeUndefined();
});

test('contact sections omit blank or invalid content and accept independent fields', () => {
  expect(hasContactInfo(undefined)).toBe(false);
  expect(
    hasContactInfo({
      email: '',
      address: ' ',
      links: [{ label: 'bad', href: 'javascript:alert(1)' }],
    }),
  ).toBe(false);
  for (const details of [
    { hours: 'Mon–Fri' },
    { address: 'Address' },
    { email: 'a@example.com' },
    { phone: { text: '', number: '+77771234567' } },
    { map: { label: 'Map', href: 'https://example.com/' } },
  ])
    expect(hasContactInfo(details)).toBe(true);
});

test('contact URLs preserve usable destinations and encode email special characters', () => {
  expect(phoneHref(' +7 (777) 123-45-67 ')).toBe('tel:+77771234567');
  expect(emailHref(' hello+team@example.com ')).toBe(
    'mailto:hello%2Bteam@example.com',
  );
  expect(httpHref(' https://example.com/map?q=one ')).toBe(
    'https://example.com/map?q=one',
  );
});
