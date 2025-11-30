// server/index.js - Servidor principal do Kardum
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Basic routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket para multiplayer
const clients = new Map();
let clientId = 0;

wss.on('connection', (ws) => {
    const id = clientId++;
    clients.set(id, ws);

    console.log(`Client ${id} connected. Total clients: ${clients.size}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Message from client ${id}:`, data);

            // Echo back for now (será implementado com matchmaking)
            ws.send(JSON.stringify({
                type: 'echo',
                data: data
            }));
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(id);
        console.log(`Client ${id} disconnected. Total clients: ${clients.size}`);
    });

    // Welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Conectado ao servidor Kardum!',
        clientId: id
    }));
});

// Start server
server.listen(PORT, () => {
    console.log(`🎮 Kardum Server rodando em http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
