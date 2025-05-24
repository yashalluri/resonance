const express = require('express');
const { getDexMCPInstance } = require('../services/dexMCP');

const router = express.Router();

// Open Google Sheets
router.post('/open-sheets', async (req, res) => {
  try {
    const { spreadsheetUrl } = req.body;
    
    if (!spreadsheetUrl) {
      return res.status(400).json({ error: 'Missing spreadsheetUrl' });
    }

    const dex = getDexMCPInstance();
    if (!dex) {
      return res.status(503).json({ error: 'Dex MCP not connected' });
    }

    const result = await dex.openGoogleSheets(spreadsheetUrl);
    res.json(result);
  } catch (error) {
    console.error('Dex open sheets error:', error);
    res.status(500).json({
      error: 'Failed to open Google Sheets',
      details: error.message
    });
  }
});

// Fill spreadsheet with data
router.post('/fill-data', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Missing or invalid data array' });
    }

    const dex = getDexMCPInstance();
    if (!dex) {
      return res.status(503).json({ error: 'Dex MCP not connected' });
    }

    const result = await dex.fillSpreadsheetData(data);
    res.json(result);
  } catch (error) {
    console.error('Dex fill data error:', error);
    res.status(500).json({
      error: 'Failed to fill spreadsheet data',
      details: error.message
    });
  }
});

// Get DOM structure
router.get('/dom', async (req, res) => {
  try {
    const dex = getDexMCPInstance();
    if (!dex) {
      return res.status(503).json({ error: 'Dex MCP not connected' });
    }

    const result = await dex.getDOMStructure();
    res.json(result);
  } catch (error) {
    console.error('Dex DOM error:', error);
    res.status(500).json({
      error: 'Failed to get DOM structure',
      details: error.message
    });
  }
});

// Take screenshot
router.get('/screenshot', async (req, res) => {
  try {
    const dex = getDexMCPInstance();
    if (!dex) {
      return res.status(503).json({ error: 'Dex MCP not connected' });
    }

    const result = await dex.takeScreenshot();
    res.json(result);
  } catch (error) {
    console.error('Dex screenshot error:', error);
    res.status(500).json({
      error: 'Failed to take screenshot',
      details: error.message
    });
  }
});

module.exports = router;