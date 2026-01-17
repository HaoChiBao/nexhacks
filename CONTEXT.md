# CONTEXT.md

## Application Overview
This project is a full-stack application consisting of a React client and an Express Node.js server.
- **Client**: Located in `/client`. Built with Vite, React, and TypeScript.
- **Server**: Located in `/server`. Built with Node.js, Express, and TypeScript.

## Architecture
The client communicates with the server via HTTP requests. Key configurations:
- **CORS**: The server expects requests from the client (typically `http://localhost:5173` during dev) and has CORS enabled.
- **Port**: Server runs on port 3000 (default). Client runs on Vite default (5173).

## Routes & Endpoints

### Client Routes
*Currently initialized with default Vite React template.*
- `/`: Home page

### Server Endpoints
- `GET /`: Basic status check. Returns "Server is running".
- `GET /health`: Health check. Returns JSON `{ status: 'ok', timestamp: ... }`.

## Development
- **Start Client**: `cd client && npm run dev`
- **Start Server**: `cd server && npm run dev` (requires `nodemon` script in package.json, pending setup)

## Directory Structure
```
/root
  /client      # Frontend (Vite)
  /server      # Backend (Express)
  CONTEXT.md   # This file
```
