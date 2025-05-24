'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RequestDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [customers, setCustomers] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = params?.id
    const stored = localStorage.getItem('requests')
    if (stored && id) {
      const requests = JSON.parse(stored)
      const req = requests.find((r: any) => r.id === id)
      if (req && req.customers && req.customers.length > 0) {
        setCustomers(req.customers)
        setHeaders(Object.keys(req.customers[0]))
      } else {
        setNotFound(true)
      }
    } else {
      setNotFound(true)
    }
  }, [params])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 to-purple-50 py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all font-semibold"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Request Details</h1>
        {notFound ? (
          <p className="text-red-500">Request not found or has no customer data.</p>
        ) : customers.length === 0 ? (
          <p className="text-gray-500">No customer data found for this request.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-base">
              <thead className="bg-blue-50">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-bold text-blue-800 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((row, i) => (
                  <tr key={i} className="even:bg-blue-50 hover:bg-blue-100 transition-all">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-2 text-gray-900">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 