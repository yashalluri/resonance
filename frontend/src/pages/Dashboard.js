import React, { useState, useEffect } from 'react';
import { Phone, Users, Clock, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCampaigns: 0,
    recentCalls: [],
    systemStatus: 'healthy'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check backend health
      const healthResponse = await axios.get('/health');
      
      // For now, we'll use mock data since we don't have dashboard-specific endpoints
      setStats({
        totalCalls: 0,
        activeCampaigns: 0,
        recentCalls: [],
        systemStatus: healthResponse.data.status === 'OK' ? 'healthy' : 'error'
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats(prev => ({ ...prev, systemStatus: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      healthy: { color: 'success', text: 'All Systems Operational', icon: Activity },
      warning: { color: 'warning', text: 'Some Issues Detected', icon: AlertCircle },
      error: { color: 'error', text: 'System Issues', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.error;
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 text-${config.color}-600`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{config.text}</span>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your voice AI campaigns and system status</p>
        </div>
        <StatusIndicator status={stats.systemStatus} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Calls"
          value={stats.totalCalls}
          icon={Phone}
          color="primary"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Calls Today"
          value="0"
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Success Rate"
          value="--"
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Test */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Test</h2>
          <p className="text-gray-600 mb-6">
            Test the voice AI system with your phone number to ensure everything is working correctly.
          </p>
          <a
            href="/test-call"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Start Test Call</span>
          </a>
        </div>

        {/* System Info */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Backend Status</span>
              <StatusIndicator status={stats.systemStatus} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leaping AI</span>
              <span className="text-sm text-success-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="text-sm text-success-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        
        {stats.recentCalls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent calls</p>
            <p className="text-sm">Start a test call to see activity here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentCalls.map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{call.phoneNumber}</p>
                    <p className="text-sm text-gray-500">{call.campaign}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    call.status === 'completed' ? 'text-success-600' :
                    call.status === 'failed' ? 'text-error-600' :
                    'text-warning-600'
                  }`}>
                    {call.status}
                  </p>
                  <p className="text-xs text-gray-500">{call.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-primary-900 mb-2">Test the System</h3>
            <p className="text-sm text-primary-700">Start with a test call to your phone number</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-primary-900 mb-2">Create Campaign</h3>
            <p className="text-sm text-primary-700">Upload a spreadsheet and configure questions</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-primary-900 mb-2">Monitor Results</h3>
            <p className="text-sm text-primary-700">Track call progress and analyze responses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 