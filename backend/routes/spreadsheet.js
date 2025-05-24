const express = require('express');
const SpreadsheetParser = require('../services/spreadsheetParser');

const router = express.Router();

// Parse uploaded spreadsheet
router.post('/parse', (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const parseResult = SpreadsheetParser.parseFile(req.file.path);
    
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Failed to parse spreadsheet',
        details: parseResult.error
      });
    }

    res.json({
      success: true,
      data: parseResult.data,
      summary: {
        totalRows: parseResult.data.totalRows,
        validContacts: parseResult.data.validContacts,
        headers: parseResult.data.headers
      }
    });
  } catch (error) {
    console.error('Spreadsheet parsing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;