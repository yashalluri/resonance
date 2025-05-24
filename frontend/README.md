# Resonance Frontend

A modern React frontend for testing and managing Leaping AI voice campaigns.

## Features

- **Test Call Interface**: Easily test voice AI calls with your phone number
- **Campaign Manager**: Create and manage voice campaigns with spreadsheet uploads
- **Call History**: View past calls, responses, and transcripts
- **Real-time Status**: Monitor system health and call progress
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Prerequisites

- Node.js 16+ 
- Backend server running on `http://localhost:3001`
- Leaping AI credentials configured in backend

## Usage

### Testing Voice Calls

1. Go to the "Test Call" page
2. Enter your phone number
3. Add questions for the voice agent
4. Click "Start Test Call"
5. Answer your phone and interact with the AI

### Managing Campaigns

1. Go to the "Campaigns" page
2. Enter a campaign name
3. Upload a spreadsheet with contact data
4. Configure questions
5. Create and start the campaign

### Viewing Call History

1. Go to the "Call History" page
2. Browse past calls and their status
3. Click "View" to see detailed responses and transcripts
4. Use search and filters to find specific calls

## Spreadsheet Format

Your spreadsheet should include:
- `phoneNumber` column with valid US phone numbers
- Additional columns for contact information (optional)

Example:
```csv
phoneNumber,name,email
+15551234567,John Doe,john@example.com
+15559876543,Jane Smith,jane@example.com
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── App.js         # Main application component
├── index.js       # Application entry point
└── index.css      # Global styles and Tailwind
```

## Configuration

The frontend automatically proxies API requests to `http://localhost:3001`. 

To change the backend URL, update the `proxy` field in `package.json`.

## Troubleshooting

### Backend Connection Issues
- Ensure the backend server is running on port 3001
- Check that CORS is properly configured in the backend
- Verify the proxy setting in package.json

### Call Issues
- Verify Leaping AI credentials are configured in the backend
- Check that your phone number is in the correct format (+1XXXXXXXXXX)
- Ensure you have a valid Leaping AI account with calling credits

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are properly installed 