require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;


// Configuración CORS (¡Añade esto!)
const corsOptions = {
  origin: [
    'http://localhost:8081', 
    'http://localhost:3000',
    'https://logi-events.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Para navegadores antiguos
};

// Middleware
app.use(cors(corsOptions)); // ¡Esto es importante!
app.use(express.json()); 

// Load routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event.js');
const chatRouter = require('./routes/chatbot');
const ticketRouter = require('./routes/ticket');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database succesfully connected.'))
.catch(err => console.log(err));

// Made the public route for media files
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use(`/auth`, authRouter);
app.use(`/user`, userRouter);
app.use(`/event`, eventRouter);
app.use(`/chat`, chatRouter);
app.use(`/ticket`, ticketRouter);

// Manejo de errores CORS (opcional pero recomendado)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  } else if (err.name === 'CorsError') {
    res.status(403).json({ error: 'Not allowed by CORS' });
  } else {
    next(err);
  }
});

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;