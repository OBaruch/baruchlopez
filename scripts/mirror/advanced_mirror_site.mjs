import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const START = process.argv[2] || 'https://www.valentincheval.design';
const OUT = path.resolve(process.argv[3] || path.join('context', new URL(START).hostname));
const MAX = Number(process.env.MIRROR_MAX_PAGES || 30);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 advanced-mirror/1.0';
const FETCH_T = 30000;
const RENDER_T = 40000;
const DESK = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
const MOB = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, screenOrientation: { type: 'portraitPrimary', angle: 0 } };
const TRACK = new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','gclid','fbclid','mc_cid','mc_eid','ref','ref_src','ref_url','source','igshid','mkt_tok','yclid','_ga','_gl']);
const SKIP = /(?:^|\/)(?:login|logout|sign-?in|sign-?out|checkout|cart|account|admin|wp-admin|dashboard|private|auth|register|signup|sign-up|my-account)(?:\/|$)/i;
const CHROME = [process.env.CHROME_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
const ROOT_FILES = ['site_index.json','pages.csv','assets_manifest.json','internal_link_graph.json','interaction_patterns.json','animation_patterns.json','design_system_inference.json','tech_stack_inference.json','domain_summary.md'];
const KEYWORDS = ['menu','nav','toggle','accordion','tab','carousel','slider','modal','overlay','drawer','panel','cursor','parallax','marquee','loader','intro','enter','sound','audio','project','card'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value) => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const uniq = (values) => [...new Set((values || []).filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
const hash = (value) => crypto.createHash('sha1').update(String(value)).digest('hex').slice(0, 10);
const csv = (values) => values.map((value) => { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }).join(',');
const sortv = (value) => Array.isArray(value) ? value.map(sortv) : value && typeof value === 'object' ? Object.keys(value).sort().reduce((acc, key) => (acc[key] = sortv(value[key]), acc), {}) : value;
async function w(filePath, content) { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, content, 'utf8'); }
async function jw(filePath, value) { await w(filePath, JSON.stringify(sortv(value), null, 2) + '\n'); }
function norm(input, base) {
  try {
    const url = base ? new URL(input, base) : new URL(input);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.hostname = url.hostname.toLowerCase();
    url.hash = '';
    if (!url.pathname) url.pathname = '/';
    url.pathname = url.pathname.replace(/\/index\.html?$/i, '/');
    if (url.pathname !== '/' && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    const keep = [];
    for (const [key, value] of url.searchParams.entries()) if (!TRACK.has(key.toLowerCase()) && String(value).trim()) keep.push([key, value]);
    keep.sort(([ak, av], [bk, bv]) => ak === bk ? av.localeCompare(bv) : ak.localeCompare(bk));
    url.search = '';
    for (const [key, value] of keep) url.searchParams.append(key, value);
    return url.toString();
  } catch { return null; }
}
function allowedHosts(initialUrl, finalUrl) {
  const set = new Set();
  for (const host of [new URL(initialUrl).hostname, new URL(finalUrl).hostname]) {
    const lower = host.toLowerCase();
    set.add(lower);
    set.add(lower.startsWith('www.') ? lower.slice(4) : `www.${lower}`);
  }
  return set;
}
function shouldSkip(url, allowed) { try { const u = new URL(url); return !allowed.has(u.hostname.toLowerCase()) || SKIP.test(u.pathname); } catch { return true; } }
function classify(url, allowed) { try { const u = new URL(url); return /^https?:$/.test(u.protocol) ? (allowed.has(u.hostname.toLowerCase()) ? 'internal' : 'external') : 'other'; } catch { return 'other'; } }
function folderName(url) { const u = new URL(url); let name = u.pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'page').join('__') || 'root'; if (u.search) name += `__${hash(u.search)}`; return name; }
async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_T);
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5' },
      redirect: 'follow',
      signal: controller.signal,
    });
    return { ok: response.ok, status: response.status, finalUrl: response.url, headers: Object.fromEntries(response.headers.entries()), contentType: response.headers.get('content-type') || '', body: await response.text() };
  } finally { clearTimeout(timer); }
}
async function findChrome() { for (const candidate of CHROME) { try { await fs.access(candidate); return candidate; } catch {} } throw new Error('No se encontro Chrome o Edge'); }
class CDP {
  constructor(wsUrl) {
    this.id = 1; this.pending = new Map(); this.listeners = new Map(); this.ws = new WebSocket(wsUrl);
    this.opened = new Promise((resolve, reject) => { this.ws.addEventListener('open', resolve); this.ws.addEventListener('error', reject); });
    this.ws.addEventListener('message', (event) => {
      const payload = JSON.parse(String(event.data));
      if (payload.id) {
        const pending = this.pending.get(payload.id); if (!pending) return;
        this.pending.delete(payload.id); return payload.error ? pending.reject(new Error(payload.error.message || pending.method)) : pending.resolve(payload.result);
      }
      for (const handler of this.listeners.get(payload.method) || []) handler(payload.params || {});
    });
    this.ws.addEventListener('close', () => { for (const pending of this.pending.values()) pending.reject(new Error('CDP closed')); this.pending.clear(); });
  }
  send(method, params = {}) { return new Promise((resolve, reject) => { const id = this.id++; this.pending.set(id, { resolve, reject, method }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  on(method, handler) { const list = this.listeners.get(method) || []; list.push(handler); this.listeners.set(method, list); return () => this.listeners.set(method, (this.listeners.get(method) || []).filter((item) => item !== handler)); }
  wait(method, predicate = () => true, ms = RENDER_T) { return new Promise((resolve, reject) => { const off = this.on(method, (params) => { if (predicate(params)) { clearTimeout(timer); off(); resolve(params); } }); const timer = setTimeout(() => { off(); reject(new Error(`timeout ${method}`)); }, ms); }); }
  close() { try { this.ws.close(); } catch {} }
}
async function launch() {
  const chromePath = await findChrome();
  const port = String(9300 + Math.floor(Math.random() * 400));
  const userDir = path.join(os.tmpdir(), `adv-mirror-${process.pid}-${Date.now()}`);
  const proc = spawn(chromePath, ['--headless=new','--enable-webgl','--use-gl=angle','--ignore-gpu-blocklist','--disable-extensions','--disable-background-networking','--disable-sync','--hide-scrollbars','--no-first-run','--no-default-browser-check','--remote-debugging-address=127.0.0.1',`--remote-debugging-port=${port}`,`--user-data-dir=${userDir}`,'about:blank'], { stdio: 'ignore', windowsHide: true });
  let ws = null;
  for (let attempt = 0; attempt < 60; attempt += 1) { await sleep(250); try { const response = await fetch(`http://127.0.0.1:${port}/json/list`); const pages = await response.json(); ws = pages.find((entry) => entry.type === 'page')?.webSocketDebuggerUrl || null; if (ws) break; } catch {} }
  if (!ws) { proc.kill(); throw new Error('No se pudo conectar a Chrome headless'); }
  const c = new CDP(ws); await c.opened;
  for (const [method, params] of [['Page.enable',{}],['Runtime.enable',{}],['Network.enable',{}],['DOM.enable',{}],['Network.setCacheDisabled',{ cacheDisabled: true }],['Emulation.setUserAgentOverride',{ userAgent: UA }]]) await c.send(method, params).catch(() => null);
  return { c, cleanup: async () => { c.close(); try { proc.kill(); } catch {} await new Promise((resolve) => { if (proc.exitCode !== null) return resolve(); const timer = setTimeout(resolve, 1500); proc.once('exit', () => { clearTimeout(timer); resolve(); }); }); await fs.rm(userDir, { recursive: true, force: true }).catch(() => null); } };
}
async function ev(c, expression) { const response = await c.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return response.result?.value ?? null; }
async function shot(c, options = {}) { const response = await c.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: !!options.full, clip: options.clip || undefined }); return Buffer.from(response.data, 'base64'); }
async function viewport(c, metrics) { await c.send('Emulation.setDeviceMetricsOverride', metrics); }
async function navigate(c, url) {
  const load = c.wait('Page.loadEventFired', () => true, RENDER_T).catch(() => null);
  await c.send('Page.navigate', { url });
  await load;
  await ev(c, `new Promise(async (resolve) => { const wait = (ms) => new Promise((r) => setTimeout(r, ms)); try { const max = Math.max(document.body?.scrollHeight || 0, document.documentElement?.scrollHeight || 0, document.body?.offsetHeight || 0, document.documentElement?.offsetHeight || 0); const step = Math.max(innerHeight * 0.85, 480); for (let y = 0; y < max; y += step) { scrollTo(0, y); await wait(140); } scrollTo(0, 0); if (document.fonts?.ready) await Promise.race([document.fonts.ready, wait(2200)]); for (let i = 0; i < 80; i += 1) { const loader = document.querySelector('#loader'); const loaderHidden = !loader || getComputedStyle(loader).display === 'none' || getComputedStyle(loader).visibility === 'hidden' || Number(getComputedStyle(loader).opacity || '1') < 0.05; const hasCanvas = !!document.querySelector('#webgl canvas, canvas'); if (loaderHidden || hasCanvas) break; if (i === 10) document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: Math.round(innerWidth * 0.5), clientY: Math.round(innerHeight * 0.5) })); await wait(250); } await wait(1200); } catch { await wait(1000); } resolve(true); })`).catch(() => null);
}
function extractPage(rawHtml, sourceUrl, keywords) {
  const clean = (value) => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const uniq = (values) => [...new Set((values || []).filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
  const compact = (value) => clean(value).replace(/\s+/g, ' ').trim();
  const uniqueBy = (items, keyFn) => { const seen = new Set(); const output = []; for (const item of items || []) { const key = keyFn(item); if (seen.has(key)) continue; seen.add(key); output.push(item); } return output; };
  const parseJson = (value) => { try { return JSON.parse(value); } catch { return null; } };
  const absolute = (value, base) => { if (!value) return null; try { return new URL(value, base).toString(); } catch { return value; } };
  const selectorOf = (node) => { if (!node?.tagName) return null; if (node.id) return `#${CSS.escape(node.id)}`; const parts = []; let cur = node; let depth = 0; while (cur && cur.nodeType === 1 && depth < 5) { let segment = cur.tagName.toLowerCase(); const klass = compact(cur.className || '').split(/\s+/).filter(Boolean).slice(0, 2); if (klass.length) segment += '.' + klass.map((v) => CSS.escape(v)).join('.'); const parent = cur.parentElement; if (parent) { const siblings = [...parent.children].filter((item) => item.tagName === cur.tagName); if (siblings.length > 1) segment += `:nth-of-type(${siblings.indexOf(cur) + 1})`; } parts.unshift(segment); cur = parent; depth += 1; } return parts.join(' > '); };
  const visible = (node) => { if (!node?.getBoundingClientRect) return false; const rect = node.getBoundingClientRect(); const style = getComputedStyle(node); return rect.width > 6 && rect.height > 6 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || '1') !== 0; };
  const rectOf = (node) => { if (!node?.getBoundingClientRect) return null; const rect = node.getBoundingClientRect(); return { x: +rect.x.toFixed(2), y: +rect.y.toFixed(2), top: +(rect.top + scrollY).toFixed(2), left: +(rect.left + scrollX).toFixed(2), width: +rect.width.toFixed(2), height: +rect.height.toFixed(2) }; };
  const topCounts = (values, limit = 12) => { const counts = new Map(); for (const value of values || []) { const key = compact(value); if (!key) continue; counts.set(key, (counts.get(key) || 0) + 1); } return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([value, count]) => ({ value, count })); };
  const snap = (doc, base, selector) => [...doc.querySelectorAll(selector)].map((node) => ({ html: node.outerHTML, text: clean(node.innerText || node.textContent || ''), links: uniqueBy([...node.querySelectorAll('a[href]')].map((link) => ({ href: absolute(link.getAttribute('href'), base), text: clean(link.innerText || link.textContent || '') })).filter((item) => item.href), (item) => `${item.href}|${item.text}`) }));
  const meta = (doc, selectors) => { for (const selector of selectors) { const node = doc.querySelector(selector); const content = node?.getAttribute('content') || node?.textContent; if (content && clean(content)) return clean(content); } return null; };
  const inferTech = (text) => ({ frameworks: uniq([/__next|_next\/static/.test(text) ? 'Next.js' : null, /__nuxt|_nuxt\//.test(text) ? 'Nuxt' : null, /astro-island|__astro/.test(text) ? 'Astro' : null, /wix|thunderbolt/.test(text) ? 'Wix' : null, /webflow|w-webflow/.test(text) ? 'Webflow' : null, /wp-content|wp-includes/.test(text) ? 'WordPress' : null, /react/.test(text) ? 'React' : null]), libraries: uniq([/gsap|scrolltrigger/.test(text) ? 'GSAP' : null, /lenis/.test(text) ? 'Lenis' : null, /locomotive/.test(text) ? 'Locomotive Scroll' : null, /swiper/.test(text) ? 'Swiper' : null, /splide/.test(text) ? 'Splide' : null, /lottie/.test(text) ? 'Lottie' : null, /three|shader|webgl/.test(text) ? 'Three.js/WebGL' : null, /barba/.test(text) ? 'Barba.js' : null, /howler/.test(text) ? 'Howler' : null]) });
  const extract = (doc, source, pageUrl, rendered) => {
    const baseHref = (() => { const href = doc.querySelector('base[href]')?.getAttribute('href'); if (!href) return pageUrl; try { return new URL(href, pageUrl).toString(); } catch { return pageUrl; } })();
    const links = uniqueBy([...doc.querySelectorAll('a[href]')].map((node) => ({ href: absolute(node.getAttribute('href'), baseHref), text: clean(node.innerText || node.textContent || '').slice(0, 200), title: node.getAttribute('title') || null, target: node.getAttribute('target') || null })).filter((item) => item.href), (item) => `${item.href}|${item.text}|${item.title}|${item.target}`).slice(0, 250);
    const images = uniqueBy([...doc.querySelectorAll('img[src]')].map((node) => ({ src: absolute(node.getAttribute('src'), baseHref), alt: clean(node.getAttribute('alt') || ''), title: clean(node.getAttribute('title') || ''), width: node.getAttribute('width') || null, height: node.getAttribute('height') || null, rect: rendered ? rectOf(node) : null })).filter((item) => item.src), (item) => `${item.src}|${item.alt}|${item.title}`).slice(0, 180);
    const assets = uniqueBy([...[...doc.querySelectorAll('script[src]')].map((node) => ({ kind: 'script', tag: 'script', url: absolute(node.getAttribute('src'), baseHref), type: node.getAttribute('type') || null })), ...[...doc.querySelectorAll('link[href]')].map((node) => { const rel = (node.getAttribute('rel') || '').toLowerCase(); const href = absolute(node.getAttribute('href'), baseHref); const as = node.getAttribute('as') || null; const kind = rel.includes('stylesheet') ? 'css' : rel.includes('preload') && as === 'font' ? 'font' : /\.(woff2?|ttf|otf|eot)(?:[?#].*)?$/i.test(href || '') ? 'font' : 'asset'; return { kind, tag: 'link', url: href, rel: node.getAttribute('rel') || null, as, type: node.getAttribute('type') || null }; }), ...[...doc.querySelectorAll('source[src],video[src],audio[src],iframe[src],object[data]')].map((node) => ({ kind: 'asset', tag: node.tagName.toLowerCase(), url: absolute(node.getAttribute('src') || node.getAttribute('data'), baseHref), type: node.getAttribute('type') || null }))].filter((item) => item.url), (item) => `${item.kind}|${item.url}|${item.tag}|${item.type}`).slice(0, 260);
    const metaTags = [...doc.querySelectorAll('meta')].map((node) => ({ name: node.getAttribute('name') || null, property: node.getAttribute('property') || null, content: node.getAttribute('content') || null }));
    const openGraph = {}; const twitterCards = {};
    for (const tag of metaTags) { if (tag.property?.startsWith('og:')) openGraph[tag.property] = tag.content; const key = tag.name || tag.property; if (key?.startsWith('twitter:')) twitterCards[key] = tag.content; }
    const headings = {}; for (const level of ['h1','h2','h3','h4','h5','h6']) headings[level] = [...doc.querySelectorAll(level)].map((node) => clean(node.innerText || node.textContent || ''));
    const sections = uniqueBy([...doc.querySelectorAll('main,section,article,[data-section],[data-scroll-section],[class*="section"],[class*="hero"],[class*="panel"],[class*="project"]')], (node) => selectorOf(node)).filter((node) => clean(node.innerText || node.textContent || '') || node.querySelector('img,video,canvas')).slice(0, 24).map((node, index) => ({ index, selector: selectorOf(node), tag: node.tagName.toLowerCase(), id: node.id || null, class_name: compact(node.className || '') || null, heading: clean(node.querySelector('h1,h2,h3,h4,h5,h6')?.innerText || node.querySelector('h1,h2,h3,h4,h5,h6')?.textContent || '').slice(0, 180) || null, text_excerpt: clean(node.innerText || node.textContent || '').slice(0, 320), media: { images: node.querySelectorAll('img').length, videos: node.querySelectorAll('video').length, canvas: node.querySelectorAll('canvas').length }, link_count: node.querySelectorAll('a[href]').length, rect: rendered ? rectOf(node) : null }));
    const interactive = rendered ? uniqueBy([...doc.querySelectorAll('a[href],button,[role="button"],summary,[aria-haspopup],[aria-expanded],details,video,audio,canvas,[onclick],[class*="menu"],[class*="modal"],[class*="carousel"],[class*="slider"],[class*="accordion"],[class*="cursor"]')], (node) => selectorOf(node)).map((node) => { const text = clean(node.getAttribute?.('aria-label') || node.getAttribute?.('title') || node.innerText || node.textContent || '').slice(0, 200); const className = clean(node.className || ''); const href = node.getAttribute?.('href') || null; const tag = node.tagName.toLowerCase(); const safeClick = !href && (tag === 'button' || tag === 'summary' || node.getAttribute?.('role') === 'button' || node.getAttribute?.('aria-haspopup') || node.getAttribute?.('aria-expanded') !== null) && node.getAttribute?.('type') !== 'submit'; return { selector: selectorOf(node), tag, label: text, class_name: className || null, href, role: node.getAttribute?.('role') || null, expanded: node.getAttribute?.('aria-expanded') ?? (tag === 'details' ? String(node.open) : null), safe_click: !!safeClick, hover_reactive: /hover|card|project|thumb|tile|cursor/.test((text + ' ' + className).toLowerCase()) || getComputedStyle(node).cursor === 'pointer', visible: visible(node), rect: rectOf(node), purpose: /menu|nav|burger|hamburger/.test((text + ' ' + className).toLowerCase()) ? 'navigation_toggle' : /play|sound|audio/.test((text + ' ' + className).toLowerCase()) ? 'media_control' : /project|work|case/.test((text + ' ' + className).toLowerCase()) ? 'project_link' : 'generic_interactive', hints: uniq(keywords.filter((keyword) => (text + ' ' + className).toLowerCase().includes(keyword))) }; }).filter((item) => item.selector && item.visible).slice(0, 60) : [];
    return { source, page_url: pageUrl, base_href: baseHref, title: clean(doc.title || doc.querySelector('title')?.textContent || ''), meta_description: meta(doc, ['meta[name="description"]']), canonical: absolute(doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '', baseHref), html: { lang: doc.documentElement?.getAttribute('lang') || null, dir: doc.documentElement?.getAttribute('dir') || null }, headings, visible_text: clean(source === 'rendered_dom' ? doc.body?.innerText || '' : doc.body?.textContent || ''), links, images, assets: { all: assets }, sections, interactions: interactive, structure: { header: snap(doc, baseHref, 'header'), nav: snap(doc, baseHref, 'nav, [role="navigation"]'), footer: snap(doc, baseHref, 'footer'), breadcrumbs: snap(doc, baseHref, 'nav[aria-label*="breadcrumb" i], [aria-label*="breadcrumb" i], .breadcrumb, .breadcrumbs, [itemtype*="BreadcrumbList"]') }, seo: { meta_tags: metaTags, open_graph: openGraph, twitter_cards: twitterCards, json_ld: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((node, index) => ({ index, raw: clean(node.textContent || ''), parsed: parseJson(clean(node.textContent || '')) })), robots: meta(doc, ['meta[name="robots"]']) } };
  };
  const rawDoc = rawHtml ? new DOMParser().parseFromString(rawHtml, 'text/html') : null;
  const rendered = extract(document, 'rendered_dom', location.href, true);
  const raw = rawDoc ? extract(rawDoc, 'source_html', sourceUrl, false) : null;
  const resources = (performance.getEntriesByType('resource') || []).map((entry) => ({ name: entry.name, initiatorType: entry.initiatorType || null, duration: +Number(entry.duration || 0).toFixed(2), transferSize: entry.transferSize || 0 }));
  const evidence = [document.documentElement.outerHTML.slice(0, 250000), ...resources.map((entry) => entry.name), ...[...document.querySelectorAll('script[src]')].map((node) => node.getAttribute('src') || '')].join('\n').toLowerCase();
  const tech = inferTech(evidence);
  const sample = [...document.querySelectorAll('body *')].filter(visible).slice(0, 260);
  const styles = { bg: [], fg: [], ff: [], fs: [], sp: [] };
  let blur = 0, blend = 0, glow = 0, sticky = 0, wide = 0, full = 0;
  for (const node of sample) { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') styles.bg.push(style.backgroundColor); if (style.color && style.color !== 'rgba(0, 0, 0, 0)' && style.color !== 'transparent') styles.fg.push(style.color); if (style.fontFamily) styles.ff.push(style.fontFamily.replace(/"/g, '')); if (style.fontSize) styles.fs.push(style.fontSize); if (style.paddingTop && style.paddingTop !== '0px') styles.sp.push(style.paddingTop); if (style.marginBottom && style.marginBottom !== '0px') styles.sp.push(style.marginBottom); if (style.backdropFilter !== 'none' || /blur/i.test(style.filter)) blur += 1; if (style.mixBlendMode && style.mixBlendMode !== 'normal') blend += 1; if (/shadow/i.test(style.boxShadow || '')) glow += 1; if (style.position === 'sticky') sticky += 1; if (node.scrollWidth > node.clientWidth * 1.2 && rect.width > innerWidth * 0.5) wide += 1; }
  for (const section of rendered.sections || []) if ((section.rect?.height || 0) >= innerHeight * 0.85) full += 1;
  const hoverTarget = rendered.interactions.find((item) => item.hover_reactive) || rendered.interactions[0] || null;
  const clickTarget = rendered.interactions.find((item) => item.safe_click) || null;
  const stateBaseline = { overlay_like_elements: [...document.querySelectorAll('body *')].filter((node) => { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return (style.position === 'fixed' || style.position === 'sticky') && rect.width >= innerWidth * 0.75 && rect.height >= innerHeight * 0.35; }).length, modal_like_elements: document.querySelectorAll('dialog,[role="dialog"],[class*="modal"]').length, visible_text_length: clean(document.body?.innerText || '').length, audio_elements: [...document.querySelectorAll('audio')].map((node) => ({ src: node.currentSrc || node.getAttribute('src') || null, paused: node.paused, current_time: +Number(node.currentTime || 0).toFixed(2) })), video_elements: [...document.querySelectorAll('video')].map((node) => ({ src: node.currentSrc || node.getAttribute('src') || null, autoplay: node.autoplay, muted: node.muted, paused: node.paused })), canvas_count: document.querySelectorAll('canvas').length, gate_like_copy: [...document.querySelectorAll('body *')].map((node) => clean(node.textContent || '')).find((text) => /click to enter|tap to enter|enter site|sound on|unmute|start experience|loading/i.test(text)) || null };
  return { rendered_html: document.documentElement.outerHTML, viewport_metrics: { width: innerWidth, height: innerHeight, device_pixel_ratio: devicePixelRatio, scroll_height: Math.max(document.body?.scrollHeight || 0, document.documentElement?.scrollHeight || 0, document.body?.offsetHeight || 0, document.documentElement?.offsetHeight || 0) }, raw, rendered, dom_structure: { sections: rendered.sections, headings: rendered.headings }, seo: rendered.seo, assets_analysis: { dom_assets: rendered.assets, performance_resources: resources.slice(0, 400), performance_fetch_endpoints: uniq(resources.filter((entry) => ['fetch','xmlhttprequest'].includes(entry.initiatorType)).map((entry) => entry.name)).slice(0, 30) }, visual_design: { layout: { main_sections: rendered.sections, fullscreen_sections: full, sticky_elements: sticky, horizontal_scroll_regions: wide, snap_type: [getComputedStyle(document.documentElement).scrollSnapType, getComputedStyle(document.body).scrollSnapType].find((value) => value && value !== 'none') || null, immersive_storytelling_hint: full >= 2 }, palette: { backgrounds: topCounts(styles.bg), text: topCounts(styles.fg) }, typography: { font_families: topCounts(styles.ff), font_sizes: topCounts(styles.fs) }, spacing: { padding_and_margins: topCounts(styles.sp) }, effects: { blur_like_elements: blur, blend_like_elements: blend, glow_like_elements: glow, dark_mode_hint: /dark|theme-dark|data-theme="dark"/i.test(document.documentElement.outerHTML) }, section_screenshots: (rendered.sections || []).slice(0, 6).map((section, index) => ({ name: `section_${String(index + 1).padStart(2, '0')}_${(section.heading || section.tag || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'section'}`, selector: section.selector, clip: { x: Math.max(0, section.rect?.left || 0), y: Math.max(0, section.rect?.top || 0), width: Math.min(section.rect?.width || innerWidth, innerWidth), height: Math.min(section.rect?.height || innerHeight, Math.max(innerHeight, 1400)) } })) }, interactions: { summary: { buttons: document.querySelectorAll('button,[role="button"],.btn,[class*="button"]').length, menus: document.querySelectorAll('nav,[role="navigation"],[aria-haspopup],[class*="menu"]').length, toggles: document.querySelectorAll('[role="switch"],[aria-pressed],[class*="toggle"]').length, tabs: document.querySelectorAll('[role="tab"],[class*="tab"]').length, accordions: document.querySelectorAll('details,summary,[class*="accordion"],[aria-expanded]').length, sliders: document.querySelectorAll('[class*="slider"],[class*="swiper"],.swiper,[class*="carousel"],.splide,.glide').length, modals: document.querySelectorAll('dialog,[role="dialog"],[class*="modal"]').length, overlays: document.querySelectorAll('[class*="overlay"],[class*="backdrop"],[class*="drawer"],[class*="panel"]').length, tooltips: document.querySelectorAll('[role="tooltip"],[class*="tooltip"]').length, loaders: document.querySelectorAll('[class*="loader"],[class*="preload"],[class*="intro"]').length, canvases: document.querySelectorAll('canvas').length, videos: document.querySelectorAll('video').length, audios: document.querySelectorAll('audio').length, custom_cursor_like: document.querySelectorAll('[class*="cursor"],[data-cursor]').length }, interactive_elements: rendered.interactions, hover_target: hoverTarget, click_target: clickTarget }, animations: { css_animated_elements: sample.filter((node) => { const style = getComputedStyle(node); return (style.animationName && style.animationName !== 'none') || (style.transitionDuration && style.transitionDuration !== '0s' && style.transitionDuration !== '0ms'); }).length, animation_examples: sample.map((node) => { const style = getComputedStyle(node); return { selector: selectorOf(node), animation_name: style.animationName, animation_duration: style.animationDuration, transition_property: style.transitionProperty, transition_duration: style.transitionDuration }; }).filter((item) => (item.animation_name && item.animation_name !== 'none') || (item.transition_duration && item.transition_duration !== '0s' && item.transition_duration !== '0ms')).slice(0, 18), patterns: { scroll_trigger_like: /scrolltrigger|locomotive|lenis|data-scroll|sticky/.test(evidence), smooth_scroll_like: /lenis|locomotive|smooth/.test(evidence), page_transition_like: /barba|transition/.test(evidence), marquee_like: /marquee/.test(evidence), horizontal_scroll_like: wide > 0, pinned_like: sticky > 0, infinite_loop_like: /loop|infinite/.test(evidence), motion_keywords: uniq([/parallax/.test(evidence) ? 'parallax' : null, /snap/.test(evidence) ? 'snap' : null, /reveal/.test(evidence) ? 'reveal' : null, /cursor/.test(evidence) ? 'cursor-reactive' : null, /shader|webgl/.test(evidence) ? 'webgl' : null]) } }, tech_inference: { ...tech, rendering_hints: { ssr_like: !!(raw?.visible_text && raw.visible_text.length > rendered.visible_text.length * 0.5), hydration_like: /hydrate|hydration|data-reactroot|astro-island|_next\//.test(evidence), csr_like: raw?.visible_text ? rendered.visible_text.length > raw.visible_text.length * 1.3 : true }, webgl_or_canvas_like: document.querySelectorAll('canvas').length > 0 || /webgl|three|shader/.test(evidence), audio_like: document.querySelectorAll('audio').length > 0 || /howler|audio|sound/.test(evidence), video_like: document.querySelectorAll('video').length > 0, public_endpoints: uniq(resources.filter((entry) => ['fetch','xmlhttprequest'].includes(entry.initiatorType)).map((entry) => entry.name)).slice(0, 30) }, state_baseline: stateBaseline };
}
function extractExpr(rawHtml, url) { return `(${extractPage.toString()})(${JSON.stringify(rawHtml)}, ${JSON.stringify(url)}, ${JSON.stringify(KEYWORDS)})`; }
function stateExpr(label) { return `(() => { const compact = (value) => String(value ?? '').replace(/\\s+/g, ' ').trim(); const overlays = [...document.querySelectorAll('body *')].filter((node) => { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return (style.position === 'fixed' || style.position === 'sticky') && rect.width >= innerWidth * 0.75 && rect.height >= innerHeight * 0.35 && style.display !== 'none' && style.visibility !== 'hidden'; }).slice(0, 20).map((node) => ({ text: compact(node.innerText || node.textContent || '').slice(0, 140), classes: compact(node.className || '').slice(0, 160) })); return { label: ${JSON.stringify(label)}, url: location.href, scroll_y: +Number(scrollY || 0).toFixed(2), visible_text_length: compact(document.body?.innerText || '').length, overlays, dialogs: document.querySelectorAll('dialog,[role=\\"dialog\\"],[class*=\\"modal\\"]').length, expanded: [...document.querySelectorAll('[aria-expanded=\\"true\\"],details[open]')].map((node) => compact(node.innerText || node.textContent || '').slice(0, 120)).filter(Boolean).slice(0, 20), audio: [...document.querySelectorAll('audio')].map((node) => ({ src: node.currentSrc || node.getAttribute('src') || null, paused: node.paused, current_time: +Number(node.currentTime || 0).toFixed(2) })), video: [...document.querySelectorAll('video')].map((node) => ({ src: node.currentSrc || node.getAttribute('src') || null, paused: node.paused, current_time: +Number(node.currentTime || 0).toFixed(2) })) }; })()`; }
function rectExpr(selector) { return `(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) return null; const rect = node.getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height, viewportX: rect.left, viewportY: rect.top }; })()`; }
async function pageState(c, label) { return ev(c, stateExpr(label)); }
async function nodeRect(c, selector) { if (!selector) return null; return ev(c, rectExpr(selector)); }
async function moveMouse(c, x, y) { await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); }
async function clickMouse(c, x, y) { await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); }
function delta(before, after) { const notes = []; if (!before || !after) return notes; if ((after.overlays?.length || 0) > (before.overlays?.length || 0)) notes.push('Aparecieron overlays o paneles fijos tras la interaccion.'); if ((after.dialogs || 0) > (before.dialogs || 0)) notes.push('Se detecto apertura de modal o dialogo.'); if ((after.visible_text_length || 0) > (before.visible_text_length || 0) + 80) notes.push('Aumento el texto visible, posiblemente por contenido expandido o lazy-loaded.'); if ((after.audio || []).some((item) => item.paused === false && item.current_time > 0)) notes.push('Se detecto reproduccion de audio tras la interaccion.'); if ((after.video || []).some((item) => item.paused === false && item.current_time > 0)) notes.push('Se detecto video activo tras la interaccion.'); if ((after.expanded || []).length > (before.expanded || []).length) notes.push('Se activaron elementos expandibles.'); if ((after.url || '') !== (before.url || '')) notes.push(`La URL cambio a ${after.url}.`); if ((after.scroll_y || 0) !== (before.scroll_y || 0)) notes.push(`Scroll observado: ${after.scroll_y}px.`); return notes; }
async function saveSections(c, dir, list) { const saved = []; for (const item of list || []) { const clip = item?.clip && item.clip.width >= 8 && item.clip.height >= 8 ? { x: Math.max(0, item.clip.x), y: Math.max(0, item.clip.y), width: Math.max(8, item.clip.width), height: Math.max(8, item.clip.height), scale: 1 } : null; if (!clip) continue; try { const image = await shot(c, { clip, full: true }); await fs.mkdir(path.join(dir, 'sections'), { recursive: true }); const file = `${item.name}.png`; await fs.writeFile(path.join(dir, 'sections', file), image); saved.push({ name: item.name, selector: item.selector, file: `sections/${file}` }); } catch {} } return saved; }
function split(items, field, allowed) { return { all: items || [], internal: (items || []).filter((item) => classify(item[field], allowed) === 'internal'), external: (items || []).filter((item) => classify(item[field], allowed) === 'external'), other: (items || []).filter((item) => classify(item[field], allowed) === 'other') }; }
function classifyView(view, allowed) { if (!view) return null; view.links = split(view.links || [], 'href', allowed); const all = view.assets?.all || []; const scripts = all.filter((item) => item.kind === 'script'); const css = all.filter((item) => item.kind === 'css'); const fonts = all.filter((item) => item.kind === 'font'); const other = all.filter((item) => !['script','css','font'].includes(item.kind)); view.assets = { all, scripts: split(scripts, 'url', allowed), css: split(css, 'url', allowed), fonts: split(fonts, 'url', allowed), other_assets: split(other, 'url', allowed) }; return view; }
async function discover(origin, allowed) {
  const robotsUrl = new URL('/robots.txt', origin).toString();
  const robots = { url: robotsUrl, status: null, found: false, body: null };
  const pending = []; const seen = new Set(); const sitemaps = []; const urls = new Set();
  try { const response = await fetchText(robotsUrl); robots.status = response.status; robots.found = response.ok; robots.body = response.body; if (response.ok) for (const line of response.body.split(/\r?\n/)) { const match = line.match(/^sitemap:\s*(\S+)/i); if (match) pending.push(match[1]); } } catch (error) { robots.error = String(error.message || error); }
  if (!pending.length) pending.push(new URL('/sitemap.xml', origin).toString());
  while (pending.length) {
    const candidate = norm(pending.shift()); if (!candidate || seen.has(candidate)) continue; seen.add(candidate);
    try {
      const response = await fetchText(candidate); sitemaps.push({ url: candidate, final_url: response.finalUrl, status: response.status, content_type: response.contentType });
      if (!response.ok || !/xml|text/i.test(response.contentType)) continue;
      for (const match of response.body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) {
        const location = String(match[1] || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
        const normalized = norm(location); if (!normalized) continue; const url = new URL(normalized); if (!allowed.has(url.hostname.toLowerCase())) continue; if (/\.xml(?:$|\?)/i.test(url.pathname)) pending.push(normalized); else if (!shouldSkip(normalized, allowed)) urls.add(normalized);
      }
    } catch (error) { sitemaps.push({ url: candidate, error: String(error.message || error) }); }
  }
  return { robots, sitemaps, sitemapPageUrls: [...urls].sort() };
}
function layoutSummary(page) { const sections = page?.visual_design?.layout?.main_sections || []; const full = page?.visual_design?.layout?.fullscreen_sections || 0; const sticky = page?.visual_design?.layout?.sticky_elements || 0; if (!sections.length) return 'Layout no suficientemente estructurado para inferencia automatica.'; const notes = [`${sections.length} secciones principales detectadas`]; if (full) notes.push(`${full} con comportamiento tipo fullscreen`); if (sticky) notes.push(`${sticky} elementos sticky/pinned`); if (page?.visual_design?.layout?.snap_type) notes.push('snap scrolling presente'); return notes.join(', ') + '.'; }
function interactionSummary(page, states) { const s = page?.interactions?.summary || {}; const notes = []; if (s.custom_cursor_like) notes.push('cursor custom o elementos reactivos al puntero'); if (s.canvases) notes.push('canvas/WebGL presente'); if (s.videos) notes.push('video en la experiencia'); if (s.menus) notes.push('navegacion con menus/overlays'); if (s.sliders) notes.push('sliders o carruseles'); if (s.accordions || s.tabs) notes.push('componentes expandibles'); for (const note of uniq((states || []).flatMap((state) => state.notes || [])).slice(0, 4)) notes.push(note); return notes.length ? notes.join('; ') + '.' : 'Sin cambios significativos detectados en hover/click automatizado.'; }
function animationSummary(page) { const p = page?.animations?.patterns || {}; const notes = []; if (p.scroll_trigger_like) notes.push('animaciones ligadas a scroll'); if (p.smooth_scroll_like) notes.push('smooth scroll'); if (p.horizontal_scroll_like) notes.push('secciones con desplazamiento horizontal'); if (p.marquee_like) notes.push('marquee o ticker'); if (p.page_transition_like) notes.push('transiciones de pagina'); if (p.infinite_loop_like) notes.push('loops infinitos'); if (p.pinned_like) notes.push('pinning / sticky'); return notes.length ? notes.join(', ') + '.' : 'No se observaron patrones fuertes de animacion por heuristica.'; }
async function analyzePage(c, url, rawHtml, dir) {
  await viewport(c, DESK); await navigate(c, url);
  const bundle = await ev(c, extractExpr(rawHtml, url));
  const initial = await pageState(c, 'initial');
  const screen = await shot(c); const full = await shot(c, { full: true });
  await fs.writeFile(path.join(dir, 'screenshot.png'), screen); await fs.writeFile(path.join(dir, 'fullpage_screenshot.png'), full); await fs.writeFile(path.join(dir, 'state_01_initial.png'), screen);
  const states = [{ label: 'initial', file: 'state_01_initial.png', metrics: initial, notes: [] }];
  const sections = await saveSections(c, dir, bundle?.visual_design?.section_screenshots || []);
  const height = bundle?.viewport_metrics?.scroll_height || DESK.height;
  if (height > DESK.height * 1.2) { await ev(c, `window.scrollTo({ top: ${Math.round(Math.min(height - DESK.height, height * 0.55))}, behavior: 'auto' }); true;`); await sleep(500); const metrics = await pageState(c, 'scrolled'); const image = await shot(c); await fs.writeFile(path.join(dir, 'state_05_scrolled.png'), image); states.push({ label: 'scrolled', file: 'state_05_scrolled.png', metrics, notes: delta(initial, metrics) }); await ev(c, `window.scrollTo({ top: 0, behavior: 'auto' }); true;`).catch(() => null); await sleep(200); }
  const canvasFallback = !!(bundle?.tech_inference?.webgl_or_canvas_like || bundle?.interactions?.summary?.canvases);
  const hoverSelector = bundle?.interactions?.hover_target?.selector;
  if (hoverSelector) {
    const rect = await nodeRect(c, hoverSelector);
    if (rect && rect.width > 8 && rect.height > 8) {
      const x = Math.max(1, Math.min(DESK.width - 1, rect.viewportX + rect.width / 2));
      const y = Math.max(1, Math.min(DESK.height - 1, rect.viewportY + rect.height / 2));
      await moveMouse(c, x, y);
      await sleep(350);
      const metrics = await pageState(c, 'hover');
      const image = await shot(c);
      await fs.writeFile(path.join(dir, 'state_02_hover.png'), image);
      states.push({ label: 'hover', file: 'state_02_hover.png', target_selector: hoverSelector, metrics, notes: delta(initial, metrics) });
    }
  } else if (canvasFallback) {
    await moveMouse(c, Math.round(DESK.width * 0.62), Math.round(DESK.height * 0.48));
    await sleep(350);
    const metrics = await pageState(c, 'hover');
    const image = await shot(c);
    await fs.writeFile(path.join(dir, 'state_02_hover.png'), image);
    states.push({ label: 'hover', file: 'state_02_hover.png', target_selector: '#webgl canvas fallback', metrics, notes: ['Mouse move sintetico sobre el centro-derecha del viewport para forzar respuesta WebGL/canvas.', ...delta(initial, metrics)] });
  }
  const clickSelector = bundle?.interactions?.click_target?.selector;
  if (clickSelector) {
    const rect = await nodeRect(c, clickSelector);
    if (rect && rect.width > 8 && rect.height > 8) {
      const x = Math.max(1, Math.min(DESK.width - 1, rect.viewportX + rect.width / 2));
      const y = Math.max(1, Math.min(DESK.height - 1, rect.viewportY + rect.height / 2));
      await clickMouse(c, x, y);
      await sleep(700);
      const metrics = await pageState(c, 'clicked');
      const image = await shot(c);
      await fs.writeFile(path.join(dir, 'state_03_clicked.png'), image);
      const notes = delta(initial, metrics);
      states.push({ label: 'clicked', file: 'state_03_clicked.png', target_selector: clickSelector, metrics, notes });
      if ((metrics?.dialogs || 0) > (initial?.dialogs || 0) || (metrics?.overlays?.length || 0) > (initial?.overlays?.length || 0)) {
        await fs.writeFile(path.join(dir, 'state_04_open_panel.png'), image);
        states.push({ label: 'open_panel', file: 'state_04_open_panel.png', target_selector: clickSelector, metrics, notes });
      }
      await c.send('Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 27, key: 'Escape', code: 'Escape' }).catch(() => null);
      await c.send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 27, key: 'Escape', code: 'Escape' }).catch(() => null);
      await sleep(200);
    }
  } else if (canvasFallback) {
    await clickMouse(c, Math.round(DESK.width * 0.5), Math.round(DESK.height * 0.5));
    await sleep(700);
    const metrics = await pageState(c, 'clicked');
    const image = await shot(c);
    await fs.writeFile(path.join(dir, 'state_03_clicked.png'), image);
    states.push({ label: 'clicked', file: 'state_03_clicked.png', target_selector: '#webgl canvas fallback', metrics, notes: ['Click sintetico en centro de viewport para detectar gates o transiciones WebGL/canvas.', ...delta(initial, metrics)] });
  }
  await viewport(c, MOB); await navigate(c, url); const mobileState = await pageState(c, 'mobile'); const mobileEval = await ev(c, extractExpr(rawHtml, url)); const mobileShot = await shot(c); await fs.writeFile(path.join(dir, 'state_06_mobile.png'), mobileShot); states.push({ label: 'mobile', file: 'state_06_mobile.png', metrics: mobileState, notes: delta(initial, mobileState) }); await viewport(c, DESK);
  return { bundle, mobile: { viewport_metrics: mobileEval?.viewport_metrics || null, visual_design: mobileEval?.visual_design || null, interactions: mobileEval?.interactions || null, state: mobileState }, states, sections };
}
async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.rm(path.join(OUT, 'pages'), { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, 'pages'), { recursive: true });
  for (const file of ROOT_FILES) await fs.rm(path.join(OUT, file), { force: true }).catch(() => null);
  const root = await fetchText(START);
  const allowed = allowedHosts(START, root.finalUrl);
  const origin = new URL(root.finalUrl).origin;
  const discovery = await discover(origin, allowed);
  const seeds = uniq([norm(root.finalUrl), ...discovery.sitemapPageUrls].filter(Boolean));
  const queue = seeds.map((url) => ({ url, depth: 0, from: 'seed' }));
  const queued = new Set(seeds); const visited = new Set();
  const pages = []; const aliases = {}; const graph = {}; const assets = new Map();
  const interactionCounts = new Map(), animationCounts = new Map(), colorCounts = new Map(), fontCounts = new Map(), spacingCounts = new Map(), componentCounts = new Map(), frameworks = new Map(), libraries = new Map();
  const browser = await launch();
  try {
    while (queue.length && pages.length < MAX) {
      const current = queue.shift(); const requestedUrl = current?.url;
      if (!requestedUrl || visited.has(requestedUrl) || shouldSkip(requestedUrl, allowed)) continue;
      visited.add(requestedUrl);
      let raw;
      try { raw = await fetchText(requestedUrl); } catch (error) { pages.push({ normalized_url: requestedUrl, fetched_url: requestedUrl, discovery_depth: current.depth, discovered_from: current.from, error: String(error.message || error) }); continue; }
      const finalUrl = norm(raw.finalUrl);
      if (!finalUrl || shouldSkip(finalUrl, allowed) || !/html|xhtml|text\/plain/i.test(raw.contentType)) continue;
      if (finalUrl !== requestedUrl) { aliases[requestedUrl] = finalUrl; if (visited.has(finalUrl)) continue; visited.add(finalUrl); }
      const dir = path.join(OUT, 'pages', folderName(finalUrl)); await fs.mkdir(dir, { recursive: true });
      const analyzed = await analyzePage(browser.c, finalUrl, raw.body, dir);
      const rawView = classifyView(analyzed.bundle?.raw, allowed), rendered = classifyView(analyzed.bundle?.rendered, allowed);
      const discoveredInternal = uniq([...(rawView?.links?.internal || []).map((item) => item.href), ...(rendered?.links?.internal || []).map((item) => item.href)]);
      for (const url of discoveredInternal) if (!queued.has(url) && !visited.has(url) && !shouldSkip(url, allowed)) { queue.push({ url, depth: current.depth + 1, from: finalUrl }); queued.add(url); }
      await w(path.join(dir, 'raw.html'), raw.body); await w(path.join(dir, 'rendered.html'), analyzed.bundle?.rendered_html || ''); await w(path.join(dir, 'text.txt'), `${rendered?.visible_text || rawView?.visible_text || ''}\n`);
      await jw(path.join(dir, 'dom_structure.json'), analyzed.bundle?.dom_structure || {}); await jw(path.join(dir, 'seo.json'), analyzed.bundle?.seo || {}); await jw(path.join(dir, 'assets.json'), analyzed.bundle?.assets_analysis || {}); await jw(path.join(dir, 'interactions.json'), analyzed.bundle?.interactions || {}); await jw(path.join(dir, 'animations.json'), analyzed.bundle?.animations || {}); await jw(path.join(dir, 'visual_design.json'), { ...(analyzed.bundle?.visual_design || {}), layout_summary: layoutSummary(analyzed.bundle) }); await jw(path.join(dir, 'tech_inference.json'), analyzed.bundle?.tech_inference || {}); await jw(path.join(dir, 'states.json'), { desktop_initial: analyzed.bundle?.state_baseline || null, mobile: analyzed.mobile || null, states: analyzed.states || [], interaction_summary: interactionSummary(analyzed.bundle, analyzed.states), animation_summary: animationSummary(analyzed.bundle) });
      const page = { normalized_url: finalUrl, fetched_url: requestedUrl, final_url: raw.finalUrl, page_folder: path.relative(OUT, dir).replace(/\\/g, '/'), fetched_at: new Date().toISOString(), discovery_depth: current.depth, discovered_from: current.from, http: { status: raw.status, content_type: raw.contentType, headers: raw.headers }, files: { page_json: `${path.relative(OUT, path.join(dir, 'page.json')).replace(/\\/g, '/')}`, text_txt: `${path.relative(OUT, path.join(dir, 'text.txt')).replace(/\\/g, '/')}`, raw_html: `${path.relative(OUT, path.join(dir, 'raw.html')).replace(/\\/g, '/')}`, rendered_html: `${path.relative(OUT, path.join(dir, 'rendered.html')).replace(/\\/g, '/')}`, screenshot_png: `${path.relative(OUT, path.join(dir, 'screenshot.png')).replace(/\\/g, '/')}`, fullpage_screenshot_png: `${path.relative(OUT, path.join(dir, 'fullpage_screenshot.png')).replace(/\\/g, '/')}`, dom_structure_json: `${path.relative(OUT, path.join(dir, 'dom_structure.json')).replace(/\\/g, '/')}`, seo_json: `${path.relative(OUT, path.join(dir, 'seo.json')).replace(/\\/g, '/')}`, assets_json: `${path.relative(OUT, path.join(dir, 'assets.json')).replace(/\\/g, '/')}`, interactions_json: `${path.relative(OUT, path.join(dir, 'interactions.json')).replace(/\\/g, '/')}`, animations_json: `${path.relative(OUT, path.join(dir, 'animations.json')).replace(/\\/g, '/')}`, visual_design_json: `${path.relative(OUT, path.join(dir, 'visual_design.json')).replace(/\\/g, '/')}`, tech_inference_json: `${path.relative(OUT, path.join(dir, 'tech_inference.json')).replace(/\\/g, '/')}`, states_json: `${path.relative(OUT, path.join(dir, 'states.json')).replace(/\\/g, '/')}` }, source_labels: { raw: 'source_html', rendered: 'rendered_dom', interaction_states: 'simulated_browser_states' }, raw: rawView, rendered, visual_design: { ...(analyzed.bundle?.visual_design || {}), section_screenshots_saved: analyzed.sections || [] }, interactions: analyzed.bundle?.interactions || null, animations: analyzed.bundle?.animations || null, tech_inference: analyzed.bundle?.tech_inference || null, states: analyzed.states || [], mobile: analyzed.mobile || null, discovered_internal_urls: discoveredInternal, narrative_summary: { layout: layoutSummary(analyzed.bundle), interactions: interactionSummary(analyzed.bundle, analyzed.states), animations: animationSummary(analyzed.bundle) }, limitations: ['Las inferencias de animacion, librerias y estados son heuristicas basadas en DOM, estilos computados, recursos cargados y simulacion automatizada.', 'Canvas, WebGL, audio y transiciones complejas se documentan por evidencia observable, no por reconstruccion exacta del codigo interno.'] };
      await jw(path.join(dir, 'page.json'), page); pages.push(page); graph[finalUrl] = discoveredInternal;
      for (const asset of [...(rawView?.assets?.all || []).map((item) => ({ ...item, source: 'source_html' })), ...(rendered?.assets?.all || []).map((item) => ({ ...item, source: 'rendered_dom' })), ...((analyzed.bundle?.assets_analysis?.performance_resources || []).map((item) => ({ kind: item.initiatorType || 'resource', url: item.name, tag: item.initiatorType || 'resource', source: 'performance_api' })) || [])]) { if (!asset.url) continue; const entry = assets.get(asset.url) || { url: asset.url, classification: classify(asset.url, allowed), kinds: new Set(), sources: new Set(), tags: new Set(), pages: new Set() }; entry.kinds.add(asset.kind || 'asset'); entry.sources.add(asset.source || 'unknown'); entry.pages.add(finalUrl); if (asset.tag) entry.tags.add(asset.tag); assets.set(asset.url, entry); }
      for (const [key, value] of Object.entries(analyzed.bundle?.interactions?.summary || {})) if (value) interactionCounts.set(key, (interactionCounts.get(key) || 0) + Number(value));
      const patterns = analyzed.bundle?.animations?.patterns || {}; for (const key of Object.keys(patterns)) if (patterns[key] && key !== 'motion_keywords') animationCounts.set(key, (animationCounts.get(key) || 0) + 1);
      for (const item of analyzed.bundle?.visual_design?.palette?.backgrounds || []) colorCounts.set(item.value, (colorCounts.get(item.value) || 0) + item.count); for (const item of analyzed.bundle?.visual_design?.palette?.text || []) colorCounts.set(item.value, (colorCounts.get(item.value) || 0) + item.count); for (const item of analyzed.bundle?.visual_design?.typography?.font_families || []) fontCounts.set(item.value, (fontCounts.get(item.value) || 0) + item.count); for (const item of analyzed.bundle?.visual_design?.spacing?.padding_and_margins || []) spacingCounts.set(item.value, (spacingCounts.get(item.value) || 0) + item.count); for (const item of analyzed.bundle?.visual_design?.layout?.main_sections || []) { const name = clean(item.heading || item.tag || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'section'; componentCounts.set(name, (componentCounts.get(name) || 0) + 1); }
      for (const framework of analyzed.bundle?.tech_inference?.frameworks || []) { const entry = frameworks.get(framework) || { pages: new Set() }; entry.pages.add(finalUrl); frameworks.set(framework, entry); }
      for (const library of analyzed.bundle?.tech_inference?.libraries || []) { const entry = libraries.get(library) || { pages: new Set() }; entry.pages.add(finalUrl); libraries.set(library, entry); }
    }
  } finally { await browser.cleanup(); }
  const top = (map, limit = 20) => [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, limit).map(([value, count]) => ({ value, count }));
  const serializeTech = (map) => [...map.entries()].map(([name, value]) => ({ name, pages: [...value.pages].sort() })).sort((a, b) => a.name.localeCompare(b.name));
  const assetsManifest = [...assets.values()].map((entry) => ({ url: entry.url, classification: entry.classification, kinds: [...entry.kinds].sort(), sources: [...entry.sources].sort(), tags: [...entry.tags].sort(), pages: [...entry.pages].sort() })).sort((a, b) => a.url.localeCompare(b.url));
  const interaction_patterns = { generated_at: new Date().toISOString(), pages_analyzed: pages.length, totals: top(interactionCounts, 40), notable_pages: pages.filter((page) => (page.interactions?.summary?.canvases || 0) || (page.interactions?.summary?.custom_cursor_like || 0)).map((page) => ({ url: page.normalized_url, canvases: page.interactions?.summary?.canvases || 0, custom_cursor_like: page.interactions?.summary?.custom_cursor_like || 0, menus: page.interactions?.summary?.menus || 0, sliders: page.interactions?.summary?.sliders || 0 })) };
  const animation_patterns = { generated_at: new Date().toISOString(), pages_analyzed: pages.length, totals: top(animationCounts, 40), notable_pages: pages.filter((page) => Object.values(page.animations?.patterns || {}).some(Boolean)).map((page) => ({ url: page.normalized_url, patterns: page.animations?.patterns || {}, summary: page.narrative_summary?.animations || '' })) };
  const design_system_inference = { generated_at: new Date().toISOString(), pages_analyzed: pages.length, colors: top(colorCounts, 24), fonts: top(fontCounts, 16), spacings: top(spacingCounts, 16), component_like_sections: top(componentCounts, 24), recurring_notes: uniq(pages.flatMap((page) => [page.narrative_summary?.layout || null, page.narrative_summary?.interactions || null])).slice(0, 40) };
  const tech_stack_inference = { generated_at: new Date().toISOString(), pages_analyzed: pages.length, frameworks: serializeTech(frameworks), libraries: serializeTech(libraries), webgl_pages: pages.filter((page) => page.tech_inference?.webgl_or_canvas_like).map((page) => page.normalized_url), audio_pages: pages.filter((page) => page.tech_inference?.audio_like).map((page) => page.normalized_url), video_pages: pages.filter((page) => page.tech_inference?.video_like).map((page) => page.normalized_url) };
  const site_index = { generated_at: new Date().toISOString(), root_url_requested: START, root_url_final: root.finalUrl, primary_origin: origin, allowed_hosts: [...allowed].sort(), max_pages: MAX, discovery, aliases, pages: pages.map((page) => ({ normalized_url: page.normalized_url, final_url: page.final_url, status: page.http?.status || null, rendered_title: page.rendered?.title || null, canonical: page.rendered?.canonical || null, discovery_depth: page.discovery_depth, page_folder: page.page_folder })), stats: { pages_captured: pages.length, unique_assets: assetsManifest.length, internal_edges: Object.values(graph).reduce((sum, list) => sum + list.length, 0) } };
  const pages_csv = [csv(['normalized_url','final_url','status','discovery_depth','rendered_title','rendered_meta_description','canonical','page_folder','internal_links','external_links','images','scripts','css','fonts','other_assets','frameworks','libraries']), ...pages.map((page) => csv([page.normalized_url, page.final_url, page.http?.status || '', page.discovery_depth ?? '', page.rendered?.title || '', page.rendered?.meta_description || '', page.rendered?.canonical || '', page.page_folder, page.rendered?.links?.internal?.length || 0, page.rendered?.links?.external?.length || 0, page.rendered?.images?.length || 0, page.rendered?.assets?.scripts?.all?.length || 0, page.rendered?.assets?.css?.all?.length || 0, page.rendered?.assets?.fonts?.all?.length || 0, page.rendered?.assets?.other_assets?.all?.length || 0, uniq(page.tech_inference?.frameworks || []).join(' | '), uniq(page.tech_inference?.libraries || []).join(' | ') ]))].join('\n');
  const summary = ['# Domain Summary: ' + new URL(root.finalUrl).hostname, '', `- URL inicial solicitada: ${START}`, `- URL final raiz: ${root.finalUrl}`, `- Paginas capturadas: ${pages.length}`, `- Assets unicos registrados: ${assetsManifest.length}`, `- Hosts permitidos: ${[...allowed].sort().join(', ')}`, '', '## Experiencia General', ...pages.slice(0, 12).map((page) => `- ${page.normalized_url}: ${page.narrative_summary?.layout || 'Sin resumen de layout'} ${page.narrative_summary?.interactions || ''}`), '', '## Tecnologia Inferida', ...(tech_stack_inference.frameworks.length ? tech_stack_inference.frameworks.map((item) => `- Framework: ${item.name} en ${item.pages.length} pagina(s).`) : ['- No se detectaron frameworks con alta confianza.']), ...(tech_stack_inference.libraries.length ? tech_stack_inference.libraries.map((item) => `- Libreria: ${item.name} en ${item.pages.length} pagina(s).`) : ['- No se detectaron librerias especializadas con alta confianza.']), '', '## Limitaciones', '- Las detecciones de hover/click son automatizadas y pueden no cubrir todos los estados narrativos del sitio.', '- Canvas, WebGL, audio y shaders se documentan por comportamiento visible, no por extraccion interna del runtime.', '- El analisis mobile se hizo con viewport emulado y no sustituye pruebas manuales en dispositivo real.', ''];
  await jw(path.join(OUT, 'site_index.json'), site_index); await w(path.join(OUT, 'pages.csv'), pages_csv + '\n'); await jw(path.join(OUT, 'assets_manifest.json'), assetsManifest); await jw(path.join(OUT, 'internal_link_graph.json'), graph); await jw(path.join(OUT, 'interaction_patterns.json'), interaction_patterns); await jw(path.join(OUT, 'animation_patterns.json'), animation_patterns); await jw(path.join(OUT, 'design_system_inference.json'), design_system_inference); await jw(path.join(OUT, 'tech_stack_inference.json'), tech_stack_inference); await w(path.join(OUT, 'domain_summary.md'), summary.join('\n') + '\n');
  process.stdout.write(`Mirror avanzado completado: ${pages.length} paginas en ${OUT}\n`);
}
main().catch((error) => { process.stderr.write(`${error.stack || error}\n`); process.exitCode = 1; });
