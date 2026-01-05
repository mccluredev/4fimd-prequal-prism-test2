const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL and remove query string
  let filePath = '.' + req.url.split('?')[0];

  // Default to index.html for root and directories
  if (filePath === './' || filePath.endsWith('/')) {
    filePath = filePath + 'index.html';
  }

  // Resolve the absolute path
  const absolutePath = path.resolve(filePath);
  console.log(`Resolved path: ${absolutePath}`);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        console.error(`Server error: ${error.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}/`);
  console.log(`\n🚀 Open your browser and navigate to: http://localhost:${PORT}\n`);
});
