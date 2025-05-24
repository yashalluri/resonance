import React, { useState, useEffect } from 'react';
import { Phone, Clock, CheckCircle, XCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import axios from 'axios';

const CallHistory = () => {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      // For now, we'll use mock data since we don't have a specific call history endpoint
      // In a real implementation, you'd call something like /api/calls/history
      
      // Mock data for demonstration
      const mockCalls = [
        {
          id: 1,
          phoneNumber: '+1 (555) 123-4567',
          campaignName: 'Test Call - 12/20/2024',
          status: 'completed',
          createdAt: '2024-12-20T10:30:00Z',
          completedAt: '2024-12-20T10:35:00Z',
          responses: [
            { question: 'How satisfied are you with our service?', answer: 'Very satisfied' },
            { question: 'Would you recommend us to others?', answer: 'Yes, definitely' }
          ],
          transcript: 'Hello, this is a voice AI agent calling to ask you a few questions about our service...'
        }
      ];
      
      setCalls(mockCalls);
    } catch (error) {
      console.error('Failed to fetch call history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-error-600" />;
      case 'pending':
      case 'initiated':
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      case 'pending':
      case 'initiated':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const CallDetailModal = ({ call, onClose }) => {
    if (!call) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Call Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{call.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign</label>
                  <p className="text-gray-900">{call.campaignName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(call.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">
                    {call.completedAt ? 
                      `${Math.round((new Date(call.completedAt) - new Date(call.createdAt)) / 60000)} minutes` :
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* Responses */}
              {call.responses && call.responses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Responses</h3>
                  <div className="space-y-3">
                    {call.responses.map((response, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-2">{response.question}</p>
                        <p className="text-gray-700">{response.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {call.transcript && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Call Transcript</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{call.transcript}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500">Created At</label>
                    <p className="text-gray-900">{formatDate(call.createdAt)}</p>
                  </div>
                  {call.completedAt && (
                    <div>
                      <label className="font-medium text-gray-500">Completed At</label>
                      <p className="text-gray-900">{formatDate(call.completedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Call History</h1>
        <p className="text-gray-600">View and analyze past voice AI calls and their results</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by phone number or campaign..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="initiated">Initiated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Call List */}
      <div className="card">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No calls found</p>
            <p>
              {calls.length === 0 
                ? "Start making calls to see them here"
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Phone Number</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{call.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{call.campaignName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(call.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(call.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedCall(call)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
};

export default CallHistory; 