'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import Footer from '@/components/christmas/Footer';
import type { AdminStats, DailyStats } from '@/types';
import {
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  Send,
  Share2,
  Download,
  Copy,
  Users,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface StatsResponse {
  summary: AdminStats | null;
  daily: DailyStats[];
  total_wishes_in_db: number;
  range: string;
  privacy_note: string;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [range, setRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Check saved token on mount
  useEffect(() => {
    const saved = localStorage.getItem('pi_admin_token');
    if (saved) {
      setToken(saved);
      setIsAuthenticated(true);
      fetchStats(saved, range);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('pi_admin_token', token);
      setIsAuthenticated(true);
      fetchStats(token, range);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {}
    localStorage.removeItem('pi_admin_token');
    setIsAuthenticated(false);
    setStats(null);
    setToken('');
  };

  const fetchStats = async (authToken: string, selectedRange: string) => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/stats?range=${selectedRange}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    if (token) {
      fetchStats(token, newRange);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Campaign Home</span>
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            Paradigm Institute — Admin Console
          </h1>
        </div>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {!isAuthenticated ? (
          /* Login Box */
          <div className="max-w-md mx-auto my-16 festive-card p-8 border border-[#D4AF37]/30 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl mx-auto mb-4 text-[#F5D76E]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-center text-white mb-2">
              Admin Authentication
            </h2>
            <p className="text-xs text-center text-white/60 mb-6">
              Enter your admin security token to view campaign metrics and analytics.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#F5D76E] uppercase tracking-wider mb-2">
                  Secret Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter ADMIN_AUTH_SECRET"
                  className="festive-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3 text-xs tracking-wider uppercase font-bold"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Campaign Telemetry & Performance
                </h2>
                <p className="text-xs text-white/60">
                  Aggregated, anonymous metrics for Paradigm Institute Christmas campaign.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Range Selector */}
                <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-medium">
                  {['today', '7d', '30d', 'all'].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRangeChange(r)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        range === r ? 'bg-[#D4AF37] text-black font-bold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchStats(token, range)}
                  disabled={refreshing}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 transition-colors"
                  aria-label="Refresh statistics"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="festive-card p-5 border border-[#D4AF37]/30">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Wishes</span>
                  <Send className="w-4 h-4 text-[#F5D76E]" />
                </div>
                <div className="text-3xl font-extrabold font-serif text-[#F5D76E]">
                  {stats?.summary?.total_wishes_created ?? stats?.total_wishes_in_db ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Unique greetings created</p>
              </div>

              <div className="festive-card p-5 border border-white/10">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Page Views</span>
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold font-serif text-white">
                  {stats?.summary?.total_page_views ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Campaign visits recorded</p>
              </div>

              <div className="festive-card p-5 border border-white/10">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">WhatsApp Shares</span>
                  <Share2 className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="text-3xl font-extrabold font-serif text-white">
                  {stats?.summary?.total_whatsapp_shares ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Direct WhatsApp clicks</p>
              </div>

              <div className="festive-card p-5 border border-white/10">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Card Downloads</span>
                  <Download className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-serif text-white">
                  {stats?.summary?.total_card_downloads ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Exported PNG cards</p>
              </div>

              <div className="festive-card p-5 border border-white/10">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Link Copies</span>
                  <Copy className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold font-serif text-white">
                  {stats?.summary?.total_link_copies ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Direct links copied</p>
              </div>

              <div className="festive-card p-5 border border-white/10">
                <div className="flex items-center justify-between text-white/60 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Unique Browsers</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-serif text-white">
                  {stats?.summary?.unique_visiting_browsers ?? 0}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Distinct session hashes</p>
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-white/70">
              <ShieldCheck className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Privacy Guarantee: </span>
                {stats?.privacy_note ||
                  'All statistics are strictly aggregate counts. No PII, phone numbers, or emails are stored or tracked.'}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

