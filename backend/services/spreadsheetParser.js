const XLSX = require('xlsx');
const fs = require('fs');

class SpreadsheetParser {
  static parseFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Clean up the file
      fs.unlinkSync(filePath);
      
      return {
        success: true,
        data: this.processSpreadsheetData(data)
      };
    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  static processSpreadsheetData(rawData) {
    if (!rawData || rawData.length === 0) {
      throw new Error('Spreadsheet is empty');
    }

    const headers = rawData[0];
    const phoneColumnIndex = this.findPhoneColumn(headers);
    
    if (phoneColumnIndex === -1) {
      throw new Error('No phone number column found. Expected columns like "phone", "number", "telephone", etc.');
    }

    const contacts = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const phoneNumber = this.cleanPhoneNumber(row[phoneColumnIndex]);
      
      if (phoneNumber) {
        const contact = {
          phoneNumber,
          rowIndex: i,
          additionalData: {}
        };
        
        // Add other columns as additional data
        headers.forEach((header, index) => {
          if (index !== phoneColumnIndex && row[index]) {
            contact.additionalData[header] = row[index];
          }
        });
        
        contacts.push(contact);
      }
    }

    return {
      contacts,
      totalRows: rawData.length - 1,
      validContacts: contacts.length,
      headers
    };
  }

  static findPhoneColumn(headers) {
    const phoneKeywords = ['phone', 'number', 'telephone', 'tel', 'mobile', 'cell'];
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]?.toString().toLowerCase() || '';
      if (phoneKeywords.some(keyword => header.includes(keyword))) {
        return i;
      }
    }
    
    return -1;
  }

  static cleanPhoneNumber(phone) {
    if (!phone) return null;
    
    // Convert to string and remove all non-digit characters except +
    const cleaned = phone.toString().replace(/[^\d+]/g, '');
    
    // Basic validation - should have at least 10 digits
    const digitCount = cleaned.replace(/[^\d]/g, '').length;
    
    if (digitCount >= 10) {
      return cleaned;
    }
    
    return null;
  }

  static parseQuestions(questionsText) {
    if (!questionsText) {
      throw new Error('Questions text is required');
    }

    // Split by newlines and filter out empty lines
    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .map((question, index) => ({
        id: index + 1,
        text: question,
        type: 'open_ended' // Default type
      }));

    if (questions.length === 0) {
      throw new Error('No valid questions found');
    }

    return questions;
  }
}

module.exports = SpreadsheetParser;