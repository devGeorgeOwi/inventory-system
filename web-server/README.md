# Web Server

Handles static HTML file serving with custom 404 routing.

## Features
- Serves static HTML files
- Custom 404 page for non-existent HTML files
- Test interface for API
- Student profile page

## Files
- `index.html` - Student profile page
- `404.html` - Custom 404 error page
- `test-api.html` - API testing interface
- `webServer.js` - Main server code

## Usage
```bash
npm run web
```

### **6. Create `api-server/README.md`:**
```markdown
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

### **7. Update Main `README.md`:**
```markdown
# 📦 Inventory Management System

A framework-free Node.js application with modular architecture.


## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system
npm install

# 2. Initialize data
mkdir -p api-server/data
echo [] > api-server/data/items.json

# 3. Start both servers
npm start
```
### 🌐 Access
    Web Server -> Port 3000 -> URL: http://localhost:3000/
    API Server -> Port 3001 -> URL: http://localhost:3001/