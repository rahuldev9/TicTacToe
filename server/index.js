const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://tic-tac-toe-pearl-three-45.vercel.app',  // React frontend URL
        methods: ['GET', 'POST']
    }
});

const rooms = {};  // Store game state for each room

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createRoom', (playerName,gender) => {
        const roomId = Math.random().toString(36).substring(2, 8);  // Generate unique room ID
        
        rooms[roomId] = {
            creator: socket.id,  
            players: [{ id: socket.id, name: playerName,gender:gender }],  // Store player info
            board: Array(9).fill(null), 
            currentPlayer: socket.id ,
            chat: []  // Chat messages
        };
    
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        
        console.log(`Room ${roomId} created by ${playerName} (${socket.id})`);
    });
    

    socket.on('joinRoom', ({ roomId, playerName,gender }) => {
        const room = rooms[roomId];
        if (room && room.players.length < 2) {
            room.players.push({ id: socket.id, name: playerName,gender:gender });
            socket.join(roomId);

            io.to(roomId).emit('startGame', { creatorId: room.creator, players: room.players });
            
            console.log(`${playerName} (${socket.id}) joined room ${roomId}`);
        } else {
            socket.emit('error', 'Room full or does not exist');
        }
    });

    socket.on('makeMove', ({ roomId, index }) => {
        if (!roomId || !rooms[roomId]) return;

        const room = rooms[roomId];
        if (room.board[index] === null && socket.id === room.currentPlayer) {
            const symbol = room.players[0].id === socket.id ? 'X' : 'O';
            room.board[index] = symbol;
            room.currentPlayer = room.players.find(p => p.id !== socket.id).id;

            io.to(roomId).emit('moveMade', { 
                board: room.board, 
                currentPlayer: room.currentPlayer 
            });

            checkWinner(roomId);
        }
    });
    

    socket.on('resetGame', (roomId) => {
        const room = rooms[roomId];
        if (room && room.players.length === 2) {
            room.board = Array(9).fill(null);
            room.currentPlayer = room.players[0].id;  
            io.to(roomId).emit('gameReset', { 
                board: room.board, 
                currentPlayer: room.currentPlayer 
            });
        }
    });
    

    socket.on('sendMessage', ({ roomId, message, playerName }) => {
        console.log(roomId)
        if (rooms[roomId]) {
            const chatMessage = { player: playerName, text: message };
            rooms[roomId].chat.push(chatMessage);
            
            console.log(rooms)
            io.to(roomId).emit('receiveMessage', chatMessage);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    
        for (const roomId in rooms) {
            const room = rooms[roomId];
            
            if (room.players.some(p => p.id === socket.id)) {
                io.to(roomId).emit('opponentLeft');
                console.log(`User left room ${roomId}, notifying opponent`);
    
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted`);
                break;
            }
        }
    });
});

function checkWinner(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    const b = room.board;
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    for (let [a, b1, c] of lines) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            io.to(roomId).emit('gameOver', { winner: b[a] });
            console.log(`Game Over! Winner: ${b[a]} in room ${roomId}`);
            return;
        }
    }

    if (!b.includes(null)) {
        io.to(roomId).emit('gameOver', { winner: 'Draw' });
        console.log(`Game Over! It's a Draw in room ${roomId}`);
    }
}

server.listen(4000, () => {
    console.log('Server is running on https://tictactoe-1-7ull.onrender.com/');
});
