const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../services/database');
const SpreadsheetParser = require('../services/spreadsheetParser');
const LeapingAIService = require('../services/leapingAI');

const router = express.Router();

// Create a new campaign
router.post('/create', async (req, res) => {
  try {
    const { name, questions, outputDestination } = req.body;
    const file = req.file;

    if (!name || !questions || !file) {
      return res.status(400).json({
        error: 'Missing required fields: name, questions, and spreadsheet file'
      });
    }

    // Parse spreadsheet
    const parseResult = SpreadsheetParser.parseFile(file.path);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Failed to parse spreadsheet',
        details: parseResult.error
      });
    }

    // Parse questions
    const parsedQuestions = SpreadsheetParser.parseQuestions(questions);

    // Create campaign
    const campaignId = uuidv4();
    const db = getDB();
    
    const campaign = {
      id: campaignId,
      name,
      questions: JSON.stringify(parsedQuestions),
      contacts: JSON.stringify(parseResult.data.contacts),
      outputDestination: outputDestination || 'database',
      status: 'created',
      totalContacts: parseResult.data.validContacts,
      completedCalls: 0,
      createdAt: new Date().toISOString()
    };

    await db.run(`
      INSERT INTO campaigns (
        id, name, questions, contacts, output_destination, 
        status, total_contacts, completed_calls, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      campaign.id, campaign.name, campaign.questions, campaign.contacts,
      campaign.outputDestination, campaign.status, campaign.totalContacts,
      campaign.completedCalls, campaign.createdAt
    ]);

    res.json({
      success: true,
      campaign: {
        id: campaignId,
        name,
        totalContacts: parseResult.data.validContacts,
        questions: parsedQuestions,
        status: 'created'
      }
    });
  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({
      error: 'Failed to create campaign',
      details: error.message
    });
  }
});

// Start a campaign
router.post('/:campaignId/start', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const db = getDB();
    
    // Get campaign details
    const campaign = await db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status !== 'created') {
      return res.status(400).json({ error: 'Campaign already started or completed' });
    }

    // Update campaign status
    await db.run('UPDATE campaigns SET status = ? WHERE id = ?', ['running', campaignId]);

    // Start making calls
    const leapingAI = new LeapingAIService();
    const contacts = JSON.parse(campaign.contacts);
    const questions = JSON.parse(campaign.questions);

    // Process calls asynchronously
    processCampaignCalls(campaignId, contacts, questions, leapingAI);

    res.json({
      success: true,
      message: 'Campaign started',
      campaignId,
      totalContacts: contacts.length
    });
  } catch (error) {
    console.error('Campaign start error:', error);
    res.status(500).json({
      error: 'Failed to start campaign',
      details: error.message
    });
  }
});

// Get campaign status
router.get('/:campaignId/status', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const db = getDB();
    
    const campaign = await db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get call results
    const calls = await db.all('SELECT * FROM calls WHERE campaign_id = ?', [campaignId]);
    
    res.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalContacts: campaign.total_contacts,
        completedCalls: campaign.completed_calls,
        createdAt: campaign.created_at
      },
      calls: calls.map(call => ({
        id: call.id,
        phoneNumber: call.phone_number,
        status: call.status,
        responses: call.responses ? JSON.parse(call.responses) : null,
        createdAt: call.created_at,
        completedAt: call.completed_at
      }))
    });
  } catch (error) {
    console.error('Campaign status error:', error);
    res.status(500).json({
      error: 'Failed to get campaign status',
      details: error.message
    });
  }
});

// Process campaign calls asynchronously
async function processCampaignCalls(campaignId, contacts, questions, leapingAI) {
  const db = getDB();
  
  for (const contact of contacts) {
    try {
      // Make the call
      const callResult = await leapingAI.makeCall(
        contact.phoneNumber,
        questions,
        campaignId
      );

      // Store call record
      const callId = uuidv4();
      await db.run(`
        INSERT INTO calls (
          id, campaign_id, phone_number, leaping_call_id, 
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        callId,
        campaignId,
        contact.phoneNumber,
        callResult.callId,
        callResult.success ? 'initiated' : 'failed',
        new Date().toISOString()
      ]);

      // Small delay between calls
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to process call for ${contact.phoneNumber}:`, error);
    }
  }
}

module.exports = router;