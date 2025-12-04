const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'items.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initialize empty items.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// Helper functions
function readItems() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error.message);
        return [];
    }
}

function saveItems(items) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving file:', error.message);
        return false;
    }
}

function getNextId(items) {
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
    return maxId + 1;
}

// Parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Create server
const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    
    console.log(`\n${method} ${url}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle preflight
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Remove trailing slash and handle root
    const cleanUrl = url.replace(/\/$/, '');
    
    try {
        // GET /items - Get all items
        if (method === 'GET' && cleanUrl === '/items') {
            const items = readItems();
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: items,
                count: items.length
            }));
        }
        
        // POST /items - Create item
        else if (method === 'POST' && cleanUrl === '/items') {
            const body = await parseBody(req);
            
            // Validate
            if (!body.name || body.price === undefined || !body.size) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Missing required fields: name, price, size'
                }));
                return;
            }
            
            const items = readItems();
            const newItem = {
                id: getNextId(items).toString(),
                name: body.name,
                price: parseFloat(body.price),
                size: body.size.toUpperCase()
            };
            
            // Validate size
            if (!['S', 'M', 'L'].includes(newItem.size)) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Size must be S, M, or L'
                }));
                return;
            }
            
            items.push(newItem);
            saveItems(items);
            
            res.writeHead(201);
            res.end(JSON.stringify({
                success: true,
                data: newItem,
                message: 'Item created'
            }));
        }
        
        // GET /items/:id - Get single item
        else if (method === 'GET' && cleanUrl.startsWith('/items/')) {
            const id = cleanUrl.split('/')[2];
            const items = readItems();
            const item = items.find(i => i.id === id);
            
            if (item) {
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    data: item
                }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({
                    success: false,
                    message: `Item with ID "${id}" not found`
                }));
            }
        }
        
        // PUT /items/:id - Update item
        else if (method === 'PUT' && cleanUrl.startsWith('/items/')) {
            const id = cleanUrl.split('/')[2];
            const body = await parseBody(req);
            const items = readItems();
            const index = items.findIndex(i => i.id === id);
            
            if (index === -1) {
                res.writeHead(404);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Item not found'
                }));
                return;
            }
            
            // Update item
            const updatedItem = { ...items[index] };
            
            if (body.name !== undefined) updatedItem.name = body.name;
            if (body.price !== undefined) updatedItem.price = parseFloat(body.price);
            if (body.size !== undefined) {
                const size = body.size.toUpperCase();
                if (!['S', 'M', 'L'].includes(size)) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Size must be S, M, or L'
                    }));
                    return;
                }
                updatedItem.size = size;
            }
            
            items[index] = updatedItem;
            saveItems(items);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: updatedItem,
                message: 'Item updated'
            }));
        }
        
        // DELETE /items/:id - Delete item
        else if (method === 'DELETE' && cleanUrl.startsWith('/items/')) {
            const id = cleanUrl.split('/')[2];
            const items = readItems();
            const initialLength = items.length;
            const filteredItems = items.filter(i => i.id !== id);
            
            if (filteredItems.length === initialLength) {
                res.writeHead(404);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Item not found'
                }));
                return;
            }
            
            saveItems(filteredItems);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: 'Item deleted'
            }));
        }
        
        // Invalid route
        else {
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                message: 'Route not found'
            }));
        }
        
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }));
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`\n✅ API Server running on http://localhost:${PORT}`);
    console.log('\n📋 Available endpoints:');
    console.log('  GET    /items           - Get all items');
    console.log('  POST   /items           - Create item');
    console.log('  GET    /items/{id}      - Get single item');
    console.log('  PUT    /items/{id}      - Update item');
    console.log('  DELETE /items/{id}      - Delete item');
    
    console.log('\n💡 Test with these commands:');
    console.log('  curl http://localhost:3001/items');
    console.log('  curl -X POST http://localhost:3001/items \\');
    console.log('    -H "Content-Type: application/json" \\');
    console.log('    -d \'{"name":"Test","price":10,"size":"M"}\'');
    console.log('  curl http://localhost:3001/items/1');
});