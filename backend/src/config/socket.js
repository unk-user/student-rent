const { Server } = require('socket.io');
const verifySocketToken = require('../middleware/verifySocketToken');
const connectionHandler = require('../handlers/connectionHandler');

function configureSocket(server) {
  const io = new Server(server, {
    cors: {
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      origin: ['http://localhost:8000', 'http://localhost:5173'],
    },
  });

  io.use(async (socket, next) => {
    const accessToken = socket.handshake.query.accessToken;
    try {
      const { userId, role, user } = await verifySocketToken(accessToken);
      socket.userId = userId;
      socket.role = role;
      socket.user = user;
      console.log('Socket authentication successful for user:', userId);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', connectionHandler);

  return io;
}

module.exports = configureSocket;
