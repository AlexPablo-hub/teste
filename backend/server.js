const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./src/config/database');
const { testFirebaseConnection } = require('./src/config/firebase');
const routes = require('./src/routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

// Middlewares
app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Status check
app.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'API de veículos funcionando corretamente!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {    
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/status`);
      console.log('─'.repeat(50));
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;