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