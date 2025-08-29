'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [testMessage, setTestMessage] = useState('Debug page loaded successfully');

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Debug & Monitoring Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Test and monitor error handling, logging, and performance metrics
        </p>
      </div>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p>{testMessage}</p>
        <button 
          onClick={() => setTestMessage('Button clicked at ' + new Date().toLocaleTimeString())}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Button
        </button>
      </div>

      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <p>This is a simplified debug page to test basic functionality.</p>
        <p>All advanced features are temporarily disabled.</p>
      </div>
    </div>
  );
}
