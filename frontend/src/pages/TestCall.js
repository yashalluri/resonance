import React, { useState } from 'react';
import { Phone, Plus, Trash2, Play, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const TestCall = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [callResult, setCallResult] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX
    if (digits.length >= 10) {
      const formatted = `+1 (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
      return formatted;
    }
    
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validateForm = () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return false;
    }

    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 11 || !digits.startsWith('1')) {
      toast.error('Please enter a valid US phone number');
      return false;
    }

    const validQuestions = questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question');
      return false;
    }

    return true;
  };

  const initiateTestCall = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setCallResult(null);

    try {
      // Create a temporary campaign for testing
      const campaignData = {
        name: `Test Call - ${new Date().toLocaleString()}`,
        questions: questions.filter(q => q.trim()),
        outputDestination: 'database'
      };

      // Create campaign first
      const campaignResponse = await axios.post('/api/campaigns/create', campaignData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!campaignResponse.data.success) {
        throw new Error('Failed to create test campaign');
      }

      const campaignId = campaignResponse.data.campaign.id;

      // Initiate the call
      const callResponse = await axios.post('/api/calls/initiate', {
        phoneNumber: phoneNumber.replace(/\D/g, '').replace(/^1/, '+1'),
        campaignId: campaignId,
        questions: questions.filter(q => q.trim())
      });

      if (callResponse.data.success) {
        setCallResult({
          success: true,
          callId: callResponse.data.callId,
          leapingCallId: callResponse.data.leapingCallId,
          status: callResponse.data.status,
          scheduledTime: callResponse.data.scheduledTime,
          campaignId: campaignId
        });
        
        toast.success('Test call initiated successfully! 📞');
      } else {
        throw new Error(callResponse.data.error || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('Test call error:', error);
      setCallResult({
        success: false,
        error: error.response?.data?.details || error.message
      });
      toast.error(`Failed to initiate call: ${error.response?.data?.details || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Voice AI Call</h1>
        <p className="text-lg text-gray-600">
          Enter your phone number and questions to test the Leaping AI voice agent
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-primary-600" />
            Call Configuration
          </h2>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="label">Your Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="+1 (555) 123-4567"
              className="input"
              maxLength={18}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your US phone number to receive the test call
            </p>
          </div>

          {/* Questions */}
          <div className="mb-6">
            <label className="label">Questions for the Voice Agent</label>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder={`Question ${index + 1}...`}
                    className="input flex-1"
                  />
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={addQuestion}
              className="mt-3 flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Initiate Call Button */}
          <button
            onClick={initiateTestCall}
            disabled={isLoading}
            className={`w-full btn ${isLoading ? 'btn-disabled' : 'btn-primary'} flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Initiating Call...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Test Call</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Call Status</h2>
          
          {!callResult && !isLoading && (
            <div className="text-center py-12 text-gray-500">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Configure your call settings and click "Start Test Call" to begin</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary-600 animate-spin" />
              <p className="text-gray-600">Setting up your test call...</p>
            </div>
          )}

          {callResult && (
            <div className="space-y-4">
              {callResult.success ? (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="font-medium text-success-800">Call Initiated Successfully!</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-success-700">
                    <p><strong>Call ID:</strong> {callResult.callId}</p>
                    <p><strong>Leaping AI Call ID:</strong> {callResult.leapingCallId}</p>
                    <p><strong>Status:</strong> {callResult.status}</p>
                    {callResult.scheduledTime && (
                      <p><strong>Scheduled Time:</strong> {callResult.scheduledTime}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-success-100 rounded-lg">
                    <p className="text-sm text-success-800">
                      📞 Your phone should ring shortly! The voice agent will ask you the questions you configured.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <XCircle className="h-5 w-5 text-error-600" />
                    <span className="font-medium text-error-800">Call Failed</span>
                  </div>
                  
                  <p className="text-sm text-error-700">{callResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
        <div className="space-y-2 text-blue-800">
          <p>1. Enter your phone number where you want to receive the test call</p>
          <p>2. Add one or more questions for the voice agent to ask you</p>
          <p>3. Click "Start Test Call" to initiate the call through Leaping AI</p>
          <p>4. Answer your phone and interact with the voice agent</p>
          <p>5. Check the call history to see the results and transcript</p>
        </div>
      </div>
    </div>
  );
};

export default TestCall; 