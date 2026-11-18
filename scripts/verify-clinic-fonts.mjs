import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import console from 'node:console';

// Inspect the upstream TrueType cmap before shipping matching Noto web subsets.
for (const name of ['noto-sans', 'noto-sans-display']) {
  const data = readFileSync(`scripts/font-sources/${name}.ttf`);
  const count = data.readUInt16BE(4);
  let cmap = 0;
  for (let i = 0; i < count; i++) {
    const offset = 12 + i * 16;
    if (data.toString('ascii', offset, offset + 4) === 'cmap')
      cmap = data.readUInt32BE(offset + 8);
  }
  assert.ok(cmap);
  const tables = [];
  for (let i = 0; i < data.readUInt16BE(cmap + 2); i++) {
    const offset = cmap + data.readUInt32BE(cmap + 8 + i * 8);
    if (data.readUInt16BE(offset) === 4) tables.push(offset);
  }
  const covers = (code) =>
    tables.some((offset) => {
      const segments = data.readUInt16BE(offset + 6) / 2;
      for (let i = 0; i < segments; i++) {
        const end = data.readUInt16BE(offset + 14 + i * 2);
        const start = data.readUInt16BE(offset + 16 + segments * 2 + i * 2);
        if (code < start || code > end) continue;
        const delta = data.readInt16BE(offset + 16 + segments * 4 + i * 2);
        const rangeAddress = offset + 16 + segments * 6 + i * 2;
        const range = data.readUInt16BE(rangeAddress);
        const glyph = range
          ? data.readUInt16BE(rangeAddress + range + (code - start) * 2)
          : code;
        return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
      }
      return false;
    });
  const required =
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯӘҒҚҢӨҰҮҺІабвгдеёжзийклмнопрстуфхцчшщъыьэюяәғқңөұүһі';
  for (const char of required)
    assert.ok(covers(char.codePointAt(0)), `${name}: ${char}`);
  console.log(`${name}: Russian and Kazakh cmap coverage verified`);
}
