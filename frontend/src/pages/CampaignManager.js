import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Plus, Trash2, Play, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import axios from 'axios';

const CampaignManager = () => {
  const [campaignName, setCampaignName] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

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

  const validateForm = () => {
    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name');
      return false;
    }

    if (!uploadedFile) {
      toast.error('Please upload a spreadsheet file');
      return false;
    }

    const validQuestions = questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question');
      return false;
    }

    return true;
  };

  const createCampaign = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    setCreatedCampaign(null);

    try {
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('questions', JSON.stringify(questions.filter(q => q.trim())));
      formData.append('outputDestination', 'database');
      formData.append('file', uploadedFile);

      const response = await axios.post('/api/campaigns/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setCreatedCampaign(response.data.campaign);
        toast.success('Campaign created successfully!');
        
        // Reset form
        setCampaignName('');
        setQuestions(['']);
        setUploadedFile(null);
      } else {
        throw new Error(response.data.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast.error(`Failed to create campaign: ${error.response?.data?.details || error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const startCampaign = async (campaignId) => {
    try {
      const response = await axios.post(`/api/campaigns/${campaignId}/start`);
      
      if (response.data.success) {
        toast.success('Campaign started successfully!');
        setCreatedCampaign(prev => ({ ...prev, status: 'running' }));
      } else {
        throw new Error(response.data.error || 'Failed to start campaign');
      }
    } catch (error) {
      console.error('Campaign start error:', error);
      toast.error(`Failed to start campaign: ${error.response?.data?.details || error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Campaign Manager</h1>
        <p className="text-lg text-gray-600">
          Create and manage voice AI campaigns with spreadsheet data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Creation Form */}
        <div className="space-y-6">
          {/* Campaign Name */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Details</h2>
            
            <div className="mb-4">
              <label className="label">Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name..."
                className="input"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Spreadsheet</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              
              {uploadedFile ? (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a spreadsheet'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .xlsx, .xls, and .csv files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Questions</h2>
            
            <div className="space-y-3 mb-4">
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
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Create Campaign Button */}
          <button
            onClick={createCampaign}
            disabled={isCreating}
            className={`w-full btn ${isCreating ? 'btn-disabled' : 'btn-primary'} flex items-center justify-center space-x-2`}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Campaign...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                <span>Create Campaign</span>
              </>
            )}
          </button>
        </div>

        {/* Campaign Preview/Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Campaign Status</h2>
          
          {!createdCampaign && !isCreating && (
            <div className="text-center py-12 text-gray-500">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Configure your campaign settings and click "Create Campaign"</p>
            </div>
          )}

          {isCreating && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary-600 animate-spin" />
              <p className="text-gray-600">Creating your campaign...</p>
            </div>
          )}

          {createdCampaign && (
            <div className="space-y-6">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <h3 className="font-medium text-success-800 mb-2">Campaign Created Successfully!</h3>
                <div className="space-y-2 text-sm text-success-700">
                  <p><strong>Name:</strong> {createdCampaign.name}</p>
                  <p><strong>ID:</strong> {createdCampaign.id}</p>
                  <p><strong>Total Contacts:</strong> {createdCampaign.totalContacts}</p>
                  <p><strong>Questions:</strong> {createdCampaign.questions?.length || 0}</p>
                  <p><strong>Status:</strong> {createdCampaign.status}</p>
                </div>
              </div>

              {createdCampaign.status === 'created' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Your campaign is ready to start. This will initiate calls to all contacts in your spreadsheet.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => startCampaign(createdCampaign.id)}
                    className="w-full btn btn-success flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Campaign</span>
                  </button>
                </div>
              )}

              {createdCampaign.status === 'running' && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <p className="text-sm text-warning-800">
                    Campaign is now running. Calls are being initiated to all contacts.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to create a campaign</h3>
        <div className="space-y-2 text-blue-800">
          <p>1. <strong>Campaign Name:</strong> Enter a descriptive name for your campaign</p>
          <p>2. <strong>Upload Spreadsheet:</strong> Upload a .xlsx, .xls, or .csv file with contact information</p>
          <p>3. <strong>Add Questions:</strong> Configure the questions the voice agent will ask</p>
          <p>4. <strong>Create Campaign:</strong> Review and create your campaign</p>
          <p>5. <strong>Start Campaign:</strong> Begin making calls to all contacts in your spreadsheet</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Spreadsheet Format:</strong> Ensure your spreadsheet has a "phoneNumber" column with valid phone numbers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager; 