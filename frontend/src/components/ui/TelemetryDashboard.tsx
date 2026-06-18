import React, { useEffect, useState } from 'react';
import { X, RefreshCw, BarChart2, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { fetchTelemetry } from '../../services/api';
import type { TelemetryResponse } from '../../services/api';

interface TelemetryDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<TelemetryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTelemetry();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch system telemetry. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate scaling for SVG bar chart
  const weeklyAnalytics = data?.weeklyAnalytics || [];
  const maxQueries = weeklyAnalytics.length > 0 ? Math.max(...weeklyAnalytics.map(w => w.queries), 1) : 1;

  // Calculate scaling for tool usage progress bars
  const toolUsage = data?.toolUsage || [];
  const maxToolCount = toolUsage.length > 0 ? Math.max(...toolUsage.map(t => t.value), 1) : 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        zIndex: 1500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="custom-scrollbar"
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(0, 243, 255, 0.15)',
          borderRadius: '20px',
          padding: '28px',
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(0,243,255,0.05)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'rgba(0, 243, 255, 0.1)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '28px',
            paddingRight: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headings)',
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
              }}
            >
              ⚙️ System Performance Telemetry
            </h2>
            {data && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: data.summary.isMock ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${data.summary.isMock ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                  color: data.summary.isMock ? '#F59E0B' : 'var(--accent-green)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {data.summary.isMock ? '⚡ Fallback Demo Mode' : '🟢 Live Database Connect'}
              </span>
            )}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            Real-time tracking of dense-sparse retrieval queries, model latency footprint, and execution costs.
          </p>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>Polling telemetry logs...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px', border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <ShieldAlert size={40} style={{ color: '#EF4444' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#EF4444', fontWeight: 600 }}>{error}</p>
            <button
              onClick={loadData}
              style={{
                padding: '8px 16px',
                background: 'rgba(0, 243, 255, 0.1)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {data && !loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Metric Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Total Queries */}
              <div
                className="glass-card"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>TOTAL QUERIES</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-headings)', color: 'var(--text-primary)' }}>
                    {data.summary.totalQueries}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>requests</span>
                </div>
              </div>

              {/* Average Latency */}
              <div
                className="glass-card"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>AVG RAG LATENCY</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-headings)', color: 'var(--text-primary)' }}>
                    {data.summary.avgLatencyMs}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ms</span>
                </div>
              </div>

              {/* Total Tokens */}
              <div
                className="glass-card"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>LLM FOOTPRINT</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-headings)', color: 'var(--text-primary)' }}>
                    {data.summary.totalTokens.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>tokens</span>
                </div>
              </div>

              {/* Total Cost */}
              <div
                className="glass-card"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>ESTIMATED COST</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-headings)', color: 'var(--accent-primary)' }}>
                    ${data.summary.totalCostUsd.toFixed(4)}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>USD</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '28px' }}>
              {/* Weekly Queries Chart */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <BarChart2 size={16} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Query Load</h3>
                </div>
                
                {/* SVG Bar Chart */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <svg width="100%" height="200" viewBox="0 0 500 200" style={{ overflow: 'visible' }}>
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.1)" />

                    {weeklyAnalytics.map((w, idx) => {
                      const x = 50 + idx * 60;
                      // Max bar height is 130px
                      const barHeight = (w.queries / maxQueries) * 130;
                      const y = 160 - barHeight;
                      
                      return (
                        <g key={w.day}>
                          {/* Sleek Gradient Bar */}
                          <defs>
                            <linearGradient id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent-primary)" />
                              <stop offset="100%" stopColor="rgba(0, 243, 255, 0.1)" />
                            </linearGradient>
                          </defs>
                          <rect
                            x={x}
                            y={y}
                            width="28"
                            height={barHeight}
                            fill={`url(#barGrad-${idx})`}
                            rx="4"
                            style={{ transition: 'height 0.5s ease-out, y 0.5s ease-out' }}
                          />
                          {/* Value above bar */}
                          <text
                            x={x + 14}
                            y={y - 6}
                            textAnchor="middle"
                            fill="var(--text-primary)"
                            fontSize="10"
                            fontFamily="var(--font-mono)"
                          >
                            {w.queries}
                          </text>
                          {/* Day label */}
                          <text
                            x={x + 14}
                            y="178"
                            textAnchor="middle"
                            fill="var(--text-muted)"
                            fontSize="11"
                            fontFamily="var(--font-mono)"
                          >
                            {w.day}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Tool Footprint Chart */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>RAG & LLM Tool Footprint</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {toolUsage.map((tool, idx) => {
                    const pct = (tool.value / maxToolCount) * 100;
                    return (
                      <div key={tool.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{tool.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{tool.value} calls</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: idx % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                              borderRadius: '4px',
                              boxShadow: '0 0 8px var(--accent-primary)',
                              transition: 'width 0.5s ease-out',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {toolUsage.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No tool executions logged yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Logs Table */}
            <div
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Cpu size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent RAG Execution Log</h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 8px', fontWeight: 500 }}>TIME</th>
                      <th style={{ padding: '12px 8px', fontWeight: 500 }}>QUERY & RESPONSE</th>
                      <th style={{ padding: '12px 8px', fontWeight: 500, width: '100px' }}>LATENCY</th>
                      <th style={{ padding: '12px 8px', fontWeight: 500, width: '100px' }}>TOKENS</th>
                      <th style={{ padding: '12px 8px', fontWeight: 500, width: '90px' }}>COST</th>
                      <th style={{ padding: '12px 8px', fontWeight: 500 }}>TOOLS CALLED</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                    {data.recentLogs.map((log) => {
                      const dateObj = new Date(log.created_at);
                      const timeStr = isNaN(dateObj.getTime()) ? 'Recent' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      
                      return (
                        <tr
                          key={log.id}
                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                          className="hover:bg-white/5"
                        >
                          {/* Time */}
                          <td style={{ padding: '14px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', verticalAlign: 'top' }}>
                            {timeStr}
                          </td>
                          {/* Query & Response */}
                          <td style={{ padding: '14px 8px', verticalAlign: 'top', maxWidth: '400px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                              Q: "{log.user_query}"
                            </div>
                            <div style={{
                              color: 'var(--text-secondary)',
                              fontSize: '12px',
                              lineHeight: '1.4',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: expandedLogId === log.id ? 'block' : '-webkit-box',
                              WebkitLineClamp: expandedLogId === log.id ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              whiteSpace: expandedLogId === log.id ? 'pre-wrap' : 'normal'
                            }}>
                              {log.final_response}
                            </div>
                          </td>
                          {/* Latency */}
                          <td style={{ padding: '14px 8px', fontFamily: 'var(--font-mono)', verticalAlign: 'top', color: log.latency_ms > 1500 ? '#EF4444' : 'var(--text-primary)' }}>
                            {log.latency_ms} ms
                          </td>
                          {/* Tokens */}
                          <td style={{ padding: '14px 8px', fontFamily: 'var(--font-mono)', verticalAlign: 'top', color: 'var(--text-secondary)' }}>
                            {log.tokens_used}
                          </td>
                          {/* Cost */}
                          <td style={{ padding: '14px 8px', fontFamily: 'var(--font-mono)', verticalAlign: 'top', color: 'var(--accent-green)' }}>
                            ${log.cost_usd.toFixed(5)}
                          </td>
                          {/* Tools */}
                          <td style={{ padding: '14px 8px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {log.tools_called.map((t) => (
                                <span
                                  key={t}
                                  style={{
                                    fontSize: '9px',
                                    fontFamily: 'var(--font-mono)',
                                    padding: '2px 6px',
                                    background: 'rgba(0, 243, 255, 0.08)',
                                    border: '1px solid rgba(0, 243, 255, 0.25)',
                                    borderRadius: '6px',
                                    color: 'var(--accent-secondary)',
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                              {log.tools_called.length === 0 && (
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>None</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {data.recentLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          No database request log entries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryDashboard;
