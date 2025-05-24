'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  // Load requests from localStorage (simulate backend)
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('requests')
    if (stored) {
      setRequests(JSON.parse(stored))
    } else {
      setRequests([])
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your customer feedback requests and view results
          </p>
        </div>

        {/* Start New Survey Button */}
        <div className="flex justify-end mb-8">
          <Link
            href="/leads"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg text-lg"
          >
            Start New Survey
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Requests</h2>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Customers</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.length === 0 ? (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No requests yet</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-blue-50 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-semibold">{req.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{req.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-green-600 font-semibold">{req.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{req.customers.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base">
                        <Link href={`/requests/${req.id}`} className="text-blue-600 font-bold cursor-pointer hover:underline">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results yet</h3>
            <p className="mt-1 text-base text-gray-500">
              Start a new survey to see results here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 