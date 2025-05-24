'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'

function normalizeHeader(header: string) {
  return header
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
}

function generateRequestId() {
  return 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

export default function LeadsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            // Normalize headers
            const rawHeaders = results.meta.fields || []
            const normHeaders = rawHeaders.map(normalizeHeader)
            setHeaders(normHeaders)
            // Normalize data keys
            const normData = (results.data as any[]).map(row => {
              const newRow: any = {}
              rawHeaders.forEach((h, i) => {
                newRow[normHeaders[i]] = row[h]
              })
              return newRow
            })
            setPreviewData(normData)
            setConfirmed(false)
          }
        },
      })
    }
  }

  const handleConfirm = () => {
    setConfirmed(true)
  }

  const handleContinue = async () => {
    setIsLoading(true)
    // Store as a new request in localStorage
    const newRequest = {
      id: generateRequestId(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Complete',
      customers: previewData,
    }
    const prev = localStorage.getItem('requests')
    let requests = prev ? JSON.parse(prev) : []
    requests.unshift(newRequest)
    localStorage.setItem('requests', JSON.stringify(requests))
    setTimeout(() => {
      setIsLoading(false)
      router.push('/start-survey?id=' + newRequest.id)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Upload Customer List</h1>
        <p className="text-lg text-blue-700 mb-8 text-center">Upload your customer contact list to start your survey process</p>
        <form className="w-full space-y-6">
          <div className="mb-4">
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV file with any columns (e.g., name, phone number, product, etc.)
            </p>
          </div>

          {previewData.length > 0 && !confirmed && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="even:bg-gray-50">
                        {headers.map((h) => (
                          <td key={h} className="px-4 py-2 text-gray-900">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">Showing up to 5 rows for preview.</p>
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-4 w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md"
              >
                Confirm & Continue
              </button>
            </div>
          )}

          {confirmed && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Survey'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 