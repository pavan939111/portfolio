import React from 'react';
import { Terminal } from '../components/Terminal';
import { ShieldCheck, Cpu, Code2, Server, ArrowRight } from 'lucide-react';

interface HomeProps {
  setActivePage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActivePage }) => {
  const systemMetrics = [
    { label: 'Agent Runs Today', value: '412', icon: Cpu },
    { label: 'Avg Inference Latency', value: '198ms', icon: Server },
    { label: 'Embedding Vector Nodes', value: '1,024', icon: Code2 },
    { label: 'Evaluation Success Rate', value: '99.4%', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative py-12 flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/25 text-cyan text-xs font-mono select-none animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan"></span>
          AGENTIC AI PORTFOLIO WEB-OS
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold leading-none tracking-tight">
          Engineering Autonomous <br />
          <span className="bg-gradient-to-r from-cyan to-cyan-dark bg-clip-text text-transparent neon-text-glow">
            Agentic Systems
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed">
          Developing cognitive frameworks, multi-agent orchestrations, and vector memory loops that empower models to reason, plan, and execute.
        </p>

        <div className="flex gap-4 pt-2">
          <button
            onClick={() => setActivePage('playground')}
            className="group flex items-center gap-2 px-6 py-3 rounded bg-cyan hover:bg-cyan-dark text-slate-950 font-display font-semibold transition-all duration-300 shadow-cyan-glow"
          >
            <span>Query the Agent Guide</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setActivePage('projects')}
            className="px-6 py-3 rounded border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all duration-300"
          >
            Explore Projects
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-lg flex flex-col justify-between h-32 relative group hover:border-cyan/20 transition-all duration-300">
              <div className="absolute top-4 right-4 text-slate-700 group-hover:text-cyan/25 transition-colors">
                <Icon size={20} />
              </div>
              <span className="text-xs text-slate-500 font-mono tracking-wider">{metric.label}</span>
              <span className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">{metric.value}</span>
            </div>
          );
        })}
      </section>

      {/* Embedded Terminal Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan"></span>
            <h2 className="text-lg font-display font-semibold text-white">Interactive Developer Console</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">guest@agent.os</span>
        </div>
        
        <Terminal />

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-1">
          <span>Quick Commands:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">help</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">skills</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">projects</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">agent run &lt;prompt&gt;</span>
        </div>
      </section>
    </div>
  );
};
