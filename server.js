

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Detect the port cPanel assigns dynamically, fallback to 3000 for local testing
const port = process.env.PORT || 3000;
const dev = false; // Forces production layout explicitly
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Let cPanel's process controller proxy incoming requests smoothly
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);
});
