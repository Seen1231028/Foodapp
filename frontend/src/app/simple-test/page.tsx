'use client';

import { useState } from 'react';

export default function SimpleTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing direct fetch to health endpoint...');
      const response = await fetch('http://localhost:4000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Health check data:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Health check error:', err);
      setError(err.message || 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const testDashboardAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing dashboard API...');
      const response = await fetch('http://localhost:4000/api/dashboard/shop-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token', // Use mock token for testing
        },
      });
      
      console.log('Dashboard response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dashboard data:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Dashboard API error:', err);
      setError(err.message || 'Dashboard API failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testHealthCheck}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health Check'}
        </button>

        <button 
          onClick={testDashboardAPI}
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
          <pre className="mt-2 text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}