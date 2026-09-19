import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, UserCircle } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/welcome');
    } catch (err) {
      console.error(err);
      setError('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInAnonymously(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Guest login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10"
        style={{ background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-blue-500/20 mb-4">
            <Activity className="text-blue-400" size={44} />
          </div>
          <h1 className="text-3xl font-bold text-white">NetCast AI</h1>
          <p className="text-gray-400 mt-2 text-center text-sm">
            AI-Powered Network Weather Forecasting
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-5 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 disabled:opacity-60 shadow-lg"
          >
            <svg width="22" height="22" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.5-3.4-11.3-8.1l-6.6 5C9.7 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6l6.2 5.2C41.3 35.4 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Guest Login Button */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-600 text-gray-300 font-semibold py-3.5 px-4 rounded-xl hover:border-gray-400 hover:text-white active:scale-95 transition-all duration-200 disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <UserCircle size={22} className="text-gray-400" />
            {loading ? 'Loading...' : 'Continue as Guest'}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-gray-600 text-xs text-center mt-8">
          Guest users have limited access. Sign in with Google for full features.
        </p>
      </div>
    </div>
  );
}

export default Login;
