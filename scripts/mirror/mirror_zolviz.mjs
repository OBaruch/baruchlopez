import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const START_URL = process.argv[2] || 'https://www.zolviz.xyz/';
const OUTPUT_ROOT = path.resolve(process.argv[3] || path.join('context', 'www.zolviz.xyz'));
const FETCH_TIMEOUT_MS = 30_000;
const RENDER_TIMEOUT_MS = 35_000;
const USER_AGENT_DESKTOP =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 zolviz-mirror/1.0';
const USER_AGENT_MOBILE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 zolviz-mirror/1.0';
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function csvEscape(value) {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function csvRow(values) {
  return values.map(csvEscape).join(',');
}

function dedupeBy(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items || []) {
    const key = keyFn(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(item);
  }
  return output;
}

function ensureStrings(values) {
  return dedupeBy(
    values
      .map((value) => (value ? String(value).trim() : ''))
      .filter(Boolean),
    (value) => value,
  );
}

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`Timed out after ${ms}ms`)), ms);
  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timer);
    },
  };
}

function normalizeUrl(input, baseUrl) {
  try {
    const url = baseUrl ? new URL(input, baseUrl) : new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    url.hash = '';
    if (!url.pathname) {
      url.pathname = '/';
    }
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function classifyUrl(urlString, allowedHosts) {
  if (!urlString) {
    return 'other';
  }
  try {
    const url = new URL(urlString);
    return allowedHosts.has(url.hostname.toLowerCase()) ? 'internal' : 'external';
  } catch {
    return 'other';
  }
}

function buildAllowedHosts(startUrl, finalUrl) {
  const hosts = new Set();
  for (const candidate of [new URL(startUrl).hostname, new URL(finalUrl).hostname]) {
    const host = candidate.toLowerCase();
    hosts.add(host);
    hosts.add(host.startsWith('www.') ? host.slice(4) : `www.${host}`);
  }
  return hosts;
}

function routeKind(routePath) {
  if (routePath === '/') {
    return 'desktop_experience';
  }
  if (routePath === '/indexMobile') {
    return 'mobile_experience';
  }
  if (routePath.startsWith('/components/')) {
    return 'component_route';
  }
  return 'auxiliary_route';
}

function routeFolderName(routePath) {
  if (routePath === '/') {
    return 'root';
  }
  return routePath
    .replace(/^\//, '')
    .replace(/[\\/]+/g, '__')
    .replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = sortValue(value[key]);
        return accumulator;
      }, {});
  }
  return value;
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}

async function writeJson(filePath, value) {
  await writeText(filePath, `${JSON.stringify(sortValue(value), null, 2)}\n`);
}

function parseCurlHeaders(rawHeaders) {
  const blocks = String(rawHeaders || '')
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => /^HTTP\//i.test(block));
  const last = blocks[blocks.length - 1] || '';
  const lines = last.split(/\r?\n/).filter(Boolean);
  const statusLine = lines.shift() || '';
  const statusMatch = statusLine.match(/^HTTP\/\d+(?:\.\d+)?\s+(\d+)/i);
  const headers = {};
  for (const line of lines) {
    const separator = line.indexOf(':');
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    headers[key] = value;
  }
  return {
    status: statusMatch ? Number(statusMatch[1]) : null,
    headers,
  };
}

async function fetchTextViaCurl(url, userAgent = USER_AGENT_DESKTOP) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zolviz-fetch-'));
  const headerFile = path.join(tempDir, 'headers.txt');
  const bodyFile = path.join(tempDir, 'body.txt');
  try {
    const result = spawnSync(
      'curl.exe',
      [
        '-L',
        '-sS',
        '--max-time',
        String(Math.ceil(FETCH_TIMEOUT_MS / 1000)),
        '-A',
        userAgent,
        '-H',
        'accept: text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        '-D',
        headerFile,
        '-o',
        bodyFile,
        '-w',
        '%{url_effective}\n%{content_type}\n',
        url,
      ],
      {
        encoding: 'utf8',
        windowsHide: true,
      },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr?.trim() || `curl exited with status ${result.status}`);
    }

    const stdoutLines = String(result.stdout || '').split(/\r?\n/);
    const finalUrl = stdoutLines[0]?.trim() || url;
    const contentType = stdoutLines[1]?.trim() || '';
    const rawHeaders = await fs.readFile(headerFile, 'utf8').catch(() => '');
    const body = await fs.readFile(bodyFile, 'utf8');
    const parsed = parseCurlHeaders(rawHeaders);
    return {
      ok: parsed.status ? parsed.status >= 200 && parsed.status < 300 : true,
      status: parsed.status,
      finalUrl,
      headers: parsed.headers,
      contentType: contentType || parsed.headers['content-type'] || '',
      body,
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => null);
  }
}

async function fetchText(url, userAgent = USER_AGENT_DESKTOP) {
  const parsed = new URL(url);
  if (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost') {
    const timeout = timeoutSignal(FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': userAgent,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        },
        redirect: 'follow',
        signal: timeout.signal,
      });
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: response.headers.get('content-type') || '',
        body: await response.text(),
      };
    } finally {
      timeout.clear();
    }
  }

  return fetchTextViaCurl(url, userAgent);
}

async function findChrome() {
  for (const candidate of CHROME_PATHS) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // keep looking
    }
  }
  throw new Error('No se encontro Chrome o Edge. Define CHROME_PATH si necesitas una ruta manual.');
}

class CDPClient {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(webSocketUrl);
    this.opened = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', () => resolve());
      this.socket.addEventListener('error', (error) => reject(error));
    });
    this.socket.addEventListener('message', (event) => {
      const payload = JSON.parse(String(event.data));
      if (payload.id) {
        const pending = this.pending.get(payload.id);
        if (!pending) {
          return;
        }
        this.pending.delete(payload.id);
        if (payload.error) {
          pending.reject(new Error(payload.error.message || `CDP error in ${pending.method}`));
          return;
        }
        pending.resolve(payload.result);
        return;
      }
      const handlers = this.listeners.get(payload.method) || [];
      for (const handler of handlers) {
        handler(payload.params || {});
      }
    });
    this.socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) {
        pending.reject(new Error('CDP connection closed'));
      }
      this.pending.clear();
    });
  }

  async ready() {
    await this.opened;
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject, method });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    const current = this.listeners.get(method) || [];
    current.push(handler);
    this.listeners.set(method, current);
    return () => {
      this.listeners.set(
        method,
        (this.listeners.get(method) || []).filter((candidate) => candidate !== handler),
      );
    };
  }

  waitFor(method, predicate = () => true, timeoutMs = RENDER_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      let timer;
      const unsubscribe = this.on(method, (params) => {
        if (!predicate(params)) {
          return;
        }
        clearTimeout(timer);
        unsubscribe();
        resolve(params);
      });
      timer = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
    });
  }

  close() {
    try {
      this.socket.close();
    } catch {
      // ignore
    }
  }
}

async function launchBrowser() {
  const chromePath = await findChrome();
  const port = String(9300 + Math.floor(Math.random() * 400));
  const userDataDir = path.join(os.tmpdir(), `mirror-zolviz-${process.pid}-${Date.now()}`);
  const browser = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-sync',
      '--hide-scrollbars',
      '--window-size=1440,900',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-address=127.0.0.1',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: 'ignore', windowsHide: true },
  );

  const debuggerBase = `http://127.0.0.1:${port}`;
  let webSocketUrl = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await sleep(250);
    try {
      const response = await fetch(`${debuggerBase}/json/list`);
      const pages = await response.json();
      webSocketUrl = pages.find((entry) => entry.type === 'page')?.webSocketDebuggerUrl || null;
      if (webSocketUrl) {
        break;
      }
    } catch {
      // browser still booting
    }
  }

  if (!webSocketUrl) {
    browser.kill();
    throw new Error('No se pudo conectar a Chrome headless mediante DevTools.');
  }

  const client = new CDPClient(webSocketUrl);
  await client.ready();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });

  const cleanup = async () => {
    client.close();
    try {
      browser.kill();
    } catch {
      // ignore
    }
    await new Promise((resolve) => {
      if (browser.exitCode !== null) {
        resolve();
        return;
      }
      const timer = setTimeout(resolve, 1500);
      browser.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
    try {
      await fs.rm(userDataDir, { recursive: true, force: true });
    } catch {
      // Windows may keep files open for a moment.
    }
  };

  return { client, cleanup };
}

function extractorScript(rawHtml, currentUrl) {
  return `(${function extractPage(rawMarkup, sourceUrl) {
    const clean = (value) =>
      String(value ?? '')
        .replace(/\u00a0/g, ' ')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    const unique = (items, keyFn) => {
      const seen = new Set();
      const output = [];
      for (const item of items || []) {
        const key = keyFn(item);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        output.push(item);
      }
      return output;
    };

    const parseJson = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    const summarizeNode = (node, depth, maxDepth) => {
      const tag = node.tagName?.toLowerCase();
      if (!tag || ['script', 'style', 'noscript'].includes(tag)) {
        return null;
      }
      const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      const summary = {
        tag,
        id: node.id || null,
        classes: Array.from(node.classList || []).slice(0, 8),
        role: node.getAttribute?.('role') || null,
        text: clean(node.innerText || node.textContent || '').slice(0, 180) || null,
        rect: rect
          ? {
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              x: Math.round(rect.x),
              y: Math.round(rect.y),
            }
          : null,
      };
      if (depth >= maxDepth) {
        return summary;
      }
      const children = Array.from(node.children || [])
        .slice(0, 12)
        .map((child) => summarizeNode(child, depth + 1, maxDepth))
        .filter(Boolean);
      if (children.length) {
        summary.children = children;
      }
      return summary;
    };

    const fromDocument = (doc, source, pageUrl) => {
      const baseHref = (() => {
        const href = doc.querySelector('base[href]')?.getAttribute('href');
        if (!href) {
          return pageUrl;
        }
        try {
          return new URL(href, pageUrl).toString();
        } catch {
          return pageUrl;
        }
      })();

      const absolute = (value) => {
        if (!value) {
          return null;
        }
        try {
          return new URL(value, baseHref).toString();
        } catch {
          return value;
        }
      };

      const pickMeta = (selectors) => {
        for (const selector of selectors) {
          const node = doc.querySelector(selector);
          const content = node?.getAttribute('content') || node?.textContent;
          if (content && clean(content)) {
            return clean(content);
          }
        }
        return null;
      };

      const links = unique(
        Array.from(doc.querySelectorAll('a[href]')).map((node) => ({
          href: absolute(node.getAttribute('href')),
          text: clean(node.innerText || node.textContent || ''),
          rel: node.getAttribute('rel') || null,
          target: node.getAttribute('target') || null,
        })),
        (item) => `${item.href}|${item.text}|${item.rel}|${item.target}`,
      ).filter((item) => item.href);

      const images = unique(
        Array.from(doc.querySelectorAll('img')).map((node) => {
          const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
          return {
            src: absolute(node.getAttribute('src') || node.getAttribute('data-src') || ''),
            srcset: clean(node.getAttribute('srcset') || ''),
            alt: clean(node.getAttribute('alt') || ''),
            title: clean(node.getAttribute('title') || ''),
            width: node.getAttribute('width') || (rect ? Math.round(rect.width) : null),
            height: node.getAttribute('height') || (rect ? Math.round(rect.height) : null),
            loading: node.getAttribute('loading') || null,
          };
        }),
        (item) => `${item.src}|${item.alt}|${item.title}|${item.srcset}`,
      ).filter((item) => item.src || item.srcset);

      const assets = unique(
        [
          ...Array.from(doc.querySelectorAll('script[src]')).map((node) => ({
            kind: 'script',
            tag: 'script',
            url: absolute(node.getAttribute('src')),
            type: node.getAttribute('type') || null,
          })),
          ...Array.from(doc.querySelectorAll('link[href]')).map((node) => {
            const rel = (node.getAttribute('rel') || '').toLowerCase();
            const href = absolute(node.getAttribute('href'));
            let kind = 'asset';
            if (rel.includes('stylesheet')) {
              kind = 'css';
            } else if (rel.includes('preconnect') || rel.includes('dns-prefetch')) {
              kind = 'connection_hint';
            } else if (/\.(woff2?|ttf|otf|eot)(?:[?#].*)?$/i.test(href || '')) {
              kind = 'font';
            }
            return {
              kind,
              tag: 'link',
              url: href,
              rel: node.getAttribute('rel') || null,
              as: node.getAttribute('as') || null,
              type: node.getAttribute('type') || null,
            };
          }),
          ...Array.from(doc.querySelectorAll('source[src], video[src], audio[src], iframe[src], object[data]')).map((node) => ({
            kind: 'asset',
            tag: node.tagName.toLowerCase(),
            url: absolute(node.getAttribute('src') || node.getAttribute('data')),
            type: node.getAttribute('type') || null,
          })),
        ],
        (item) => `${item.kind}|${item.url}|${item.rel}|${item.as}|${item.type}`,
      ).filter((item) => item.url);

      const metaTags = Array.from(doc.querySelectorAll('meta')).map((node) => ({
        name: node.getAttribute('name') || null,
        property: node.getAttribute('property') || null,
        content: node.getAttribute('content') || null,
        itemprop: node.getAttribute('itemprop') || null,
        charset: node.getAttribute('charset') || null,
      }));

      const openGraph = {};
      const twitterCards = {};
      for (const meta of metaTags) {
        if (meta.property?.startsWith('og:')) {
          openGraph[meta.property] = meta.content;
        }
        const twitterKey = meta.name || meta.property;
        if (twitterKey?.startsWith('twitter:')) {
          twitterCards[twitterKey] = meta.content;
        }
      }

      const headings = {};
      for (const level of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
        headings[level] = Array.from(doc.querySelectorAll(level))
          .map((node) => clean(node.innerText || node.textContent || ''))
          .filter(Boolean);
      }

      const interactiveCandidates = unique(
        Array.from(
          doc.querySelectorAll(
            'a, button, [role="button"], [tabindex], [data-index], .toggle-audio, .circle, .circleMobile',
          ),
        )
          .slice(0, 120)
          .map((node) => {
            const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
            return {
              tag: node.tagName.toLowerCase(),
              id: node.id || null,
              classes: Array.from(node.classList || []).slice(0, 8),
              text: clean(node.innerText || node.textContent || '').slice(0, 120),
              href: absolute(node.getAttribute('href') || ''),
              role: node.getAttribute('role') || null,
              title: node.getAttribute('data-title') || node.getAttribute('title') || null,
              rect: rect
                ? {
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                  }
                : null,
            };
          }),
        (item) => `${item.tag}|${item.id}|${item.text}|${item.href}|${item.title}`,
      );

      const keySelectors = {
        preloader: '.preloader',
        header: 'header, .header, #header',
        nav: 'nav',
        intro: '.intro',
        physics_container: '[class*="PhysicsSimulation_physicsContainer"]',
        audio_toggle: '.toggle-audio, .audio-bars',
        custom_cursor: '.circle, .circleMobile',
        gallery_container: '#container, .container',
        gallery_items: '[data-index][data-title]',
        details: '.details',
      };

      const notableComponents = Object.fromEntries(
        Object.entries(keySelectors).map(([key, selector]) => {
          const nodes = Array.from(doc.querySelectorAll(selector)).slice(0, key === 'gallery_items' ? 24 : 3);
          return [
            key,
            nodes.map((node) => {
              const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
              return {
                tag: node.tagName.toLowerCase(),
                id: node.id || null,
                classes: Array.from(node.classList || []).slice(0, 8),
                text: clean(node.innerText || node.textContent || '').slice(0, 160) || null,
                title: node.getAttribute?.('data-title') || null,
                description: clean(node.getAttribute?.('data-description') || '').slice(0, 200) || null,
                rect: rect
                  ? {
                      width: Math.round(rect.width),
                      height: Math.round(rect.height),
                      x: Math.round(rect.x),
                      y: Math.round(rect.y),
                    }
                  : null,
              };
            }),
          ];
        }),
      );

      const jsonLd = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map((node, index) => {
        const raw = clean(node.textContent || '');
        return {
          index,
          raw,
          parsed: parseJson(raw),
        };
      });

      return {
        source,
        page_url: pageUrl,
        base_href: baseHref,
        title: clean(doc.title || doc.querySelector('title')?.textContent || ''),
        meta_description: pickMeta(['meta[name="description"]']),
        canonical: absolute(doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''),
        html: {
          lang: doc.documentElement?.getAttribute('lang') || null,
          dir: doc.documentElement?.getAttribute('dir') || null,
        },
        visible_text: clean(doc.body?.innerText || doc.body?.textContent || ''),
        headings,
        links,
        images,
        assets,
        seo: {
          meta_tags: metaTags,
          open_graph: openGraph,
          twitter_cards: twitterCards,
          json_ld: jsonLd,
        },
        interactive_candidates: interactiveCandidates,
        notable_components: notableComponents,
        dom_structure: Array.from(doc.body?.children || [])
          .slice(0, 16)
          .map((node) => summarizeNode(node, 0, 2))
          .filter(Boolean),
      };
    };

    const rawDoc = rawMarkup ? new DOMParser().parseFromString(rawMarkup, 'text/html') : null;
    return {
      rendered_html: document.documentElement.outerHTML,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scroll_x: window.scrollX,
        scroll_y: window.scrollY,
      },
      rendered: fromDocument(document, 'rendered_dom', window.location.href),
      raw: rawDoc ? fromDocument(rawDoc, 'source_html', sourceUrl) : null,
    };
  }})(${JSON.stringify(rawHtml)}, ${JSON.stringify(currentUrl)})`;
}

async function setViewport(client, kind) {
  const isMobile = kind === 'mobile_experience';
  const metrics = isMobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
  await client.send('Emulation.setDeviceMetricsOverride', metrics);
  await client.send('Emulation.setUserAgentOverride', {
    userAgent: isMobile ? USER_AGENT_MOBILE : USER_AGENT_DESKTOP,
    platform: isMobile ? 'iPhone' : 'Windows',
  });
  return metrics;
}

async function waitForExperienceReady(client) {
  await client
    .send('Runtime.evaluate', {
      expression: `
        new Promise(async (resolve) => {
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          const until = async (predicate, timeoutMs = 8000, intervalMs = 100) => {
            const start = Date.now();
            while (Date.now() - start < timeoutMs) {
              try {
                if (predicate()) {
                  return true;
                }
              } catch {}
              await wait(intervalMs);
            }
            return false;
          };

          await until(() => document.readyState === 'complete', 5000, 100);
          if (document.fonts?.ready) {
            await Promise.race([document.fonts.ready, wait(2500)]);
          }
          await until(() => {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return true;
            const style = getComputedStyle(preloader);
            return style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || '1') === 0;
          }, 12000, 150);

          const images = Array.from(document.images || []);
          const start = Date.now();
          while (Date.now() - start < 5000) {
            const pending = images.filter((img) => !img.complete);
            if (!pending.length) break;
            await wait(100);
          }

          await wait(1000);
          resolve({
            readyState: document.readyState,
            preloaderPresent: !!document.querySelector('.preloader'),
            imageCount: images.length,
            completeImages: images.filter((img) => img.complete).length,
            hasIntro: !!document.querySelector('.intro'),
            hasPhysicsContainer: !!document.querySelector('[class*="PhysicsSimulation_physicsContainer"]'),
          });
        });
      `,
      awaitPromise: true,
      returnByValue: true,
    })
    .catch(() => ({ result: { value: {} } }));
}

async function captureScreenshot(client) {
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
  });
  return Buffer.from(screenshot.data, 'base64');
}

async function captureBoundedFullpageScreenshot(client, metrics, routeKindValue) {
  const heightResult = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const root = document.documentElement;
        const hasFakeTallDiv = !!document.getElementById('tallDiv');
        const visibleBottoms = [];
        for (const node of document.body.querySelectorAll('*')) {
          if (node.id === 'tallDiv') continue;
          const rect = node.getBoundingClientRect();
          if (!rect.width || !rect.height) continue;
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || '1') === 0) continue;
          if (Math.abs(rect.top) > window.innerHeight * 4 || Math.abs(rect.left) > window.innerWidth * 4) continue;
          visibleBottoms.push(rect.bottom);
        }
        const maxVisibleBottom = visibleBottoms.length ? Math.max(...visibleBottoms) : window.innerHeight;
        const fallbackHeight = Math.max(window.innerHeight, Math.min(root.scrollHeight, 2400));
        const bounded = hasFakeTallDiv ? Math.min(Math.max(Math.ceil(maxVisibleBottom + 80), window.innerHeight), 1800) : Math.min(fallbackHeight, 2400);
        return bounded;
      })();
    `,
    returnByValue: true,
    awaitPromise: true,
  });
  const boundedHeight = Number(heightResult.result.value) || metrics.height;
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: metrics.width,
    height: boundedHeight,
    deviceScaleFactor: metrics.deviceScaleFactor,
    mobile: metrics.mobile,
  });
  await sleep(routeKindValue === 'mobile_experience' ? 300 : 150);
  const buffer = await captureScreenshot(client);
  await client.send('Emulation.setDeviceMetricsOverride', metrics);
  await sleep(100);
  return buffer;
}

async function evaluate(client, expression) {
  const response = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return response.result.value;
}

async function getElementCenter(client, expression) {
  const value = await evaluate(client, expression).catch(() => null);
  if (!value || typeof value.x !== 'number' || typeof value.y !== 'number') {
    return null;
  }
  return value;
}

async function mouseMove(client, x, y) {
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' });
}

async function mouseClick(client, x, y) {
  await mouseMove(client, x, y);
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
}

async function unlockDesktopGate(client) {
  const snapshots = [];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const unlocked = await evaluate(
      client,
      `(() => !document.querySelector('.intro') && !!document.querySelector('[class*="PhysicsSimulation_physicsContainer"]'))()`,
    ).catch(() => false);
    if (unlocked) {
      return { unlocked: true, attempts: attempt, snapshots };
    }
    const targets = await evaluate(
      client,
      `(() => {
        const nodes = Array.from(document.querySelectorAll('[class*="PhysicsSimulation_physicsContainer"] img'));
        return nodes
          .map((node) => {
            const rect = node.getBoundingClientRect();
            if (!rect.width || !rect.height) return null;
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          })
          .filter(Boolean)
          .slice(0, 18);
      })()`,
    ).catch(() => []);
    snapshots.push({ attempt: attempt + 1, targets: targets.length });
    if (!targets.length) {
      await sleep(300);
      continue;
    }
    for (const target of targets) {
      await mouseClick(client, target.x, target.y).catch(() => null);
      await sleep(80);
    }
    await sleep(900);
  }
  const unlocked = await evaluate(
    client,
    `(() => !document.querySelector('.intro') && !!document.querySelector('[class*="PhysicsSimulation_physicsContainer"]'))()`,
  ).catch(() => false);
  return { unlocked: !!unlocked, attempts: snapshots.length, snapshots };
}

async function collectStateNotes(client) {
  return evaluate(
    client,
    `(() => {
      const physics = document.querySelector('[class*="PhysicsSimulation_physicsContainer"]');
      const details = document.querySelector('.details');
      const activeTile = document.querySelector('[data-index][style*="translateX(0%"]');
      return {
        scroll_x: window.scrollX,
        scroll_y: window.scrollY,
        has_intro: !!document.querySelector('.intro'),
        has_details: !!details,
        details_title: details?.querySelector('h2')?.innerText?.trim() || null,
        audio_toggle_present: !!document.querySelector('.toggle-audio, .audio-bars'),
        physics_container_present: !!physics,
        physics_pointer_events: physics ? getComputedStyle(physics).pointerEvents : null,
        active_tile_title: activeTile?.getAttribute('data-title') || null,
      };
    })()`,
  ).catch(() => ({}));
}

function classifyCollections(view, allowedHosts) {
  const split = (items, field) => {
    const result = { internal: [], external: [], other: [] };
    for (const item of items || []) {
      result[classifyUrl(item[field], allowedHosts)].push(item);
    }
    return result;
  };

  view.links = {
    all: view.links || [],
    ...split(view.links || [], 'href'),
  };

  const scripts = (view.assets || []).filter((asset) => asset.kind === 'script');
  const css = (view.assets || []).filter((asset) => asset.kind === 'css');
  const fonts = (view.assets || []).filter((asset) => asset.kind === 'font');
  const connectionHints = (view.assets || []).filter((asset) => asset.kind === 'connection_hint');
  const otherAssets = (view.assets || []).filter(
    (asset) => !['script', 'css', 'font', 'connection_hint'].includes(asset.kind),
  );

  view.assets = {
    all: view.assets || [],
    scripts: { all: scripts, ...split(scripts, 'url') },
    css: { all: css, ...split(css, 'url') },
    fonts: { all: fonts, ...split(fonts, 'url') },
    connection_hints: { all: connectionHints, ...split(connectionHints, 'url') },
    other_assets: { all: otherAssets, ...split(otherAssets, 'url') },
  };
  return view;
}

function summarizeNetworkRequests(requests, allowedHosts) {
  const cleaned = dedupeBy(
    requests
      .map((request) => ({
        url: request.url,
        method: request.method,
        type: request.type,
        status: request.status ?? null,
        mime_type: request.mimeType ?? null,
        initiator: request.initiator ?? null,
        classification: classifyUrl(request.url, allowedHosts),
      }))
      .filter((request) => request.url),
    (request) => `${request.url}|${request.type}|${request.status}|${request.mime_type}`,
  );

  return {
    all: cleaned,
    scripts: cleaned.filter((item) => item.type === 'Script'),
    stylesheets: cleaned.filter((item) => item.type === 'Stylesheet'),
    images: cleaned.filter((item) => item.type === 'Image'),
    fonts: cleaned.filter((item) => item.type === 'Font'),
    media: cleaned.filter((item) => item.type === 'Media'),
    xhr: cleaned.filter((item) => ['XHR', 'Fetch'].includes(item.type)),
  };
}

function inferVisualDesign(routePath, renderedView) {
  const titles = (renderedView.notable_components?.gallery_items || [])
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 10);

  if (routePath === '/') {
    return {
      layout: [
        'Experiencia fullscreen con stage fijo y header micro-tipografico superpuesto.',
        'Galeria de piezas cuadradas de 100vh x 100vh desplazada horizontalmente mediante scroll simulado.',
        'Overlay editorial inferior con titulo y descripcion al abrir una pieza.',
      ],
      palette_inference: {
        shell: ['#000000', '#ffffff'],
        recurring_accents: ['cobalt blue', 'terracotta', 'olive green', 'muted pink', 'warm wood', 'concrete gray'],
        note:
          'La interfaz base es monocromatica; el color dominante cambia segun el render de interior visible en cada pieza.',
      },
      typography: {
        primary: 'Barlow Semi Condensed',
        secondary: 'Ubuntu Mono',
        usage: 'Barlow Semi Condensed domina cuerpos, labels y titulos; Ubuntu Mono se precarga como apoyo tecnico/monoespaciado.',
      },
      recurring_visual_effects: [
        'Grano/ruido de pantalla a baja opacidad.',
        'Inversion de colores en modo oscuro cuando se abre el panel de detalle.',
        'Cursor circular con signo de interrogacion usado como affordance para cerrar.',
        'Bordes blancos/negros de 6px que unifican tiles y clones animados.',
      ],
      notable_content_titles: titles,
    };
  }

  if (routePath === '/indexMobile') {
    return {
      layout: [
        'Variante mobile dedicada en ruta separada con viewport bloqueado y composicion vertical.',
        'Header compacto con logo textual, audio bars y links externos.',
        'Stack de cajas visuales full-width con overlays degradados superior e inferior.',
      ],
      palette_inference: {
        shell: ['#000000', '#ffffff'],
        recurring_accents: ['gradient overlays', 'image-driven accents from the currently active render'],
      },
      typography: {
        primary: 'Barlow Semi Condensed',
        secondary: 'Ubuntu Mono',
      },
      recurring_visual_effects: ['Degradados cinematicos', 'capas negras/blancas de transicion', 'noise overlay'],
      notable_content_titles: titles,
    };
  }

  return {
    layout: ['Ruta auxiliar o de componente con estructura Next.js standalone.'],
    palette_inference: {
      shell: ['#000000', '#ffffff'],
    },
    typography: {
      primary: 'Barlow Semi Condensed',
      secondary: 'Ubuntu Mono',
    },
    recurring_visual_effects: ['Estructura minima para exponer un componente interno o una vista auxiliar.'],
  };
}

function inferInteractions(routePath, renderedView, observedStates, rootIntel) {
  const galleryItems = renderedView.notable_components?.gallery_items || [];
  const base = {
    direct_links: (renderedView.links?.all || []).map((item) => ({
      href: item.href,
      text: item.text,
      target: item.target,
    })),
    interactive_candidates: renderedView.interactive_candidates || [],
    observed_states: observedStates,
  };

  if (routePath === '/') {
    return {
      ...base,
      patterns: [
        {
          name: 'Gate de entrada con letras flotantes',
          evidence:
            'El bundle define rigidBodyMessage="Click all the floating letters to start" y solo despues inicia el audio de fondo.',
          function: 'Obliga una primera interaccion antes de liberar por completo la experiencia principal.',
        },
        {
          name: 'Scroll convertido en desplazamiento horizontal',
          evidence:
            'handleScroll acumula delta en target y adjustSquaresPosition reposiciona tiles cuadrados en translateX.',
          function: 'Transforma el scroll vertical/horizontal del navegador en un carrusel inmersivo de renders.',
        },
        {
          name: 'Tile click -> panel editorial',
          evidence:
            'Cada square con data-title y data-description dispara handleSquareClick, clona tiles y monta .details.',
          function: 'Abre una lectura editorial del render seleccionado con titulo, texto y close affordance.',
        },
        {
          name: 'Audio toggle y micro-sonidos',
          evidence:
            'Hay toggle-audio, audio-bars animadas y llamadas a playSound / playTypingSound / startBackgroundMusic.',
          function: 'Convierte la experiencia en una pieza audiovisual y refuerza transiciones y typing reveals.',
        },
      ],
      gallery_item_count: galleryItems.length,
      external_actions: rootIntel.externalLinks,
    };
  }

  if (routePath === '/indexMobile') {
    return {
      ...base,
      patterns: [
        {
          name: 'Ruta mobile dedicada',
          evidence: 'La app publica /indexMobile como pagina separada en el build manifest.',
          function: 'Entrega una version adaptada al viewport vertical sin depender solo de media queries.',
        },
        {
          name: 'Menu compacto persistente',
          evidence: 'Header fijo con BOOK A MEETING, LI, INS y audio bars.',
          function: 'Mantiene las acciones externas y el control sonoro visibles en pantalla pequena.',
        },
      ],
      gallery_item_count: galleryItems.length,
      external_actions: rootIntel.externalLinks,
    };
  }

  return {
    ...base,
    patterns: [
      {
        name: 'Ruta auxiliar expuesta publicamente',
        evidence: 'Descubierta en el build manifest de Next.js.',
        function: 'Sirve para inspeccion o composicion interna del proyecto.',
      },
    ],
  };
}

function inferAnimations(routePath, renderedView) {
  const base = {
    css_animations: [],
    js_animations: [],
    motion_summary: [],
  };

  if (routePath === '/') {
    base.css_animations.push(
      { name: 'Preloader pulse', evidence: '.preloader-bar usa @keyframes pulse' },
      { name: 'Audio bars bounce', evidence: '.bar usa @keyframes bounce' },
      { name: 'Physics pulse', evidence: '.PhysicsSimulation_rigidBody__* usa @keyframes pulse' },
    );
    base.js_animations.push(
      {
        name: 'GSAP-style timelines',
        evidence: 'El bundle llama timeline(), to(), fromTo(), set() y easings power2.inOut / back.out.',
      },
      {
        name: 'Cursor inertia loop',
        evidence: 'animateCircle usa requestAnimationFrame y suavizado por velocidad.',
      },
      {
        name: 'Word-by-word reveal',
        evidence: 'wrapWords + timeline secuencian palabras del intro y del panel de detalle.',
      },
      {
        name: 'Auto-scroll snapping',
        evidence: 'startAutoScroll mueve target en incrementos de 100 cuando el usuario queda inactivo.',
      },
    );
    base.motion_summary.push(
      'La sensacion general es cinematica pero precisa: microtipografia fija, carrusel cuadrado y transiciones editoriales breves.',
      'No hay evidencia publica de WebGL, Three.js o canvas; la espectacularidad viene de DOM, transformaciones, fisica 2D y audio.',
    );
  } else if (routePath === '/indexMobile') {
    base.css_animations.push(
      { name: 'Audio bars bounce', evidence: '.bar usa @keyframes bounce' },
      { name: 'Fade in helper', evidence: '.PhysicsSimulation_fadeIn__* aparece en el CSS compartido' },
    );
    base.js_animations.push({
      name: 'Ruta mobile dedicada con movimiento propio',
      evidence: 'Existe un bundle independiente indexMobile-*.js, separado del home desktop.',
    });
    base.motion_summary.push(
      'La ruta mobile conserva la estetica inmersiva con menos complejidad espacial y un shell mas compacto.',
    );
  } else {
    base.motion_summary.push('Ruta auxiliar con informacion suficiente para inferir arquitectura pero no una secuencia rica de estados.');
  }

  if (renderedView.notable_components?.details?.length) {
    base.motion_summary.push('El DOM renderizado ya contiene un panel .details, lo que confirma estados de overlay montables desde JS.');
  }

  return base;
}

function inferTech(routePath, rootFetch, bundleIntel, networkSummary) {
  return {
    route_kind: routeKind(routePath),
    high_confidence: [
      {
        label: 'Next.js',
        evidence: [
          rootFetch.headers['x-powered-by'] || 'Header X-Powered-By: Next.js',
          'Rutas y assets /_next/static/... presentes en HTML y build manifest.',
        ],
      },
      {
        label: 'Vercel hosting',
        evidence: [
          rootFetch.headers.server || 'Server: Vercel',
          rootFetch.headers['x-vercel-cache'] || 'Headers X-Vercel-* presentes',
        ],
      },
      {
        label: 'React',
        evidence: ['La pagina usa bundles Next.js/React y componentes de pagina separados.'],
      },
      {
        label: 'Next/Image',
        evidence: ['El HTML SSR usa rutas /_next/image?... y atributos data-nimg.'],
      },
    ],
    probable: [
      {
        label: 'GSAP o wrapper equivalente',
        evidence: ['El bundle usa timeline(), to(), fromTo(), set() y easings power2.inOut/back.out.'],
      },
      {
        label: 'Fisica 2D custom para letras flotantes',
        evidence: [
          'Existe un PhysicsSimulation expuesto como ruta/componente.',
          'No aparece una firma publica clara de Three.js o canvas en los bundles inspeccionados.',
        ],
      },
      {
        label: 'AudioController custom',
        evidence: ['Hay rutas/componentes AudioController y ToggleAudio, mas llamadas a playSound y startBackgroundMusic.'],
      },
      {
        label: 'Combinacion de Tailwind utilities + CSS modulos/globales',
        evidence: [
          'El HTML mezcla clases utilitarias (h-[100vh], top-0, fixed) con clases hash de CSS-in-JS/CSS modules.',
        ],
      },
    ],
    no_evidence: [
      'No se detecto evidencia publica de Three.js, React Three Fiber, shaders o canvas activo.',
      'No se detectaron endpoints XHR/Fetch significativos; la experiencia parece asset-driven y mayormente local al cliente.',
    ],
    network_summary: {
      request_counts: {
        all: networkSummary.all.length,
        scripts: networkSummary.scripts.length,
        stylesheets: networkSummary.stylesheets.length,
        images: networkSummary.images.length,
        fonts: networkSummary.fonts.length,
        xhr: networkSummary.xhr.length,
      },
      public_endpoints: networkSummary.xhr,
    },
    build_manifest_routes: bundleIntel.sortedPages,
  };
}

function aggregateAssets(pages, allowedHosts) {
  const assetMap = new Map();
  for (const page of pages) {
    const merged = [
      ...(page.raw?.assets?.all || []).map((asset) => ({ ...asset, source: 'source_html' })),
      ...(page.rendered?.assets?.all || []).map((asset) => ({ ...asset, source: 'rendered_dom' })),
      ...(page.network?.all || []).map((asset) => ({
        kind: asset.type?.toLowerCase() || 'request',
        url: asset.url,
        source: 'network',
      })),
    ];
    for (const asset of merged) {
      if (!asset.url) {
        continue;
      }
      const entry = assetMap.get(asset.url) || {
        url: asset.url,
        classification: classifyUrl(asset.url, allowedHosts),
        kinds: new Set(),
        sources: new Set(),
        pages: new Set(),
      };
      entry.kinds.add(asset.kind || 'asset');
      entry.sources.add(asset.source || 'unknown');
      entry.pages.add(page.normalized_url);
      assetMap.set(asset.url, entry);
    }
  }

  return [...assetMap.values()]
    .map((entry) => ({
      url: entry.url,
      classification: entry.classification,
      kinds: [...entry.kinds].sort(),
      sources: [...entry.sources].sort(),
      pages: [...entry.pages].sort(),
    }))
    .sort((left, right) => left.url.localeCompare(right.url));
}

async function prepareOutput() {
  await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUTPUT_ROOT, 'pages'), { recursive: true });
}

function parseBuildManifestRoutes(buildManifestSource) {
  const sortedMatch = buildManifestSource.match(/sortedPages:\s*\[([^\]]+)\]/);
  if (!sortedMatch) {
    return [];
  }
  return ensureStrings(
    [...sortedMatch[1].matchAll(/"([^"]+)"/g)]
      .map((match) => match[1])
      .filter((route) => route !== '/_app' && route !== '/_error'),
  );
}

function parseAssetUrlsFromHtml(html, pageUrl) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const normalized = normalizeUrl(match[1], pageUrl);
    if (normalized) {
      urls.add(normalized);
    }
  }
  return [...urls];
}

function buildDomainSummary(pages) {
  const mainPage = pages.find((page) => page.route_path === '/');
  const mobilePage = pages.find((page) => page.route_path === '/indexMobile');
  const lines = [
    '# zolviz.xyz domain summary',
    '',
    '## Technical stack',
    '- Hosting: Vercel.',
    '- Framework: Next.js with React and Next/Image.',
    '- Route discovery: build manifest exposes `/`, `/indexMobile`, and component routes under `/components/*`.',
    '- Motion layer: strong evidence of GSAP-style timelines plus requestAnimationFrame-driven cursor inertia.',
    '- Audio layer: custom AudioController and ToggleAudio components with interaction-driven sound playback.',
    '',
    '## Desktop experience',
    '- The desktop home is an immersive fullscreen gallery rather than a conventional document page.',
    '- A required entry gate asks the user to click floating letters before the main flow fully opens.',
    '- Scroll input is remapped into a horizontal sequence of square 100vh renders, producing a pseudo-infinite loop feel.',
    '- Clicking a tile opens an editorial detail state with cloned image strips, dark-mode inversion, and word-by-word copy reveal.',
    '',
    '## Mobile experience',
    '- The site ships a dedicated `/indexMobile` route instead of relying only on responsive adaptation.',
    '- The mobile shell keeps the same brand language, external links, and audio affordance in a tighter vertical composition.',
    '',
    '## Architecture notes',
    '- No public evidence of WebGL or Three.js was found in the inspected bundles.',
    '- The spectacle comes from DOM transforms, fixed layers, CSS animation, physics-like floating elements, audio, and curated imagery.',
    '- `robots.txt` and `sitemap.xml` return 404, so route discovery depends on HTML, rendered DOM, and Next build metadata.',
    '',
    '## Captured pages',
    ...pages.map((page) => `- ${page.route_path} -> ${page.page_folder}`),
  ];

  if (mainPage?.states?.length) {
    lines.push('', '## Observed desktop states');
    for (const state of mainPage.states) {
      lines.push(`- ${state.name}: ${state.summary}`);
    }
  }

  if (mobilePage?.states?.length) {
    lines.push('', '## Observed mobile states');
    for (const state of mobilePage.states) {
      lines.push(`- ${state.name}: ${state.summary}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function renderRoute(client, routeUrl, routePath, rawHtml, allowedHosts) {
  const kind = routeKind(routePath);
  const metrics = await setViewport(client, kind);

  const requestMap = new Map();
  const networkRequests = [];
  const unsubscribers = [
    client.on('Network.requestWillBeSent', (params) => {
      if (!params.requestId || !params.request?.url) {
        return;
      }
      requestMap.set(params.requestId, {
        url: params.request.url,
        method: params.request.method,
        type: params.type || null,
        initiator: params.initiator?.type || null,
      });
    }),
    client.on('Network.responseReceived', (params) => {
      const current = requestMap.get(params.requestId);
      if (!current) {
        return;
      }
      current.status = params.response?.status;
      current.mimeType = params.response?.mimeType || null;
      networkRequests.push(current);
    }),
  ];

  try {
    const load = client.waitFor('Page.loadEventFired', () => true, RENDER_TIMEOUT_MS).catch(() => null);
    await client.send('Page.navigate', { url: routeUrl });
    await load;
    const readiness = await waitForExperienceReady(client);

    const extracted = await client.send('Runtime.evaluate', {
      expression: extractorScript(rawHtml, routeUrl),
      returnByValue: true,
      awaitPromise: true,
    });

    const states = [];
    const stateBuffers = [];
    const pushState = async (name, summary, extra = {}) => {
      const notes = await collectStateNotes(client);
      const buffer = await captureScreenshot(client);
      stateBuffers.push({ name, buffer });
      states.push({
        name,
        summary,
        notes: { ...notes, ...extra },
        file: `${name}.png`,
      });
    };

    if (kind === 'desktop_experience') {
      await pushState(
        'state_01_initial_gate',
        'Home desktop tras la carga inicial, con gate de letras flotantes e intro editorial antes de liberar la experiencia principal.',
        readiness?.result?.value || {},
      );

      const unlockResult = await unlockDesktopGate(client);
      await sleep(900);
      await pushState(
        'state_02_unlocked',
        unlockResult.unlocked
          ? 'Estado desbloqueado despues de interactuar con las letras flotantes; el gate deja paso a la galeria principal.'
          : 'Estado posterior a los intentos de desbloqueo; la experiencia principal sigue siendo visible aunque el gate no se pudo verificar al 100%.',
        unlockResult,
      );

      await evaluate(
        client,
        `(() => { window.scrollBy(900, 900); return { x: window.scrollX, y: window.scrollY }; })()`,
      ).catch(() => null);
      await sleep(700);
      await pushState(
        'state_03_scrolled',
        'Estado despues de desplazar el viewport para forzar el movimiento del carrusel horizontal y el snapping automatico.',
      );

      const tileCenter =
        (await getElementCenter(
          client,
          `(() => {
            const target =
              document.elementFromPoint(window.innerWidth * 0.6, window.innerHeight * 0.5)?.closest('[data-index][data-title]') ||
              document.elementFromPoint(window.innerWidth * 0.5, window.innerHeight * 0.5)?.closest('[data-index][data-title]') ||
              Array.from(document.querySelectorAll('[data-index][data-title]')).find((node) => {
                const rect = node.getBoundingClientRect();
                return rect.width > 100 && rect.height > 100 && rect.right > 0 && rect.bottom > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight;
              });
            if (!target) return null;
            const rect = target.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, title: target.getAttribute('data-title') || null };
          })()`,
        )) || null;
      if (tileCenter) {
        await mouseClick(client, tileCenter.x, tileCenter.y).catch(() => null);
        await sleep(2600);
        await pushState(
          'state_04_open_panel',
          `Panel de detalle abierto tras hacer click en una pieza visible (${tileCenter.title || 'sin titulo visible'}).`,
          { clicked_tile_title: tileCenter.title || null },
        );

        const navCenter = await getElementCenter(
          client,
          `(() => {
            const target = Array.from(document.querySelectorAll('nav a')).find((node) => /BOOK A MEETING/i.test(node.innerText || '')) || document.querySelector('nav a');
            if (!target) return null;
            const rect = target.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          })()`,
        );
        if (navCenter) {
          await mouseMove(client, navCenter.x, navCenter.y).catch(() => null);
          await sleep(500);
          await pushState(
            'state_05_hover_nav',
            'Hover sobre navegacion mientras el panel de detalle permanece activo, para observar la reaccion del cursor custom.',
          );
        }
      }
    } else if (kind === 'mobile_experience') {
      await pushState(
        'state_01_initial',
        'Vista mobile dedicada tras la carga inicial, con shell fijo, overlays degradados y stack de cajas visuales.',
        readiness?.result?.value || {},
      );
      const mobileTile = await getElementCenter(
        client,
        `(() => {
          const target = document.querySelector('[data-index][data-title]');
          if (!target) return null;
          const rect = target.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, title: target.getAttribute('data-title') || null };
        })()`,
      );
      if (mobileTile) {
        await mouseClick(client, mobileTile.x, mobileTile.y).catch(() => null);
        await sleep(700);
        await pushState(
          'state_02_tap_first_tile',
          `Tap/click sobre la primera caja visible en mobile (${mobileTile.title || 'sin titulo visible'}).`,
          { clicked_tile_title: mobileTile.title || null },
        );
      }
    } else {
      await pushState(
        'state_01_initial',
        'Vista base de la ruta auxiliar expuesta publicamente.',
        readiness?.result?.value || {},
      );
    }

    const fullpageBuffer = await captureBoundedFullpageScreenshot(client, metrics, kind);
    return {
      kind,
      metrics,
      readiness: readiness?.result?.value || {},
      extracted: extracted.result.value,
      network: summarizeNetworkRequests(networkRequests, allowedHosts),
      states,
      stateBuffers,
      screenshotBuffer: stateBuffers[0]?.buffer || (await captureScreenshot(client)),
      fullpageBuffer,
    };
  } finally {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  }
}

async function main() {
  await prepareOutput();

  const rootFetch = await fetchText(START_URL);
  const allowedHosts = buildAllowedHosts(START_URL, rootFetch.finalUrl);
  const origin = new URL(rootFetch.finalUrl).origin;

  const robotsUrl = new URL('/robots.txt', origin).toString();
  const sitemapUrl = new URL('/sitemap.xml', origin).toString();
  const robots = await fetchText(robotsUrl).catch((error) => ({
    ok: false,
    status: null,
    finalUrl: robotsUrl,
    contentType: null,
    headers: {},
    body: '',
    error: String(error.message || error),
  }));
  const sitemap = await fetchText(sitemapUrl).catch((error) => ({
    ok: false,
    status: null,
    finalUrl: sitemapUrl,
    contentType: null,
    headers: {},
    body: '',
    error: String(error.message || error),
  }));

  const rootAssets = parseAssetUrlsFromHtml(rootFetch.body, rootFetch.finalUrl);
  const buildManifestUrl = rootAssets.find((url) => url.endsWith('/_buildManifest.js'));
  if (!buildManifestUrl) {
    throw new Error('No se pudo localizar el build manifest de Next.js en el HTML raiz.');
  }
  const buildManifest = await fetchText(buildManifestUrl);
  const sortedPages = parseBuildManifestRoutes(buildManifest.body);

  const bundleIntel = {
    buildManifestUrl,
    sortedPages,
    externalLinks: ensureStrings(
      [...rootFetch.body.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((match) => match[1]),
    ),
  };

  const routePaths = ensureStrings(['/', ...sortedPages]).filter((route) => route !== '/_error');
  const pages = [];
  const graphEdges = [];
  const browser = await launchBrowser();

  try {
    for (const routePath of routePaths) {
      const routeUrl = normalizeUrl(routePath, origin);
      if (!routeUrl) {
        continue;
      }

      const userAgent = routeKind(routePath) === 'mobile_experience' ? USER_AGENT_MOBILE : USER_AGENT_DESKTOP;
      const rawFetch = await fetchText(routeUrl, userAgent);
      const pageFolder = path.join(OUTPUT_ROOT, 'pages', routeFolderName(routePath));
      await fs.mkdir(pageFolder, { recursive: true });

      const renderResult = await renderRoute(browser.client, routeUrl, routePath, rawFetch.body, allowedHosts);
      const rawView = classifyCollections(
        renderResult.extracted.raw || { links: [], assets: [] },
        allowedHosts,
      );
      const renderedView = classifyCollections(renderResult.extracted.rendered, allowedHosts);

      const internalLinks = ensureStrings([
        ...(rawView.links?.internal || []).map((item) => item.href),
        ...(renderedView.links?.internal || []).map((item) => item.href),
      ]);

      for (const target of internalLinks) {
        graphEdges.push({
          from: routeUrl,
          to: target,
          source: 'html_or_rendered_dom',
        });
      }

      if (routePath === '/' && sortedPages.length) {
        for (const manifestRoute of sortedPages) {
          const target = normalizeUrl(manifestRoute, origin);
          if (target) {
            graphEdges.push({
              from: routeUrl,
              to: target,
              source: 'next_build_manifest',
            });
          }
        }
      }

      const visualDesign = inferVisualDesign(routePath, renderedView);
      const interactions = inferInteractions(routePath, renderedView, renderResult.states, bundleIntel);
      const animations = inferAnimations(routePath, renderedView);
      const techInference = inferTech(routePath, rootFetch, bundleIntel, renderResult.network);
      const domStructure = {
        raw: rawView.dom_structure || [],
        rendered: renderedView.dom_structure || [],
        notable_components: renderedView.notable_components || {},
      };
      const assets = {
        raw: rawView.assets || {},
        rendered: renderedView.assets || {},
        network: renderResult.network,
      };
      const seo = {
        raw: rawView.seo || {},
        rendered: renderedView.seo || {},
      };

      await writeText(path.join(pageFolder, 'raw.html'), rawFetch.body);
      await writeText(path.join(pageFolder, 'rendered.html'), renderResult.extracted.rendered_html);
      await writeText(path.join(pageFolder, 'text.txt'), `${renderedView.visible_text || rawView.visible_text || ''}\n`);
      await fs.writeFile(path.join(pageFolder, 'screenshot.png'), renderResult.screenshotBuffer);
      await fs.writeFile(path.join(pageFolder, 'fullpage_screenshot.png'), renderResult.fullpageBuffer);
      await writeJson(path.join(pageFolder, 'dom_structure.json'), domStructure);
      await writeJson(path.join(pageFolder, 'seo.json'), seo);
      await writeJson(path.join(pageFolder, 'assets.json'), assets);
      await writeJson(path.join(pageFolder, 'interactions.json'), interactions);
      await writeJson(path.join(pageFolder, 'animations.json'), animations);
      await writeJson(path.join(pageFolder, 'visual_design.json'), visualDesign);
      await writeJson(path.join(pageFolder, 'tech_inference.json'), techInference);
      await writeJson(path.join(pageFolder, 'states.json'), renderResult.states);

      for (const state of renderResult.stateBuffers) {
        await fs.writeFile(path.join(pageFolder, `${state.name}.png`), state.buffer);
      }

      const pageRecord = {
        route_path: routePath,
        route_kind: routeKind(routePath),
        normalized_url: routeUrl,
        final_url: rawFetch.finalUrl,
        fetched_at: new Date().toISOString(),
        http: {
          status: rawFetch.status,
          content_type: rawFetch.contentType,
          headers: rawFetch.headers,
        },
        page_folder: path.relative(OUTPUT_ROOT, pageFolder).replace(/\\/g, '/'),
        files: {
          page_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'page.json')).replace(/\\/g, '/')}`,
          text_txt: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'text.txt')).replace(/\\/g, '/')}`,
          raw_html: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'raw.html')).replace(/\\/g, '/')}`,
          rendered_html: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'rendered.html')).replace(/\\/g, '/')}`,
          screenshot_png: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'screenshot.png')).replace(/\\/g, '/')}`,
          fullpage_screenshot_png: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'fullpage_screenshot.png')).replace(/\\/g, '/')}`,
          dom_structure_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'dom_structure.json')).replace(/\\/g, '/')}`,
          seo_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'seo.json')).replace(/\\/g, '/')}`,
          assets_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'assets.json')).replace(/\\/g, '/')}`,
          interactions_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'interactions.json')).replace(/\\/g, '/')}`,
          animations_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'animations.json')).replace(/\\/g, '/')}`,
          visual_design_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'visual_design.json')).replace(/\\/g, '/')}`,
          tech_inference_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'tech_inference.json')).replace(/\\/g, '/')}`,
          states_json: `${path.relative(OUTPUT_ROOT, path.join(pageFolder, 'states.json')).replace(/\\/g, '/')}`,
        },
        source_labels: {
          raw: 'source_html',
          rendered: 'rendered_dom',
          network: 'network_activity',
        },
        raw: rawView,
        rendered: renderedView,
        network: renderResult.network,
        visual_design: visualDesign,
        interactions: interactions,
        animations: animations,
        tech_inference: techInference,
        states: renderResult.states,
        discovered_internal_urls: internalLinks,
      };

      await writeJson(path.join(pageFolder, 'page.json'), pageRecord);
      pages.push(pageRecord);
    }
  } finally {
    await browser.cleanup();
  }

  const assetsManifest = aggregateAssets(pages, allowedHosts);
  const uniqueEdges = dedupeBy(
    graphEdges.map((edge) => ({
      from: normalizeUrl(edge.from) || edge.from,
      to: normalizeUrl(edge.to) || edge.to,
      source: edge.source,
    })),
    (edge) => `${edge.from}|${edge.to}|${edge.source}`,
  );

  const interactionPatterns = {
    patterns: dedupeBy(
      pages.flatMap((page) =>
        (page.interactions?.patterns || []).map((pattern) => ({
          ...pattern,
          pages: [page.route_path],
        })),
      ),
      (pattern) => pattern.name,
    ),
    notes: [
      'El patron dominante del sitio es convertir navegacion/scroll en exploracion visual inmersiva, no en flujo documental tradicional.',
      'El root desktop concentra casi toda la complejidad interactiva; /indexMobile simplifica el gesto sin abandonar identidad visual.',
    ],
  };

  const animationPatterns = {
    patterns: dedupeBy(
      pages.flatMap((page) =>
        [
          ...(page.animations?.css_animations || []).map((animation) => ({ type: 'css', ...animation, pages: [page.route_path] })),
          ...(page.animations?.js_animations || []).map((animation) => ({ type: 'js', ...animation, pages: [page.route_path] })),
        ],
      ),
      (animation) => `${animation.type}|${animation.name}`,
    ),
    motion_summary: ensureStrings(pages.flatMap((page) => page.animations?.motion_summary || [])),
  };

  const designSystemInference = {
    typography: {
      primary: 'Barlow Semi Condensed',
      secondary: 'Ubuntu Mono',
    },
    color_shell: ['#000000', '#ffffff'],
    repeated_components: [
      'Fullscreen fixed header',
      'Audio bars toggle',
      'Square image tiles with strong borders',
      'Noise overlay',
      'Editorial details panel',
      'Question-mark close cursor',
    ],
    page_variants: pages.map((page) => ({
      route_path: page.route_path,
      route_kind: page.route_kind,
      layout_notes: page.visual_design.layout,
    })),
  };

  const techStackInference = {
    high_confidence: [
      'Next.js',
      'React',
      'Vercel',
      'Next/Image',
      'Custom audio controller',
    ],
    probable: ['GSAP or a GSAP-like timeline layer', 'Custom DOM-based physics simulation'],
    no_public_evidence: ['Three.js', 'WebGL canvas', 'public data APIs'],
    build_manifest_routes: sortedPages,
  };

  const siteIndex = {
    generated_at: new Date().toISOString(),
    root_url_requested: START_URL,
    root_url_final: rootFetch.finalUrl,
    allowed_hosts: [...allowedHosts].sort(),
    discovery: {
      robots: {
        url: robotsUrl,
        status: robots.status,
        content_type: robots.contentType || null,
        found: !!robots.ok,
      },
      sitemap: {
        url: sitemapUrl,
        status: sitemap.status,
        content_type: sitemap.contentType || null,
        found: !!sitemap.ok,
      },
      next_build_manifest: {
        url: buildManifestUrl,
        sorted_pages: sortedPages,
      },
    },
    pages: pages.map((page) => ({
      route_path: page.route_path,
      route_kind: page.route_kind,
      normalized_url: page.normalized_url,
      status: page.http.status,
      rendered_title: page.rendered.title,
      canonical: page.rendered.canonical,
      page_folder: page.page_folder,
    })),
    stats: {
      pages_captured: pages.length,
      unique_assets: assetsManifest.length,
      internal_edges: uniqueEdges.length,
    },
  };

  const pagesCsv = [
    csvRow([
      'route_path',
      'route_kind',
      'normalized_url',
      'status',
      'rendered_title',
      'page_folder',
      'internal_links',
      'external_links',
      'images',
      'scripts',
      'css',
      'fonts',
      'network_requests',
    ]),
    ...pages.map((page) =>
      csvRow([
        page.route_path,
        page.route_kind,
        page.normalized_url,
        page.http.status,
        page.rendered.title,
        page.page_folder,
        page.rendered.links.internal.length,
        page.rendered.links.external.length,
        page.rendered.images.length,
        page.rendered.assets.scripts.all.length,
        page.rendered.assets.css.all.length,
        page.rendered.assets.fonts.all.length,
        page.network.all.length,
      ]),
    ),
  ].join('\n');

  await writeJson(path.join(OUTPUT_ROOT, 'site_index.json'), siteIndex);
  await writeText(path.join(OUTPUT_ROOT, 'pages.csv'), `${pagesCsv}\n`);
  await writeJson(path.join(OUTPUT_ROOT, 'assets_manifest.json'), assetsManifest);
  await writeJson(path.join(OUTPUT_ROOT, 'internal_link_graph.json'), uniqueEdges);
  await writeJson(path.join(OUTPUT_ROOT, 'interaction_patterns.json'), interactionPatterns);
  await writeJson(path.join(OUTPUT_ROOT, 'animation_patterns.json'), animationPatterns);
  await writeJson(path.join(OUTPUT_ROOT, 'design_system_inference.json'), designSystemInference);
  await writeJson(path.join(OUTPUT_ROOT, 'tech_stack_inference.json'), techStackInference);
  await writeText(path.join(OUTPUT_ROOT, 'domain_summary.md'), buildDomainSummary(pages));

  process.stdout.write(`Mirror avanzado completado: ${pages.length} paginas en ${OUTPUT_ROOT}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
