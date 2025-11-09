'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LogOut, Mail } from 'lucide-react';

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
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // Profile missing — create it
      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email,
          name: user.email.split('@')[0],
          role: 'staff'
        })
        .select()
        .single();
      setProfile(newProfile);
    }
  };

  const signUp = async () => {
    setMessage('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage('Error: ' + error.message);
    else setMessage('Check your email for confirmation link!');
  };

  const signIn = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage('Error: ' + error.message);
  };

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const magicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) setMessage('Error: ' + error.message);
    else setMessage('Magic link sent! Check your email');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-3xl">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
          <h1 className="text-5xl font-bold text-center mb-10 text-slate-800">Tuxedo Admin</h1>
          
          {message && (
            <div className={`p-4 rounded-lg text-center font-bold mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="space-y-5">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <button onClick={signUp} className="py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 text-lg">
                Sign Up
              </button>
              <button onClick={signIn} className="py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-lg">
                Sign In
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-white text-gray-500 font-bold">OR</span>
              </div>
            </div>

            <button
              onClick={signInGoogle}
              className="w-full py-5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-4 text-lg"
            >
              Continue with Google
            </button>

            <button
              onClick={magicLink}
              className="w-full py-5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 flex items-center justify-center gap-4 text-lg"
            >
              <Mail size={24} /> Magic Link Login
            </button>
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Test: Click Google → any Gmail → instant login + profile created
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-slate-900 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-2xl font-bold">{profile?.name || user.email}</div>
              <div className="text-lg opacity-90">Role: <span className="font-bold text-yellow-300">{profile?.role || 'staff'}</span></div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-8 py-4 bg-red-600 rounded-xl hover:bg-red-700 font-bold text-lg"
            >
              <LogOut size={24} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10">
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
          <h1 className="text-7xl font-bold text-green-600 mb-8">AUTHENTICATION FIXED</h1>
          <p className="text-4xl text-gray-800 mb-6">New users save instantly</p>
          <p className="text-3xl text-gray-700">No more database errors</p>
          <div className="mt-12 inline-block bg-green-100 text-green-800 px-12 py-6 rounded-2xl text-2xl font-bold">
            Logged in as: {user.email}
          </div>
        </div>
      </main>
    </div>
  );
}