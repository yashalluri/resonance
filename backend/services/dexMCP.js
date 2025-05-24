const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class DexMCPService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.pendingRequests = new Map();
    this.wsUrl = 'ws://127.0.0.1:8765';
  }

  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);
        
        this.ws.on('open', () => {
          console.log('✅ Connected to Dex MCP WebSocket');
          this.isConnected = true;
          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        });

        this.ws.on('close', () => {
          console.log('❌ Dex MCP WebSocket connection closed');
          this.isConnected = false;
        });

        this.ws.on('error', (error) => {
          console.error('Dex MCP WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);
      resolve(message);
    }
  }

  async sendCommand(action, params = {}) {
    if (!this.isConnected) {
      throw new Error('Not connected to Dex MCP WebSocket');
    }

    const id = uuidv4();
    const message = {
      id,
      action,
      ...params
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify(message));
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  async openGoogleSheets(spreadsheetUrl) {
    try {
      await this.sendCommand('navigate', { url: spreadsheetUrl });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for page load
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fillSpreadsheetData(data) {
    try {
      const results = [];
      
      for (const row of data) {
        // Find and click the appropriate cell
        const cellResult = await this.sendCommand('click_element', {
          element_id: row.cellId
        });
        
        if (cellResult.result?.success) {
          // Input the data
          await this.sendCommand('input_text', {
            element_id: row.cellId,
            text: row.value
          });
          
          // Press Enter to confirm
          await this.sendCommand('send_keys', { keys: 'Enter' });
          
          results.push({ cellId: row.cellId, success: true });
        } else {
          results.push({ cellId: row.cellId, success: false, error: 'Cell not found' });
        }
        
        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return { success: true, results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDOMStructure() {
    try {
      const result = await this.sendCommand('grab_dom');
      return result.result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async takeScreenshot() {
    try {
      const result = await this.sendCommand('screenshot');
      return result.result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

let dexMCPInstance = null;

async function initializeDexMCP() {
  try {
    dexMCPInstance = new DexMCPService();
    await dexMCPInstance.connect();
    console.log('🔗 Dex MCP service initialized');
  } catch (error) {
    console.warn('⚠️  Dex MCP connection failed (will retry when needed):', error.message);
  }
}

function getDexMCPInstance() {
  return dexMCPInstance;
}

module.exports = {
  DexMCPService,
  initializeDexMCP,
  getDexMCPInstance
};