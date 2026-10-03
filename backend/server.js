const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Message = require('./models/Message');

// Route files
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const postRoutes = require('./routes/postRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route - API status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'GreenThumb – Plant Care & Community API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      plants: '/api/plants',
      posts: '/api/posts',
      reminders: '/api/reminders',
      chat: '/api/chat',
      search: '/api/plants/search?keyword=succulent',
    },
  });
});

// Interactive API Documentation Route
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>GreenThumb API Documentation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f1e17; color: #e2f0d9; padding: 2rem; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; background: #162c22; border-radius: 12px; padding: 2rem; border: 1px solid #2d5a44; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #52e396; display: flex; align-items: center; gap: 10px; }
        .badge { background: #234c38; color: #52e396; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
        .method { font-weight: bold; border-radius: 4px; padding: 4px 8px; font-size: 0.8rem; display: inline-block; width: 60px; text-align: center; }
        .get { background: #1a5336; color: #72f2a8; }
        .post { background: #1f4e79; color: #6db3f2; }
        .put { background: #7c5210; color: #f2ba6d; }
        .del { background: #6b1f24; color: #f26d78; }
        .endpoint-row { display: flex; align-items: center; gap: 15px; padding: 12px; border-bottom: 1px solid #234c38; font-family: monospace; font-size: 0.95rem; }
        .desc { color: #a3c9b2; font-family: sans-serif; font-size: 0.85rem; margin-left: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌿 GreenThumb REST API Explorer <span class="badge">v1.0.0</span></h1>
        <p>Interactive documentation for GreenThumb - Plant Care & Community Platform</p>
        
        <h3>Authentication Endpoints</h3>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/auth/register</span> <span class="desc">Register new gardener</span></div>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/auth/login</span> <span class="desc">Login & obtain JWT Bearer token</span></div>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/auth/me</span> <span class="desc">Current user profile</span></div>
        <div class="endpoint-row"><span class="method put">PUT</span> <span>/api/auth/profile</span> <span class="desc">Update user profile</span></div>

        <h3>Plants Endpoints</h3>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/plants</span> <span class="desc">Get all user plants</span></div>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/plants/:id</span> <span class="desc">Get plant details with reminders</span></div>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/plants</span> <span class="desc">Create plant (multipart with image)</span></div>
        <div class="endpoint-row"><span class="method put">PUT</span> <span>/api/plants/:id</span> <span class="desc">Update plant details</span></div>
        <div class="endpoint-row"><span class="method del">DEL</span> <span>/api/plants/:id</span> <span class="desc">Delete plant and care schedule</span></div>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/plants/search?keyword=succulent</span> <span class="desc">Search plants & botanical catalog</span></div>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/plants/identify</span> <span class="desc">AI image species identification</span></div>

        <h3>Community Posts & Comments</h3>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/posts</span> <span class="desc">Community feed with comments</span></div>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/posts</span> <span class="desc">Create post with photo</span></div>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/posts/:id/comment</span> <span class="desc">Add comment to community post</span></div>
        <div class="endpoint-row"><span class="method put">PUT</span> <span>/api/posts/:id/like</span> <span class="desc">Toggle like on post</span></div>

        <h3>Reminders Endpoints</h3>
        <div class="endpoint-row"><span class="method post">POST</span> <span>/api/reminders</span> <span class="desc">Schedule plant care reminder</span></div>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/reminders/user/:id</span> <span class="desc">Get reminders for specific user ID</span></div>
        <div class="endpoint-row"><span class="method get">GET</span> <span>/api/reminders</span> <span class="desc">Get current user reminders</span></div>
        <div class="endpoint-row"><span class="method put">PUT</span> <span>/api/reminders/:id</span> <span class="desc">Mark reminder completed / update</span></div>
        <div class="endpoint-row"><span class="method del">DEL</span> <span>/api/reminders/:id</span> <span class="desc">Delete reminder</span></div>
      </div>
    </body>
    </html>
  `);
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Real-Time Community Chat handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

  // Join a room (e.g. 'general', 'succulents', 'indoor-plants')
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`👤 Socket ${socket.id} joined room: ${room}`);
  });

  // Handle incoming chat message
  socket.on('send_message', async (data) => {
    try {
      const { room, sender, senderName, senderAvatar, message } = data;

      // Save message to MongoDB
      let savedMessage = null;
      if (sender && message) {
        savedMessage = await Message.create({
          room: room || 'general',
          sender,
          senderName: senderName || 'Gardener',
          senderAvatar: senderAvatar || '',
          message,
        });
      }

      // Broadcast to room
      const payload = savedMessage ? savedMessage.toObject() : {
        room: room || 'general',
        senderName: senderName || 'Gardener',
        senderAvatar: senderAvatar || '',
        message,
        createdAt: new Date(),
      };

      io.to(room || 'general').emit('receive_message', payload);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// 404 & Central Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🌱 GreenThumb server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = { app, server, io };
