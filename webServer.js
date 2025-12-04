// Import built-in Node.js modules ( np frameworks)
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('=== SERVER STARTING ===');
console.log('Current directory:', __dirname);
console.log('Looking for public folder:', path.join(__dirname, 'public'));


// Create the server
const server = http.createServer((request, response) => {
    console.log('\n==== NEW REQUEST ====');
    console.log('URL:', request.url);
    console.log('Method:', request.method);

    // Always show what path we are trying to access
    const publicDir = path.join(__dirname, 'public');
    console.log('Public directory:', publicDir);

    let filePath;

    // Map URLs to files
    if (request.url === '/' || request.url === '/index.html') {
        filePath = path.join(publicDir, 'index.html');
        console.log('Trying to serve index.html from:', filePath);
    } else if (request.url.endsWith('.html')) {
        filePath = path.join(publicDir, '404.html');
        console.log('Trying to serve 404.html from:', filePath);
    } else {
        console.log('Not an HTML request, sending palin 404');
        response.writeHead(404, { 'Content-Type': 'text/plain'});
        response.end('404 - Not Found');
    }

    // Check if file exists BEFORE trying to read it
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('❌ File does not exist:', filePath);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end(`File not found: ${filePath}`);
        } else {
            console.log('✅ File exists:', filePath);
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    console.log('❌ Error reading file:', error);
                    response.writeHead(500);
                    response.end('Server Error');
                } else {
                    console.log('✅ Successfully read file, sending response');
                }
            });
        }
    }); 
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n=== Server staarted ===`);
    console.log(`Listening on port ${PORT}`);
    console.log(`Test these URLs`);
    console.log(`1. http://localhost:${PORT}/index.html`);
    console.log(`2. http://localhost:${PORT}/`);
    console.log(`3. http://localhost:${PORT}/random.html`);
    console.log(`4. http://localhost:${PORT}/test.html\n`);
});