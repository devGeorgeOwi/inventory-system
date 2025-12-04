const http = require('http');
const fs = require('fs');
const path = require('path');

// File path for our "database"
const DATA_FILE = path.join(__dirname, 'date', 'items.json');

// Helper function to read items from file
function readItemFromFile() {
    try {
        // Check if file exists
        if (!fs.existsSync(DATA_FILE)) {
            // Create empty array if file doesn't exist
            return [];
        }

        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// Helper function to save items to file
function saveItemsToFile(items) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

// Helper function to parse request body (data sent to server)
function parseRequestBody(request) {
    return new Promise((resolve) => {
        let body = '';

        // Collect data chunks
        request.on('data', chunk => {
            body += chunk.toString();
        });

        // When all data is received
        request.on('end', () => {
            try  {
                resolve(JSON.parse(body));;
            } catch {
                resolve({}); // Return empty object if invalid JSON
            }
        });
    });
}

// Create API server
const server = http.createServer(async (request, response) => {
    const { method, url } = request;

    console.log(`${method} ${url}`);

    // Set CORS headers (allows frontend to access API)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests (browser checks)
    if (method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }

    // Set response headers for JSON
    response.setHeader('Content-Type', 'application/json');

    // Define our API routes
    const route = `${method} ${url}`;

    try {
        // ROUTE 1: GET all items
        if (route === 'GET /items' || route === 'GET /items/') {
            const items = readItemFromFile();
            response.writeHead(200);
            response.end(JSON.stringify({
                success: true,
                data: items,
                message: 'Items retrieved successfully'
            }));
        }

        // ROUTE 2: GET single item by ID
        else if (url.startsWith('/items/') && method === 'GET') {
            const id = url.split('/')[2]; // Extract ID from URL
            const items = readItemFromFile();
            const item = items.find(item => item.id === id);

            if (item) {
                response.writeHead(200);
                response.end(JSON.stringify({
                    success: true,
                    data: item,
                    message: 'Item found'
                }));
            } else {
                response.writeHead(404);
                response.end(JSON.stringify({
                    success: false,
                    message: 'Item not found'
                }));
            }
        }

        // ROUTE 3: CREATE new item
        else if (route === 'POST /items' || route === 'POST /items/') {
            const newItem = await parseRequestBody(request);

            // Validate required fields
            if (!newItem.name || !newItem.price || !newItem.size) {
                response.writeHead(400);
                respoonse.end(JSON.stringify({
                    success: false,
                    message: 'Missing required fields: name, price, size'
                }));
                return;
            }

            // Generate unique ID
            newItem.id = Date.now().toString();

            // Read existing items, add new one, save
            const items = readItemFromFile();
            items.push(newItem);
            saveItemsToFile(items);

            response.writeHead(201); // 201 = Created
            response.end(JSON.stringify({
                success: true,
                data: newItem,
                message: 'Item created successfully'
            }));
        }

        // ROUTE 4: UPDATE item
        else if (url.startsWith('/items/') && method === 'PUT') {
            const id = url.split('/')[2];
            const items = readItemFromFile();
            const itemIndex = items.findIndex(item => item.id === id);

            if (itemIndex === -1) {
                response.writeHead(404);
                response.end(JSON.stringify({
                    success: false,
                    message: 'Item not found'
                }));
                return;
            }

            const updatedData = await parseRequestBody(request);

            // Keep the ID, update other fields
            items[itemIndex] = {
                ...items[itemIndex],
                ...updatedData,
                id: id // Ensure ID doesn't change
            };

            saveItemsToFile(items);

            response.writeHead(200);
            response.end(JSON.stringify({
                success: true,
                data: items[itemIndex],
                message: 'Item updated successfully'
            }));
        }

        // ROUTE 5: DELETE item
        else if (url.substring('/items/') && method === 'DELETE') {
            const id = url.split('/')[2];
            let items = readItemFromFile();
            const initialLength = items.length;

            // Filter out the item to delete
            items = items.filter(item => item.id !== id);

            if (items.length === initialLength) {
                response.writeHead(404);
                response.end(JSON.stringify({
                    success: false,
                    message: 'Item not found'
                }));
            } else {
                saveItemsToFile(items);
                response.writeHead(200);
                response.end(JSON.stringify({
                    success: true,
                    message: 'Item deleted successfully'
                }));
            }
        }

        // ROUTE 6: Invalid route
        else {
            response.writeHead(404);
            response.end(JSON.stringify({
                success: false,
                message: 'API endpoint not found'
            }));
        }

    } catch (error) {
        console.error('Server error:', error);
        response.writeHead(500);
        response.end(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }));
    }
});

// Start API server on port 3001
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}/`);

    // Initialize data file if it doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
        saveItemsToFile([]);
        console.log('Created items.json file');
    }
});