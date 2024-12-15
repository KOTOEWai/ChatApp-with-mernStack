const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const UserRoutes = require('./routes/users');
const MessageRoutes = require('./routes/message');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL
        credentials: true,
    }
});



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());



io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('Message', (message) => {
      io.emit('receiveMessage', message);
    });
    console.log('User disconnected:', socket.id);
  });



// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('io', io);

// Routes
app.use("/user", UserRoutes);
app.use("/message", MessageRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
