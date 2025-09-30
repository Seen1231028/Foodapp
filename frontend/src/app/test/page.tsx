'use client';

import { useState } from 'react';
import apiService from '@/lib/api';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing API connection...');
      // Direct fetch to test network connectivity
      const directResponse = await fetch('http://localhost:4000/api/health');
      const directData = await directResponse.json();
      console.log('Direct fetch response:', directData);
      
      // Now test via apiService
      const response = await apiService.healthCheck();
      console.log('Health check response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  };

  const testDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing Dashboard API...');
      const response = await apiService.getShopStats();
      console.log('Dashboard response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Dashboard API Error:', err);
      setError(err.message || 'Dashboard API call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health Check API'}
        </button>

        <button 
          onClick={testDashboard}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Dashboard API'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <strong>Success:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}