import React from 'react';
import { AgentChat } from '../components/AgentChat';
import { Network, Database, Brain, ArrowRight, Activity } from 'lucide-react';

export const Playground: React.FC = () => {
  const steps = [
    {
      title: 'Query Embedding',
      desc: 'Voyage AI encodes message into a dense 1024-dimension vector.',
      icon: Network,
      color: 'border-purple-500/20 text-purple-400',
    },
    {
      title: 'Vector Search',
      desc: 'Supabase pgvector queries dot-products to fetch profile context.',
      icon: Database,
      color: 'border-emerald-500/20 text-emerald-400',
    },
    {
      title: 'Claude Synthesis',
      desc: 'Claude-3.5-Sonnet formats retrieved data into answers.',
      icon: Brain,
      color: 'border-amber-500/20 text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
      {/* RAG Chat playground */}
      <div className="xl:col-span-2 space-y-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Agent Playground</h1>
          <p className="text-slate-400 max-w-xl text-sm">
            Ask the autonomous RAG guide details about the engineer's stack, jobs, projects, and educational qualifications.
          </p>
        </section>

        <AgentChat />
      </div>

      {/* RAG pipeline explanation panel */}
      <div className="space-y-6">
        <section className="glass-panel p-6 rounded-lg border border-slate-800/80 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Activity size={18} className="text-cyan animate-pulse-slow" />
            <h2 className="font-display font-semibold text-white">RAG pipeline workflow</h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The playground connects directly to an Express backend which coordinates embeddings, pgvector queries, and Anthropic's reasoning model.
          </p>

          <div className="relative space-y-6 pl-2">
            {/* Connecting Vertical line */}
            <div className="absolute left-6 top-4 bottom-4 w-[1px] bg-slate-800"></div>

            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex gap-4 items-start group">
                  <div className={`w-8 h-8 rounded-full bg-slate-950 border flex items-center justify-center shrink-0 z-10 ${step.color}`}>
                    <Icon size={14} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-xs text-white group-hover:text-cyan transition-colors">
                      {idx + 1}. {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-900 flex flex-col gap-2.5 font-mono text-[10px] text-slate-500">
            <div className="flex justify-between">
              <span>Embedding Dimension:</span>
              <span className="text-slate-400">1024 (Voyage-3)</span>
            </div>
            <div className="flex justify-between">
              <span>Retrieval Metric:</span>
              <span className="text-slate-400">Cosine Distance (&lt;=&gt;)</span>
            </div>
            <div className="flex justify-between">
              <span>LLM Engine:</span>
              <span className="text-slate-400">Claude-3.5-Sonnet</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
