require('dotenv').config();
const express = require('express');
const { getDB } = require('../services/database');
const LeapingAIService = require('../services/leapingAI');

const router = express.Router();

// Initialize Leaping AI service
const leapingAI = new LeapingAIService();

// Initiate a call
router.post('/initiate', async (req, res) => {
  try {
    const { phoneNumber, campaignId, questions } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !campaignId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Missing required fields: phoneNumber, campaignId, questions' 
      });
    }

    const db = getDB();
    
    // Verify campaign exists
    const campaign = await db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Create call record in database
    const result = await db.run(`
      INSERT INTO calls (campaign_id, phone_number, status, created_at)
      VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
    `, [campaignId, phoneNumber]);
    
    const callId = result.lastID;

    // Initiate call with Leaping AI
    console.log(`🚀 Initiating call to ${phoneNumber} for campaign ${campaignId}`);
    
    const leapingResult = await leapingAI.makeCall(
      phoneNumber,
      questions,
      campaignId
    );

    if (leapingResult.success) {
      // Update call record with Leaping AI call ID (removed updated_at)
      await db.run(`
        UPDATE calls 
        SET leaping_call_id = ?, status = 'initiated'
        WHERE id = ?
      `, [leapingResult.callId, callId]);

      // Update campaign total calls count
      await db.run(`
        UPDATE campaigns 
        SET total_calls = total_calls + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [campaignId]);

      console.log(`✅ Call initiated successfully. Call ID: ${leapingResult.callId}`);
      
      res.json({
        success: true,
        callId: callId,
        leapingCallId: leapingResult.callId,
        status: leapingResult.status,
        scheduledTime: leapingResult.scheduledTime,
        message: 'Call initiated successfully'
      });
    } else {
      // Update call status to failed (removed updated_at)
      await db.run(`
        UPDATE calls 
        SET status = 'failed', error_message = ?
        WHERE id = ?
      `, [leapingResult.error, callId]);

      console.log(`❌ Call initiation failed: ${leapingResult.error}`);
      
      res.status(500).json({
        error: 'Failed to initiate call',
        details: leapingResult.error
      });
    }
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: error.message 
    });
  }
});

// Callback endpoint for Leaping AI
router.post('/callback', async (req, res) => {
  try {
    const { call_id, status, responses, transcript } = req.body;
    
    if (!call_id) {
      return res.status(400).json({ error: 'Missing call_id' });
    }

    const db = getDB();
    
    // Update call record
    await db.run(`
      UPDATE calls 
      SET status = ?, responses = ?, transcript = ?, completed_at = ?
      WHERE leaping_call_id = ?
    `, [
      status,
      responses ? JSON.stringify(responses) : null,
      transcript,
      new Date().toISOString(),
      call_id
    ]);

    // Update campaign completed calls count
    const call = await db.get('SELECT campaign_id FROM calls WHERE leaping_call_id = ?', [call_id]);
    if (call) {
      await db.run(`
        UPDATE campaigns 
        SET completed_calls = completed_calls + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [call.campaign_id]);
    }

    console.log(`📞 Call ${call_id} completed with status: ${status}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({
      error: 'Failed to process callback',
      details: error.message
    });
  }
});

// Get call details
router.get('/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const db = getDB();
    
    const call = await db.get('SELECT * FROM calls WHERE id = ?', [callId]);
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json({
      success: true,
      call: {
        id: call.id,
        campaignId: call.campaign_id,
        phoneNumber: call.phone_number,
        status: call.status,
        responses: call.responses ? JSON.parse(call.responses) : null,
        transcript: call.transcript,
        createdAt: call.created_at,
        completedAt: call.completed_at
      }
    });
  } catch (error) {
    console.error('Get call error:', error);
    res.status(500).json({
      error: 'Failed to get call details',
      details: error.message
    });
  }
});

module.exports = router;