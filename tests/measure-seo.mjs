import { createServer } from 'node:http';
import console from 'node:console';
import { URL } from 'node:url';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'test-results/seo-builds/production-fixture/dist');
const output = resolve(root, 'test-results/seo-measurements');
await stat(resolve(dist, 'ru/index.html')); // Run verify:seo first; never measure dev output.
await mkdir(output, { recursive: true });
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    const file = resolve(
      dist,
      `.${path}${path.endsWith('/') ? 'index.html' : ''}`,
    );
    if (!file.startsWith(`${dist}${sep}`)) throw new Error('Invalid path');
    const data = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string')
  throw new Error('Missing measurement server port');
const base = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({
  args: ['--remote-debugging-port=9223'],
});
const summary = [];
try {
  for (const path of ['/ru/', '/kk/', '/ru/services/']) {
    const key = path.split('/').filter(Boolean).join('-');
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await page.goto(`${base}${path}`);
    await page.screenshot({
      path: resolve(output, `${key}-mobile.png`),
      fullPage: true,
    });
    await page.close();
    const result = await lighthouse(`${base}${path}`, {
      port: 9223,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!result || result.lhr.runtimeError)
      throw new Error(JSON.stringify(result?.lhr.runtimeError));
    await writeFile(resolve(output, `${key}.json`), result.report[0]);
    await writeFile(resolve(output, `${key}.html`), result.report[1]);
    const lhr = result.lhr;
    const resources = lhr.audits['resource-summary'].details?.items;
    const item = {
      path,
      version: lhr.lighthouseVersion,
      userAgent: lhr.environment.hostUserAgent,
      settings: lhr.configSettings,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, category]) => [
          key,
          Math.round(category.score * 100),
        ]),
      ),
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
      resources,
      findings: Object.values(lhr.audits)
        .filter((audit) => audit.score !== null && audit.score < 1)
        .map((audit) => ({
          id: audit.id,
          title: audit.title,
          score: audit.score,
          displayValue: audit.displayValue,
        })),
    };
    summary.push(item);
    console.log(
      JSON.stringify({
        path,
        scores: item.scores,
        lcp: item.lcp,
        cls: item.cls,
        tbt: item.tbt,
      }),
    );
  }
  await writeFile(
    resolve(output, 'summary.json'),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        fixture: true,
        runsPerPage: 1,
        summary,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
