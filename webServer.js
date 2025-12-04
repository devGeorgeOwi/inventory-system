// Import built-in Node.js modules ( np frameworks)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    console.log(`\n=== NEW REQUEST: ${req.method} ${req.url} ===`);
    
    // Normalize URL - remove query strings
    const url = req.url.split('?')[0];
    
    // Determine which file to serve and what status code
    let filename, statusCode;
    
    if (url === '/' || url === '/index.html') {
        filename = 'index.html';
        statusCode = 200;
        console.log('✅ Serving: index.html (student page)');
    } else if (url.endsWith('.html')) {
        filename = '404.html';
        statusCode = 404;
        console.log('❌ Serving: 404.html (404 Not Found)');
    } else {
        // For non-HTML requests
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        console.log('❌ Invalid request (not .html)');
        return;
    }
    
    // Build file path
    const filePath = path.join(PUBLIC_DIR, filename);
    console.log(`File path: ${filePath}`);
    
    // Check if file exists first
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`❌ File not found: ${filePath}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(`❌ Error reading file: ${err.message}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            console.log(`✅ Sending file with status: ${statusCode}`);
            res.writeHead(statusCode, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server started on http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${PUBLIC_DIR}`);
    console.log('\n=== Available Endpoints ===');
    console.log('GET /              → index.html (200)');
    console.log('GET /index.html    → index.html (200)');
    console.log('GET /anything.html → 404.html   (404)');
    console.log('GET /data.html     → 404.html   (404)');
    console.log('GET /test.html     → 404.html   (404)');
    console.log('\n=== Test Commands ===');
    console.log(`curl -I http://localhost:${PORT}/index.html`);
    console.log(`curl -I http://localhost:${PORT}/data.html`);
});