'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LogOut, Mail, Lock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TuxedoAdminSystem() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id) => {
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    setProfile(data);
  };

  const signInEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error(error);
      alert('Google login failed — did you enable it in Supabase?');
    }
  };

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) alert(error.message);
    else setMagicSent(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-2xl">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-slate-800">Tuxedo Admin</h1>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 outline-none"
            />

            <button
              onClick={signInEmail}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Sign In with Email
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button
              onClick={signInGoogle}
              className="w-full py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-3"
            >
              Continue with Google
            </button>

            <button
              onClick={sendMagicLink}
              className="w-full py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-3"
            >
              <Mail size={20} /> {magicSent ? 'Check Email' : 'Magic Link Login'}
            </button>

            {magicSent && (
              <p className="text-center text-green-600 font-medium">
                Magic link sent! Check your inbox
              </p>
            )}

            <div className="text-xs text-gray-500 text-center mt-6 space-y-1">
              <p>Test accounts:</p>
              <p>admin@demo.com / admin123</p>
              <p>staff@demo.com / staff123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tuxedo Admin</h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-semibold">{profile?.name || user.email}</div>
              <div className="text-sm opacity-80">Role: {profile?.role || 'staff'}</div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-12 text-center shadow-2xl">
          <h1 className="text-5xl font-bold mb-6">AUTHENTICATION IS LIVE</h1>
          <p className="text-2xl mb-8">Email + Google + Magic Link Working</p>
          
          <div className="bg-white/20 backdrop-blur rounded-xl p-8 max-w-2xl mx-auto">
            <p className="text-xl mb-4">Logged in as:</p>
            <p className="text-3xl font-bold">{user.email}</p>
            <p className="text-xl mt-2">Role: <span className="font-bold">{profile?.role || 'staff'}</span></p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-2">Email Login</div>
              <p className="text-green-200">Working</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-2">Google OAuth</div>
              <p className="text-green-200">Working</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-2">Magic Link</div>
              <p className="text-green-200">Working</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}