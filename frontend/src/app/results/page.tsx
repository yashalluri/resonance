'use client'

import { useState } from 'react'
import { SurveyResponse } from '@/types'

export default function ResultsPage() {
  const [responses] = useState<SurveyResponse[]>([
    {
      leadId: '1',
      questionId: '1',
      response: 'The service was excellent!',
      sentiment: 'positive',
      timestamp: new Date()
    },
    {
      leadId: '2',
      questionId: '1',
      response: 'It was okay, nothing special.',
      sentiment: 'neutral',
      timestamp: new Date()
    }
  ])

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Survey Results</h1>
        <p className="mt-2 text-lg text-gray-600">
          View collected feedback and sentiment analysis
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Positive Responses</p>
              <p className="text-2xl font-bold text-green-600">
                {responses.filter(r => r.sentiment === 'positive').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Neutral Responses</p>
              <p className="text-2xl font-bold text-gray-600">
                {responses.filter(r => r.sentiment === 'neutral').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Negative Responses</p>
              <p className="text-2xl font-bold text-red-600">
                {responses.filter(r => r.sentiment === 'negative').length}
              </p>
            </div>
          </div>
        </div>

        {/* Response List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Responses</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {responses.map((response, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        Lead ID: {response.leadId}
                      </p>
                      <p className="mt-1 text-gray-900">{response.response}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(response.sentiment)}`}>
                      {response.sentiment?.charAt(0).toUpperCase() + response.sentiment?.slice(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {response.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Results</h3>
          <div className="space-y-4">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Export to Google Sheets
            </button>
            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 