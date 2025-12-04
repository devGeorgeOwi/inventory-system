# 📦 Inventory Management System

A lightweight Node.js application featuring dual servers: a static web server with custom 404 routing and a RESTful inventory API with file-based persistence—built entirely without external frameworks.

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system

# 2. Install dependencies
npm install

# 3. Create data directory
mkdir data

# 4. Initialize database file
echo [] > data/items.json

# 5. Start both servers
npm start

```
### Alternative: Start Servers Separately
    ```bash
    # Terminal 1: Web server (port 3000)
    npm run web

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