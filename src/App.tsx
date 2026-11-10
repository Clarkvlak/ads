/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Shield, Zap, Globe, Lock, Unlock, 
  Settings, RefreshCw, Play, CheckCircle2, Trash2, Plus, 
  Filter, Activity, Cpu, Radio, Eye, EyeOff, Check, X, Sliders
} from 'lucide-react';

interface RequestLog {
  id: string;
  domain: string;
  type: 'Script' | 'Image' | 'XHR' | 'Beacon' | 'Stylesheet';
  status: 'Blocked' | 'Allowed';
  time: string;
  source: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'filters' | 'settings'>('dashboard');
  
  // Shield settings
  const [blockAds, setBlockAds] = useState(true);
  const [blockTrackers, setBlockTrackers] = useState(true);
  const [blockMiners, setBlockMiners] = useState(true);
  const [blockSocial, setBlockSocial] = useState(true);
  const [blockBanners, setBlockBanners] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalScanned: 142850,
    totalBlocked: 48920,
    bandwidthSaved: '342 MB',
    avgLoadBoost: '+42%'
  });

  // Custom filter rules
  const [customRules, setCustomRules] = useState<string[]>([
    'ads.annoyingtracker.com',
    'analytics.badsite.net',
    '*.popupserver.org'
  ]);
  const [newRuleInput, setNewRuleInput] = useState('');

  // Live request stream
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([
    { id: '1', domain: 'google-analytics.com/collect', type: 'Beacon', status: 'Blocked', time: 'Just now', source: 'example.com' },
    { id: '2', domain: 'connect.facebook.net/en_US/fbevents.js', type: 'Script', status: 'Blocked', time: '1s ago', source: 'news-site.org' },
    { id: '3', domain: 'api.github.com/graphql', type: 'XHR', status: 'Allowed', time: '3s ago', source: 'github.com' },
    { id: '4', domain: 'doubleclick.net/ad.js', type: 'Script', status: 'Blocked', time: '5s ago', source: 'blog.net' },
    { id: '5', domain: 'fonts.googleapis.com/css2', type: 'Stylesheet', status: 'Allowed', time: '8s ago', source: 'app.io' },
  ]);

  // Simulate live requests coming in
  useEffect(() => {
    const domains = [
      'adservice.google.com/ads',
      'api.mixpanel.com/track',
      'cdnjs.cloudflare.com/ajax/libs/react/19.0.1',
      'telemetry.browser.microsoft.com',
      'analytics.twitter.com/i/ads',
      'api.stripe.com/v1/tokens'
    ];
    const sources = ['techblog.io', 'shop-online.com', 'news-feed.net', 'github.com'];
    const types: ('Script' | 'Image' | 'XHR' | 'Beacon' | 'Stylesheet')[] = ['Script', 'Image', 'XHR', 'Beacon', 'Stylesheet'];

    const interval = setInterval(() => {
      const randDomain = domains[Math.floor(Math.random() * domains.length)];
      const isAdOrTracker = randDomain.includes('ad') || randDomain.includes('analytics') || randDomain.includes('telemetry');
      const shouldBlock = (isAdOrTracker && (blockAds || blockTrackers));

      const newLog: RequestLog = {
        id: Math.random().toString(36).substring(7),
        domain: randDomain,
        type: types[Math.floor(Math.random() * types.length)],
        status: shouldBlock ? 'Blocked' : 'Allowed',
        time: 'Just now',
        source: sources[Math.floor(Math.random() * sources.length)]
      };

      setRequestLogs(prev => [newLog, ...prev.slice(0, 19)]);
      setStats(prev => ({
        ...prev,
        totalScanned: prev.totalScanned + 1,
        totalBlocked: shouldBlock ? prev.totalBlocked + 1 : prev.totalBlocked
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [blockAds, blockTrackers]);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput.trim()) return;
    setCustomRules(prev => [...prev, newRuleInput.trim()]);
    setNewRuleInput('');
  };

  const handleRemoveRule = (rule: string) => {
    setCustomRules(prev => prev.filter(r => r !== rule));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar Contract (3 zones) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              NetShield <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">PRO v3.2</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Private Ad-Blocking & Tracker Mitigation Control Center</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'dashboard' ? 'text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'logs' ? 'text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
          >
            Live Request Log
          </button>
          <button 
            onClick={() => setActiveTab('filters')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'filters' ? 'text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
          >
            Custom Filters
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'settings' ? 'text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
          >
            Shield Rules
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SHIELD ACTIVE
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium uppercase">Requests Scanned</div>
                <div className="text-2xl font-bold font-mono text-white">{stats.totalScanned.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 font-mono">Real-time filtering enabled</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium uppercase">Ads & Trackers Blocked</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{stats.totalBlocked.toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-mono">{((stats.totalBlocked / stats.totalScanned) * 100).toFixed(1)}% block efficiency</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium uppercase">Bandwidth Saved</div>
                <div className="text-2xl font-bold font-mono text-white">{stats.bandwidthSaved}</div>
                <div className="text-xs text-emerald-400 font-mono">Zero junk data loaded</div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium uppercase">Page Load Speed Boost</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{stats.avgLoadBoost}</div>
                <div className="text-xs text-slate-500 font-mono">Faster private browsing</div>
              </div>
            </div>

            {/* Quick Shield Toggles */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    <span>Private Shield Filters</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Configure what categories of network requests get blocked across your private session.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">Block Display & Video Ads</div>
                    <div className="text-xs text-slate-400">Stops banner ads, video overlays, and sponsored links.</div>
                  </div>
                  <button 
                    onClick={() => setBlockAds(!blockAds)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${blockAds ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${blockAds ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">Block Cross-Site Trackers</div>
                    <div className="text-xs text-slate-400">Prevents analytics beacons and user profiling cookies.</div>
                  </div>
                  <button 
                    onClick={() => setBlockTrackers(!blockTrackers)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${blockTrackers ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${blockTrackers ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">Block Crypto Cryptominers</div>
                    <div className="text-xs text-slate-400">Stops hidden in-browser JavaScript coin miners.</div>
                  </div>
                  <button 
                    onClick={() => setBlockMiners(!blockMiners)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${blockMiners ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${blockMiners ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">Block Annoying Cookie Banners</div>
                    <div className="text-xs text-slate-400">Automatically hides GDPR/CCPA consent popups.</div>
                  </div>
                  <button 
                    onClick={() => setBlockBanners(!blockBanners)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 ${blockBanners ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${blockBanners ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Request Log */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Live Network Request Stream</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Real-time inspection of DNS requests and outgoing web assets.</p>
              </div>
              <button 
                onClick={() => setRequestLogs([])}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors"
              >
                Clear Log
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-900">
                      <th className="p-4">Domain / URL</th>
                      <th className="p-4">Source Page</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-mono">
                    {requestLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 text-white font-semibold truncate max-w-xs">{log.domain}</td>
                        <td className="p-4 text-slate-400 text-xs">{log.source}</td>
                        <td className="p-4 text-slate-300 text-xs">{log.type}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-1 rounded font-sans font-bold ${log.status === 'Blocked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-slate-500 text-xs">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Filters */}
        {activeTab === 'filters' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-400" />
                  <span>Custom Domain Blocking Rules</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Add specific domains or wildcards to block for your private browsing sessions.</p>
              </div>

              <form onSubmit={handleAddRule} className="flex gap-3">
                <input 
                  type="text" 
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  placeholder="e.g. tracker.badsite.com or *.annoyingads.net"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Add Rule</span>
                </button>
              </form>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Custom Rules</h3>
                <div className="space-y-2 font-mono text-xs">
                  {customRules.map((rule, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                      <span>{rule}</span>
                      <button onClick={() => handleRemoveRule(rule)} className="text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>Shield Engine Configuration</span>
              </h2>
              <p className="text-xs text-slate-400">
                NetShield Pro runs entirely locally in your private session to ensure zero data leakage and maximum browsing speed.
              </p>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                <div className="font-bold">Private & Secure</div>
                <p>No browsing logs or filter hits leave your browser. All blocking rules are evaluated in-memory.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        NetShield Pro · Private Ad-Blocking & Tracker Mitigation Control Center
      </footer>
    </div>
  );
}
