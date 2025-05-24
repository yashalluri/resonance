'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  text: string
}

export default function StartSurveyPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addQuestion = () => {
    if (!currentQuestion.trim()) return

    setQuestions([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: currentQuestion.trim(),
      },
    ])
    setCurrentQuestion('')
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleSubmit = async () => {
    if (questions.length === 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 to-purple-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Your Survey</h1>
          <p className="mt-2 text-lg text-gray-600">
            Add questions that you want to ask your customers
          </p>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Questions</h2>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-base font-medium text-gray-900">No questions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your first question below
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-200 text-blue-700 text-base font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 text-base font-medium">{question.text}</span>
                  </div>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove question"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Question Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add a Question</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-6 py-4 border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 text-lg shadow-sm"
              onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
            />
            <button
              onClick={addQuestion}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={questions.length === 0 || isSubmitting}
            className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-semibold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Survey'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 