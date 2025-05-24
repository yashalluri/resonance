<<<<<<< HEAD
# Voice-Based Customer Feedback Platform

A modern web application for automating customer feedback collection through voice calls, with built-in sentiment analysis and data organization capabilities.

## Features

- 📞 Automated voice call system for customer feedback
- 🎯 User-friendly interface for managing leads and survey questions
- 📊 Real-time transcription and sentiment analysis
- 📈 Data export to Google Sheets, Excel, or Airtable
- 📱 Responsive design for all devices

## Project Structure

```
.
├── frontend/           # Frontend Next.js application
│   ├── src/
│   │   ├── app/       # Next.js app directory
│   │   ├── components/# Reusable React components
│   │   ├── lib/       # Utility functions and configurations
│   │   └── types/     # TypeScript type definitions
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── README.md          # Project documentation
```

## Tech Stack

### Frontend
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Shadcn/ui (UI Components)
- React Hook Form (Form Management)
- Zod (Form Validation)
- Axios (API Client)

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-feedback-platform
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory and add the following environment variables:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Frontend
- `cd frontend` - Navigate to frontend directory
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.
=======
# Resonance

A comprehensive voice AI campaign platform that integrates with Leaping AI to automate customer feedback calls using spreadsheet data.

## 🚀 Features

- **Voice AI Integration**: Seamlessly integrates with Leaping AI for automated voice calls
- **Spreadsheet Processing**: Upload and process contact data from Excel/CSV files
- **Campaign Management**: Create, manage, and monitor voice AI campaigns
- **Test Interface**: Easy-to-use interface for testing calls with your own phone number
- **Real-time Monitoring**: Track call progress and view detailed results
- **Modern UI**: Beautiful, responsive React frontend with Tailwind CSS

## 📋 Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
npm start
```

### 2. Setup Frontend

```bash
# Run the setup script
./setup-frontend.sh

# Or manually:
cd frontend
npm install
npm start
```

### 3. Configure Environment

Create a `.env` file in the backend directory:

```env
# Leaping AI Configuration
LEAPING_AI_USERNAME=your_username
LEAPING_AI_PASSWORD=your_password
# OR use token directly:
LEAPING_AI_TOKEN=your_api_token

# Phone Configuration
FROM_PHONE_NUMBER=+1234567890

# Backend Configuration
BACKEND_URL=http://localhost:3001
PORT=3001
```

## 🎯 Usage

### Testing Voice Calls

1. Open the frontend at `http://localhost:3000`
2. Navigate to "Test Call"
3. Enter your phone number
4. Add questions for the voice agent
5. Click "Start Test Call"
6. Answer your phone and interact with the AI

### Creating Campaigns

1. Go to "Campaigns" in the frontend
2. Enter a campaign name
3. Upload a spreadsheet with contact data
4. Configure questions for the voice agent
5. Create and start the campaign

### Monitoring Results

1. View real-time progress in the dashboard
2. Check "Call History" for detailed results
3. Review transcripts and responses

## 📊 Spreadsheet Format

Your spreadsheet should include a `phoneNumber` column:

```csv
phoneNumber,name,email
+15551234567,John Doe,john@example.com
+15559876543,Jane Smith,jane@example.com
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   Leaping AI    │
│                 │    │                 │    │                 │
│ • Test Interface│◄──►│ • API Routes    │◄──►│ • Voice Calls   │
│ • Campaign Mgmt │    │ • File Upload   │    │ • AI Agents     │
│ • Call History  │    │ • Database      │    │ • Transcripts   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Development

### Backend Structure

```
backend/
├── routes/           # API route handlers
├── services/         # Business logic services
├── uploads/          # File upload storage
├── data/            # Database files
└── server.js        # Main server file
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Main application pages
│   └── App.js       # Main application component
└── public/          # Static assets
```

## 🔧 API Endpoints

### Calls
- `POST /api/calls/initiate` - Initiate a voice call
- `POST /api/calls/callback` - Webhook for call completion
- `GET /api/calls/:callId` - Get call details

### Campaigns
- `POST /api/campaigns/create` - Create a new campaign
- `POST /api/campaigns/:id/start` - Start a campaign
- `GET /api/campaigns/:id/status` - Get campaign status

### Health
- `GET /health` - Backend health check

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LEAPING_AI_USERNAME` | Leaping AI username | Yes* |
| `LEAPING_AI_PASSWORD` | Leaping AI password | Yes* |
| `LEAPING_AI_TOKEN` | Leaping AI API token | Yes* |
| `FROM_PHONE_NUMBER` | Your Leaping AI phone number | Yes |
| `BACKEND_URL` | Backend URL for callbacks | Yes |
| `PORT` | Backend server port | No (default: 3001) |

*Either username/password OR token is required

## 🚨 Troubleshooting

### Backend Issues
- Ensure all environment variables are set
- Check Leaping AI credentials and account status
- Verify phone number format (+1XXXXXXXXXX)

### Frontend Issues
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify proxy configuration in package.json

### Call Issues
- Confirm Leaping AI account has calling credits
- Check phone number format and validity
- Review Leaping AI dashboard for call logs

## 📝 License

This project is for demonstration and testing purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues related to:
- **Leaping AI**: Check their [documentation](https://leapingai.mintlify.io/)
- **This Platform**: Create an issue in this repository
>>>>>>> 58bda6c (adding backend)
