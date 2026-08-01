'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, Compass, ArrowRight, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/manage';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to login';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-sm flex items-center gap-3 font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 focus:border-[#b8934b] rounded-xl text-[#1a1815] placeholder-gray-400 text-sm outline-none transition shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 focus:border-[#b8934b] rounded-xl text-[#1a1815] placeholder-gray-400 text-sm outline-none transition shadow-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl bg-[#1a1815] hover:bg-[#2b2722] text-[#c9a15a] font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-6"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Sign In to Dashboard <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#b8934b]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#b8934b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#f4efe6] border border-[#b8934b]/30 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1a1815] text-[#c9a15a] mb-4 border border-[#b8934b]/30 shadow-md">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1815] tracking-wide font-serif">
            Travel & Hault
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#b8934b] font-bold mt-1">
            Admin Content Manager
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-[#1a1815] text-xs">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-8 text-center border-t border-gray-300/80 pt-4">
          <p className="text-xs text-gray-600">
            Default credentials: <code className="text-[#b8934b] font-bold">admin</code> / <code className="text-[#b8934b] font-bold">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
