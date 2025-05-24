const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// Import route modules
const spreadsheetRoutes = require('./routes/spreadsheet');
const callRoutes = require('./routes/calls');
const dexRoutes = require('./routes/dex');
const campaignRoutes = require('./routes/campaigns');

// Import services
const { initializeDatabase } = require('./services/database');
const { initializeDexMCP } = require('./services/dexMCP');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.use('/api/spreadsheet', upload.single('file'), spreadsheetRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/dex', dexRoutes);
app.use('/api/campaigns', campaignRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Initialize services and start server
async function startServer() {
  try {
    await initializeDatabase();
    await initializeDexMCP();
    
    app.listen(PORT, () => {
      console.log(`🚀 Resonance backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();