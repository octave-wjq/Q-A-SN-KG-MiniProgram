const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 18003;
const WEB_ROOT = path.resolve(__dirname);
const DATA_ROOT = path.resolve(__dirname, "..", "data");

const MIME = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

function serve(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/graph.html";
  let filePath;
  if (pathname.startsWith("/data/")) {
    filePath = path.resolve(DATA_ROOT, pathname.slice(6));
  } else {
    filePath = path.resolve(WEB_ROOT, pathname.replace(/^\/+/, ""));
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) { res.writeHead(404); res.end("Not Found"); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });
}

http.createServer(serve).listen(PORT, () => console.log("Graph server on port " + PORT));
