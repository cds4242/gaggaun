import fs from 'node:fs';
import path from 'node:path';
import { fetch } from 'undici';

const BASE = 'http://localhost:3000';
const OUT = path.resolve('./export_home');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

function safeName(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^localhost:\d+\//, '')
    .replace(/^\//, '')
    .replace(/[?&=:]/g, '_')
    .replace(/[^a-zA-Z0-9_./-]/g, '_');
}

const downloaded = new Map();
async function download(url, ext) {
  if (downloaded.has(url)) return downloaded.get(url);
  const r = await get(url);
  const buf = Buffer.from(await r.arrayBuffer());
  const guessExt = ext || path.extname(new URL(url).pathname) || '.bin';
  const base = safeName(url).replace(/\.[^.]+$/, '').slice(-80);
  const fname = `${base}${guessExt}`;
  const local = path.join('assets', fname);
  fs.writeFileSync(path.join(OUT, local), buf);
  downloaded.set(url, local.replace(/\\/g, '/'));
  return local.replace(/\\/g, '/');
}

// 1) get the page HTML
console.log('Fetching home HTML...');
const homeRes = await get(BASE);
let html = await homeRes.text();

// 2) extract CSS hrefs (relative /_next/...) and rewrite
const cssLinks = [...html.matchAll(/<link[^>]+href="(\/_next\/[^"]+\.css)"[^>]*>/g)].map(m => m[1]);
console.log('CSS files:', cssLinks);

// 3) fetch each CSS, replace url(/_next/...) and src refs with local copies
async function processCss(cssUrl) {
  const r = await get(BASE + cssUrl);
  let css = await r.text();
  // rewrite url(/_next/...)
  const urlMatches = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/['"]/g, ''));
  for (const u of urlMatches) {
    if (u.startsWith('data:')) continue;
    let abs = u;
    if (u.startsWith('/')) abs = BASE + u;
    else if (u.startsWith('https://') || u.startsWith('http://')) abs = u;
    else continue;
    try {
      const local = await download(abs);
      css = css.split(u).join('../' + local);
    } catch (e) {
      console.log('skip css asset', u, e.message);
    }
  }
  return css;
}

const cssCombined = [];
for (const c of cssLinks) {
  cssCombined.push(`/* ${c} */\n` + await processCss(c));
}

// 4) collect images: srcset and src in _next/image
const imgUrls = new Set();
for (const m of html.matchAll(/url=%2F([^&"\s)]+)/g)) {
  imgUrls.add('/' + decodeURIComponent(m[1]));
}
for (const m of html.matchAll(/src="(\/_next\/image\?url=[^"]+)"/g)) {
  // also handle these - but we use src directly later
}
// Also static images referenced directly /church_XX.jpg
for (const m of html.matchAll(/\/(church_\d{2}\.jpg)/g)) {
  imgUrls.add('/' + m[1]);
}

console.log('Static images to inline:', imgUrls.size);

// download each as /church_XX.jpg with original name
for (const rel of imgUrls) {
  const abs = BASE + rel;
  try {
    const r = await get(abs);
    const buf = Buffer.from(await r.arrayBuffer());
    const fname = path.basename(rel);
    fs.writeFileSync(path.join(OUT, 'assets', fname), buf);
    downloaded.set(abs, 'assets/' + fname);
    downloaded.set(rel, 'assets/' + fname);
  } catch (e) {
    console.log('skip image', rel, e.message);
  }
}

// 5) Rewrite HTML
// a) remove all <script> tags
html = html.replace(/<script[\s\S]*?<\/script>/g, '');
// b) remove <link rel="preload" as="script" ...>
html = html.replace(/<link[^>]+rel="preload"[^>]+as="script"[^>]*>/g, '');
// c) remove <link rel="stylesheet" href="/_next/...> (we'll inline)
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="\/_next\/[^"]+"[^>]*>/g, '');
// d) remove preload image links (we keep direct img tags)
html = html.replace(/<link[^>]+rel="preload"[^>]+as="image"[^>]*>/g, '');

// e) replace next/image srcset/src that go through /_next/image?url=...&w=...&q=...
// transform all src="/_next/image?url=%2Fchurch_XX.jpg..." -> src="assets/church_XX.jpg"
html = html.replace(/src="\/_next\/image\?url=([^"&]+)[^"]*"/g, (m, u) => {
  const decoded = decodeURIComponent(u);
  const fname = path.basename(decoded);
  return `src="assets/${fname}"`;
});
// same for srcSet
html = html.replace(/srcset="([^"]+)"/gi, (m, ss) => {
  const first = ss.split(',')[0].trim().split(' ')[0];
  // try to extract /_next/image?url=...
  const um = first.match(/url=([^&]+)/);
  if (!um) return '';
  const decoded = decodeURIComponent(um[1]);
  const fname = path.basename(decoded);
  return `srcset="assets/${fname}"`;
});

// f) Replace bare /church_XX.jpg references (in inline styles) to assets/
html = html.replace(/\/church_(\d{2})\.jpg/g, 'assets/church_$1.jpg');

// g) Remove fetchpriority etc. attributes are fine to keep

// h) Inject inlined CSS
const css = cssCombined.join('\n\n');
html = html.replace(/<\/head>/, `<style>\n${css}\n</style>\n</head>`);

// i) Rewrite internal links to placeholders (#) since this is static
html = html.replace(/href="\/([a-zA-Z0-9_\-\/\[\]]*)"/g, (m, p) => {
  if (p.startsWith('_next')) return m;
  return 'href="#' + p + '"';
});

fs.writeFileSync(path.join(OUT, 'index.html'), html);

console.log('\n✔ Exported to ./export_home/index.html');
console.log('  Assets:', fs.readdirSync(path.join(OUT, 'assets')).length, 'files');
