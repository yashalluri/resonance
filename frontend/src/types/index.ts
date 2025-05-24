export interface Lead {
  id: string
  name: string
  phoneNumber: string
  email?: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  lastContacted?: Date
}

export interface SurveyQuestion {
  id: string
  question: string
  type: 'open-ended' | 'multiple-choice' | 'rating'
  options?: string[]
  required: boolean
}

export interface SurveyResponse {
  leadId: string
  questionId: string
  response: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  timestamp: Date
}

export interface Survey {
  id: string
  name: string
  description?: string
  questions: SurveyQuestion[]
  createdAt: Date
  updatedAt: Date
}

export interface ExportDestination {
  type: 'google-sheets' | 'excel' | 'airtable'
  url?: string
  apiKey?: string
  sheetName?: string
} 