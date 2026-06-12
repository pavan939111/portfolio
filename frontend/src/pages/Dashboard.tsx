import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { TelemetryData } from '../types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Database, Clock, HelpCircle, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await api.getTelemetry();
        setTelemetry(data);
      } catch (err) {
        console.error('Failed to load telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [refreshKey]);

  const triggerRefresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const COLORS = ['#00F5FF', '#a78bfa', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <section className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-cyan animate-pulse" />
            Agent Telemetry & Telemetries
          </h1>
          <p className="text-slate-400 max-w-xl text-sm">
            Real-time analytics logs showing system workloads, token footprints, inference speeds, and API costs.
          </p>
        </div>
        <button
          onClick={triggerRefresh}
          className="p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Refresh Telemetry Data"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </section>

      {loading && !telemetry ? (
        <div className="text-slate-500 italic animate-pulse">▋ Querying telemetry server dashboard...</div>
      ) : (
        telemetry && (
          <>
            {/* Overview cards grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Queries */}
              <div className="glass-panel p-5 rounded-lg flex flex-col justify-between h-28 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>Total System Requests</span>
                  <HelpCircle size={15} />
                </div>
                <div>
                  <span className="text-2xl font-display font-bold text-white tracking-tight">
                    {telemetry.summary.totalQueries}
                  </span>
                  {telemetry.summary.isMock && (
                    <span className="text-[9px] text-amber-500 font-semibold uppercase font-mono ml-2">Mock</span>
                  )}
                </div>
              </div>

              {/* Card 2: Avg Latency */}
              <div className="glass-panel p-5 rounded-lg flex flex-col justify-between h-28 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>Avg Latency (ms)</span>
                  <Clock size={15} />
                </div>
                <span className="text-2xl font-display font-bold text-cyan tracking-tight">
                  {telemetry.summary.avgLatencyMs}ms
                </span>
              </div>

              {/* Card 3: Total Tokens */}
              <div className="glass-panel p-5 rounded-lg flex flex-col justify-between h-28 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>Total Tokens Consumed</span>
                  <Database size={15} />
                </div>
                <span className="text-2xl font-display font-bold text-white tracking-tight">
                  {telemetry.summary.totalTokens.toLocaleString()}
                </span>
              </div>

              {/* Card 4: Total Cost */}
              <div className="glass-panel p-5 rounded-lg flex flex-col justify-between h-28 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>Accrued API Cost</span>
                  <DollarSign size={15} />
                </div>
                <span className="text-2xl font-display font-bold text-emerald-400 tracking-tight">
                  ${telemetry.summary.totalCostUsd.toFixed(4)}
                </span>
              </div>
            </section>

            {/* Graphs Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latency and Query Activity */}
              <div className="glass-panel p-5 rounded-lg border border-slate-800/80 lg:col-span-2 space-y-4">
                <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                  Weekly Query & Latency Velocity
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetry.weeklyAnalytics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="#475569" fontSize={11} fontStyle="italic" />
                      <YAxis stroke="#475569" fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="queries" stroke="#00F5FF" strokeWidth={2} activeDot={{ r: 6 }} name="Queries" />
                      <Line type="monotone" dataKey="avgLatency" stroke="#f59e0b" strokeWidth={2} name="Avg Latency (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tool Execution Percentages */}
              <div className="glass-panel p-5 rounded-lg border border-slate-800/80 flex flex-col justify-between space-y-4">
                <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                  Tool Calls Footprint
                </h3>
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={telemetry.toolUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {telemetry.toolUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} executions`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legend */}
                <div className="space-y-1.5 text-[10px] font-mono text-slate-500">
                  {telemetry.toolUsage.map((tool, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span>{tool.name}</span>
                      </div>
                      <span className="text-slate-400 font-semibold">{tool.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Live Active Logs list */}
            <section className="space-y-3">
              <h3 className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest px-1">
                Recent Agent Console Logs
              </h3>

              <div className="w-full h-60 bg-slate-950/70 border border-slate-900 rounded-lg p-4 font-mono text-[11px] overflow-y-auto space-y-3.5 scrollbar-thin">
                {telemetry.recentLogs.map((log) => (
                  <div key={log.id} className="pb-3 border-b border-slate-900 last:border-0 space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>[{new Date(log.created_at).toLocaleString()}] thread_id://{log.id.slice(0, 8)}</span>
                      <span className="text-cyan">{log.latency_ms}ms</span>
                    </div>
                    <div>
                      <span className="text-slate-400">INPUT:</span> <span className="text-white">{log.user_query}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-slate-600">
                      <span>TOKENS: {log.tokens_used}</span>
                      <span>COST: ${log.cost_usd.toFixed(5)}</span>
                      <span>TOOLS: {log.tools_called.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )
      )}
    </div>
  );
};
