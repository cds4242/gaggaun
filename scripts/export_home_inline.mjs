import fs from 'node:fs';
import path from 'node:path';
import { fetch } from 'undici';

const BASE = 'http://localhost:3000';
const OUT = path.resolve('./export_home');
fs.mkdirSync(OUT, { recursive: true });

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

const cache = new Map();
async function toDataUrl(absUrl, mimeOverride) {
  if (cache.has(absUrl)) return cache.get(absUrl);
  const r = await get(absUrl);
  const buf = Buffer.from(await r.arrayBuffer());
  let mime = mimeOverride || r.headers.get('content-type') || '';
  mime = mime.split(';')[0].trim();
  if (!mime) {
    const ext = path.extname(new URL(absUrl).pathname).toLowerCase();
    mime = ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.css': 'text/css' }[ext]) || 'application/octet-stream';
  }
  const data = `data:${mime};base64,${buf.toString('base64')}`;
  cache.set(absUrl, data);
  return data;
}

// 1) home HTML
console.log('Fetching home HTML...');
let html = await (await get(BASE)).text();

// 2) CSS files served by Next
const cssLinks = [...html.matchAll(/<link[^>]+href="(\/_next\/[^"]+\.css)"[^>]*>/g)].map(m => m[1]);
console.log('CSS files:', cssLinks);

async function processCss(cssUrl) {
  const css = await (await get(BASE + cssUrl)).text();
  // inline url(...) refs inside CSS as data URLs
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/['"]/g, ''));
  let result = css;
  for (const u of urls) {
    if (u.startsWith('data:')) continue;
    let abs = u;
    if (u.startsWith('/')) abs = BASE + u;
    else if (u.startsWith('//')) abs = 'https:' + u;
    else if (!/^https?:/.test(u)) continue;
    try {
      const data = await toDataUrl(abs);
      result = result.split(u).join(data);
    } catch (e) {
      console.log('skip css asset', u, e.message);
    }
  }
  return result;
}

const cssCombined = [];
for (const c of cssLinks) cssCombined.push(`/* ${c} */\n` + await processCss(c));

// 3) collect all images referenced via /_next/image?url=...&w=...
// and replace each occurrence (src + srcset) with a single data: URL
const imgSrcSetRe = /\/_next\/image\?url=([^&"\s)]+)(?:[^"\s)]+)?/g;
const refs = new Set();
for (const m of html.matchAll(imgSrcSetRe)) refs.add(m[1]);
for (const m of html.matchAll(/\/(church_\d{2}\.jpg)/g)) refs.add(encodeURIComponent('/' + m[1]));

const imgMap = new Map();
for (const enc of refs) {
  const rel = decodeURIComponent(enc); // e.g. /church_01.jpg
  const abs = BASE + rel;
  try {
    const data = await toDataUrl(abs, 'image/jpeg');
    imgMap.set(rel, data);
  } catch (e) {
    console.log('skip image', rel, e.message);
  }
}
console.log('Images inlined:', imgMap.size);

// 4) clean & rewrite HTML
// remove all script tags
html = html.replace(/<script[\s\S]*?<\/script>/g, '');
// remove next preload links
html = html.replace(/<link[^>]+rel="preload"[^>]+>/g, '');
// remove next stylesheets (we inline)
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="\/_next\/[^"]+"[^>]*>/g, '');

// Tag-by-tag rewrite: for every <img ...> find any /_next/image?url=XXX or bare /church_XX.jpg
// inside src or srcset, resolve to inlined data URL, and replace BOTH src and srcset on that tag.
function rewriteImgTags(input) {
  return input.replace(/<img\b[^>]*>/g, (tag) => {
    // collect all /_next/image?url=... or /church_XX.jpg references in this tag
    const refs = [];
    for (const m of tag.matchAll(/\/_next\/image\?url=([^&"\s]+)/g)) refs.push(decodeURIComponent(m[1]));
    for (const m of tag.matchAll(/(?<=[" '])\/(church_\d{2}\.jpg)/g)) refs.push('/' + m[1]);
    const rel = refs.find(r => imgMap.has(r));
    if (!rel) return tag;
    const data = imgMap.get(rel);
    // remove existing src / srcset / srcSet attributes
    let t = tag
      .replace(/\s(src|srcset|srcSet|imagesrcset|imageSrcSet|imagesizes|imageSizes|sizes)="[^"]*"/g, '')
      .replace(/\sfetchPriority="[^"]*"/g, '');
    // inject inlined src right after <img
    t = t.replace(/^<img/, `<img src="${data}"`);
    return t;
  });
}
html = rewriteImgTags(html);

// Also rewrite <link rel=preload imagesrcset=...>
html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, '');

// Rewrite internal links to placeholders (#) since this is a single-file export
html = html.replace(/href="\/([a-zA-Z0-9_\-\/\[\]]*)"/g, (m, p) => {
  if (p.startsWith('_next')) return m;
  if (/\.[a-z]+$/i.test(p)) return m;
  return 'href="#' + p + '"';
});

// Inline pretendard subset CSS from CDN (fonts inside it use unicode-range; will be referenced by URL)
// Optional: try to inline the CDN CSS contents too.
try {
  const cdnCssUrl = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
  const cdnRes = await get(cdnCssUrl);
  let cdnCss = await cdnRes.text();
  // Inline woff2 fonts referenced inside the CDN CSS as data URLs
  const fontUrls = [...cdnCss.matchAll(/url\((https?:[^)]+|\.\/[^)]+|\/[^)]+)\)/g)].map(m => m[1].replace(/['"]/g, ''));
  for (const fu of fontUrls) {
    let abs = fu;
    if (fu.startsWith('//')) abs = 'https:' + fu;
    else if (fu.startsWith('./') || fu.startsWith('/')) abs = new URL(fu, cdnCssUrl).href;
    try {
      const data = await toDataUrl(abs);
      cdnCss = cdnCss.split(fu).join(data);
    } catch (e) {
      console.log('skip font', fu, e.message);
    }
  }
  cssCombined.push('/* pretendard inlined */\n' + cdnCss);
  // remove the original <link> referencing CDN
  html = html.replace(/<link[^>]+href="https:\/\/cdn\.jsdelivr\.net\/[^"]+pretendard[^"]+"[^>]*>/g, '');
} catch (e) {
  console.log('Pretendard inline skipped:', e.message);
}

// Inject merged CSS into <head>
const styleBlock = `<style>\n${cssCombined.join('\n\n')}\n</style>`;
html = html.replace(/<\/head>/, styleBlock + '\n</head>');

// 5) Write
const outFile = path.join(OUT, 'index_inline.html');
fs.writeFileSync(outFile, html);
const stats = fs.statSync(outFile);
console.log(`\n✔ Wrote ${outFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
