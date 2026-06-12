import React, { useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Cpu, LineChart, MessageSquare, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const [systemMode, setSystemMode] = useState<'live' | 'mock' | 'checking'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setSystemMode(data.mode === 'live-api' ? 'live' : 'mock');
        } else {
          setSystemMode('mock');
        }
      } catch (err) {
        setSystemMode('mock');
      }
    };
    checkHealth();
  }, []);

  const navItems = [
    { id: 'home', label: 'Core', icon: TerminalIcon },
    { id: 'projects', label: 'Projects', icon: Cpu },
    { id: 'playground', label: 'Playground', icon: MessageSquare },
    { id: 'dashboard', label: 'Telemetry', icon: LineChart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/35 text-cyan animate-pulse-slow">
          <Cpu size={20} className="neon-text-glow" />
        </div>
        <div>
          <span className="font-display font-bold text-lg tracking-wider text-white">
            AGENT<span className="text-cyan">.OS</span>
          </span>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">v1.2.0-core</p>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-display font-medium text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-cyan/15 text-cyan border border-cyan/35 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {systemMode === 'live' ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
            </>
          ) : systemMode === 'mock' ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500 animate-pulse"></span>
          )}
        </span>
        <span className="font-mono text-xs text-slate-400">
          {systemMode === 'live' ? (
            <span className="text-cyan font-semibold">SYS.STATUS: LIVE</span>
          ) : systemMode === 'mock' ? (
            <span className="text-amber-500 font-semibold flex items-center gap-1">
              SYS.STATUS: MOCK
            </span>
          ) : (
            'SYS.STATUS: INITIALIZING'
          )}
        </span>
      </div>
    </header>
  );
};
