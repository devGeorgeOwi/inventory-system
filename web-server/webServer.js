const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;
    
    console.log(`📄 ${req.method} ${url}`);
    
    // Handle root and index.html
    if (url === '/' || url === '/index.html') {
        serveFile('index.html', 200, res);
    }
    // Handle API test page
    else if (url === '/test-api.html' || url === '/test-api') {
        serveFile('test-api.html', 200, res);
    }
    // Handle any other .html file → 404
    else if (url.endsWith('.html')) {
        serveFile('404.html', 404, res);
    }
    // Everything else
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }
});

function serveFile(filename, statusCode, res) {
    const filePath = path.join(PUBLIC_DIR, filename);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(`❌ Error reading ${filename}:`, err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        
        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(content);
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Web Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${PUBLIC_DIR}`);
    console.log('\n📋 Available Pages:');
    console.log(`  http://localhost:${PORT}/              - Home page`);
    console.log(`  http://localhost:${PORT}/index.html    - Student profile`);
    console.log(`  http://localhost:${PORT}/test-api.html - API test interface`);
    console.log(`  http://localhost:${PORT}/any-page.html - Custom 404 page`);
});