const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const WEB_ROOT = path.resolve(__dirname);
const DATA_ROOT = path.resolve(__dirname, '..', 'data');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendError(res, statusCode, message) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function isPathInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function resolveFilePath(urlPathname) {
  let pathname = decodeURIComponent(urlPathname || '/');

  if (pathname === '/') {
    pathname = '/index.html';
  }

  if (pathname.startsWith('/data/')) {
    const relPath = pathname.slice('/data/'.length);
    const filePath = path.resolve(DATA_ROOT, relPath);
    if (!isPathInside(DATA_ROOT, filePath) && filePath !== DATA_ROOT) {
      return null;
    }
    return filePath;
  }

  const relPath = pathname.replace(/^\/+/, '');
  const filePath = path.resolve(WEB_ROOT, relPath);
  if (!isPathInside(WEB_ROOT, filePath) && filePath !== WEB_ROOT) {
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendError(res, 405, 'Method Not Allowed');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = resolveFilePath(url.pathname);

  if (!filePath) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      sendError(res, 404, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        sendError(res, 500, 'Internal Server Error');
      } else {
        res.destroy();
      }
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
  console.log(`Serving web root: ${WEB_ROOT}`);
  console.log(`Serving data root: ${DATA_ROOT} (mapped from /data/*)`);
});
