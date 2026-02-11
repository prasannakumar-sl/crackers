'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Simple authentication check
    if (username === 'prasanna' && password === 'pk160011') {
      // Store admin token/session (you can expand this with proper auth)
      localStorage.setItem('adminUser', username);
      // Redirect to admin panel
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Login</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <div className="flex items-center border border-gray-300 rounded px-4 py-3">
              <span className="text-gray-600 mr-3">👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Username"
                className="flex-1 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded px-4 py-3">
              <span className="text-gray-600 mr-3">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className="flex-1 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Powered by Prasanna Kumar
        </p>
      </div>
    </div>
  );
}
