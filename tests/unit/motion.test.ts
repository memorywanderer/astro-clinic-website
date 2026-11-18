import { describe, expect, it } from 'vitest';
import { splitWords } from '../../src/lib/motion/text';

describe('plain text reveal segmentation', () => {
  it.each([
    'Русский текст, с пунктуацией!',
    'Ә ғ қ ң ө ұ ү һ і — қазақша.',
    '  Несколько\tпробелов\nи строк.  ',
    'Emoji 👩🏽‍💻 и e\u0301.',
    '',
  ])('preserves every character: %s', (text) => {
    expect(splitWords(text).join('')).toBe(text);
    expect(splitWords(text).every((part) => part.length > 0)).toBe(true);
  });
  it('keeps punctuation with words and whitespace separately', () => {
    expect(splitWords('Әлем,  привет!')).toEqual(['Әлем,', '  ', 'привет!']);
  });
});
