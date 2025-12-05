# 📦 Inventory Management System

A framework-free Node.js application with modular architecture.

# API Server

RESTful API for inventory management with file-based persistence.

## Features
- Full CRUD operations (Create, Read, Update, Delete)
- File-based JSON storage
- Input validation
- CORS support
- Error handling

## Data Structure
Items are stored with:
- `id` (sequential number)
- `name` (string)
- `price` (number)
- `size` (S, M, or L)

## Files
- `apiServer.js` - Main server code
- `data/items.json` - JSON database

## Usage
```bash
npm run api
```
Server runs port 3001

## 🚀 Quick Start

```bash
<<<<<<< HEAD
# 1. Clone and install
git clone git clone https://github.com/devGeorgeOwi/inventory-system.git
=======
# 1. Clone the repository
git clone https://github.com/devGeorgeOwi/inventory-system.git
>>>>>>> 0ad89ec5fcfebb6a33a78a6d8bc585100f566643
cd inventory-system
npm install

# 2. Initialize data
mkdir -p api-server/data
echo [] > api-server/data/items.json

# 3. Start both servers
npm start
```

<<<<<<< HEAD
### 🌐 Access
    API Server -> Port 3001 -> URL: http://localhost:3001/
=======
    # Terminal 2: API server (port 3001)  
    npm run api
    ```
### 🌐 Access Points
    Once running, access these URLs:

    
# server port url

Web Server	3000	http://localhost:3000/ (Home)
                    http://localhost:3000/index.html (Student Profile)  
                    http://localhost:3000/test-api.html (API Testing UI)

API Server	3001	http://localhost:3001/items (API Endpoint)
                    http://localhost:3001/ (API Documentation)

### 📡 Quick API Test
    ```bash
    # Get all items
    curl http://localhost:3001/items

    # Create an item
    curl -X POST http://localhost:3001/items \
        -H "Content-Type: application/json" \
        -d '{"name":"T-Shirt","price":19.99,"size":"M"}'
    ```
### 🛠️ Troubleshooting
    ```bash
        # Change ports in webServer.js (line ~25) and apiServer.js (line ~220)
        # Or kill existing processes:
        # Windows: netstat -ano | findstr :3000
        # Mac/Linux: lsof -i :3000
    ```
### Missing files error?
    ```bash
        # Ensure all files exist:
        ls -la public/index.html public/404.html webServer.js apiServer.js
    ```
### API not responding?
    1. Check if servers are running: npm start

    2. Test API: curl http://localhost:3001/items

    3. Check console for error messages
    
### 📦 What's Included
   - ✅ Web server with custom 404 handling

   - ✅ RESTful API with full CRUD operations

   - ✅ File-based JSON persistence (no database needed)

   - ✅ Input validation and error handling

   - ✅ Cross-origin (CORS) support

   - ✅ Modular, framework-free code

### 📄 License
MIT License 
>>>>>>> 0ad89ec5fcfebb6a33a78a6d8bc585100f566643
