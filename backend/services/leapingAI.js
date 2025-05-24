const axios = require('axios');

class LeapingAIService {
  constructor() {
    this.username = process.env.LEAPING_AI_USERNAME;
    this.password = process.env.LEAPING_AI_PASSWORD;
    this.baseURL = process.env.LEAPING_AI_BASE_URL || 'https://api.leaping.ai';
    
    // Use token from environment if available
    this.token = process.env.LEAPING_AI_TOKEN || null;
    this.tokenExpiry = this.token ? new Date('2025-02-21') : null;
    
    // Only require username/password if no token is provided
    if (!this.token && (!this.username || !this.password)) {
      throw new Error('Either LEAPING_AI_TOKEN or both LEAPING_AI_USERNAME and LEAPING_AI_PASSWORD environment variables are required');
    }
  }

  async authenticate() {
    // If we already have a valid token, don't authenticate
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      console.log('✅ Using existing valid token');
      return { success: true, token: this.token };
    }
    
    // If no username/password, can't authenticate
    if (!this.username || !this.password) {
      throw new Error('Cannot authenticate: username and password not available');
    }
    
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        username: this.username,
        password: this.password
      });

      this.token = response.data.token;
      // Set expiry to 23 hours from now (1 hour buffer before 24h expiry)
      this.tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
      
      console.log('✅ Successfully authenticated with Leaping AI');
      return { success: true, token: this.token };
    } catch (error) {
      console.error('❌ Leaping AI authentication failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async ensureValidToken() {
    // Check if token exists and is not expired
    if (!this.token || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      console.log('🔄 Token expired or missing, re-authenticating...');
      const authResult = await this.authenticate();
      if (!authResult.success) {
        throw new Error(`Authentication failed: ${authResult.error}`);
      }
    }
    return this.token;
  }

  // Quick Schedule - Stage and schedule calls in a single request
  async quickScheduleCall(phoneNumber, questions, campaignId, scheduleTime = null) {
    try {
      const token = await this.ensureValidToken();
      
      const payload = {
        agent_id: "019703af-c49a-7ad8-8cbb-fbd52ecb5f3a",
        agent_snapshot_id: "019703af-c49a-7ad8-8cbb-fbd52ecb5f3a", 
        from_phone_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a",
        from_phone_number: process.env.FROM_PHONE_NUMBER || "+1234567890",
        phone_numbers_to_call: [phoneNumber],
        schedule: scheduleTime ? {
          start_date: scheduleTime.split('T')[0], // Extract date part
          end_date: scheduleTime.split('T')[0],
          start_time: scheduleTime.split('T')[1] || "09:00:00",
          end_time: scheduleTime.split('T')[1] || "17:00:00"
        } : {
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0], 
          start_time: "09:00:00",
          end_time: "17:00:00"
        },
        // Add custom fields for campaign and questions if the API supports them
        campaign_id: campaignId,
        questions: questions,
        callback_url: `${process.env.BACKEND_URL}/api/calls/callback`
      };
  
      const response = await axios.post(`${this.baseURL}/v1/calls/quick-schedule`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return {
        success: true,
        callId: response.data.call_id,
        status: response.data.status,
        scheduledTime: response.data.scheduled_time,
        data: response.data
      };
    } catch (error) {
      return await this.handleApiError(error, 'quickScheduleCall', arguments);
    }
  }

  // Two-step process: Stage calls first
  async stageCall(phoneNumber, questions, campaignId) {
    try {
      const token = await this.ensureValidToken();
      
      const payload = [{
        status: "staged",
        agent_snapshot_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a",
        phone_id: "3c90c3cc-0d44-4b50-8888-8dd25736052a", 
        customer_phone_number: phoneNumber,
        field_overrides: {
          // Add any custom fields here if needed
          campaign_id: campaignId,
          questions: questions,
          callback_url: `${process.env.BACKEND_URL}/api/calls/callback`
        }
      }];
  
      const response = await axios.post(`${this.baseURL}/v1/calls/stage`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return {
        success: true,
        stagedCallId: response.data[0]?.staged_call_id || response.data[0]?.id,
        status: response.data[0]?.status,
        data: response.data
      };
    } catch (error) {
      return await this.handleApiError(error, 'stageCall', arguments);
    }
  }

  // Two-step process: Schedule staged calls
  async scheduleCall(stagedCallId, scheduleTime = null) {
    try {
      const token = await this.ensureValidToken();
      
      const payload = {
        staged_call_id: stagedCallId,
        schedule_time: scheduleTime || 'immediate'
      };

      const response = await axios.post(`${this.baseURL}/calls/schedule`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        callId: response.data.call_id,
        status: response.data.status,
        scheduledTime: response.data.scheduled_time,
        data: response.data
      };
    } catch (error) {
      return await this.handleApiError(error, 'scheduleCall', arguments);
    }
  }

  // Convenience method that uses quick schedule by default
  async makeCall(phoneNumber, questions, campaignId, scheduleTime = null) {
    return await this.quickScheduleCall(phoneNumber, questions, campaignId, scheduleTime);
  }

  // Batch staging for multiple calls
  async stageBatchCalls(calls) {
    const results = [];
    
    for (const call of calls) {
      const result = await this.stageCall(
        call.phoneNumber,
        call.questions,
        call.campaignId
      );
      
      results.push({
        phoneNumber: call.phoneNumber,
        ...result
      });
      
      // Small delay between staging calls
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Schedule all staged calls at once
  async scheduleBatchCalls(stagedCallIds, scheduleTime = null) {
    const results = [];
    
    for (const stagedCallId of stagedCallIds) {
      const result = await this.scheduleCall(stagedCallId, scheduleTime);
      results.push({
        stagedCallId,
        ...result
      });
      
      // Small delay between scheduling calls
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  async getCallStatus(callId) {
    try {
      const token = await this.ensureValidToken();
      
      const response = await axios.get(`${this.baseURL}/calls/${callId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        success: true,
        status: response.data.status,
        transcript: response.data.transcript,
        responses: response.data.responses,
        data: response.data
      };
    } catch (error) {
      return await this.handleApiError(error, 'getCallStatus', arguments);
    }
  }

  // Centralized error handling with automatic retry for 401s
  async handleApiError(error, methodName, originalArgs) {
    console.error(`Leaping AI ${methodName} failed:`, error.response?.data || error.message);
    
    // If unauthorized, try re-authenticating once
    if (error.response?.status === 401) {
      console.log('🔄 Received 401, attempting re-authentication...');
      this.token = null; // Force re-authentication
      
      try {
        const token = await this.ensureValidToken();
        
        // Retry the original method call
        switch (methodName) {
          case 'quickScheduleCall':
            return await this.quickScheduleCall(...originalArgs);
          case 'stageCall':
            return await this.stageCall(...originalArgs);
          case 'scheduleCall':
            return await this.scheduleCall(...originalArgs);
          case 'getCallStatus':
            return await this.getCallStatus(...originalArgs);
          default:
            throw new Error(`Unknown method: ${methodName}`);
        }
      } catch (retryError) {
        return {
          success: false,
          error: retryError.response?.data?.message || retryError.message
        };
      }
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }

  // Method to manually refresh token if needed
  async refreshToken() {
    this.token = null;
    this.tokenExpiry = null;
    return await this.authenticate();
  }
}

module.exports = LeapingAIService;