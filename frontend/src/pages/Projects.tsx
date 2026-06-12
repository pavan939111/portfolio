import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { PortfolioItem } from '../types';
import { Cpu, ExternalLink, Code2, Layers, Award } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'agent' | 'rag'>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data.projects);
      } catch (err) {
        console.error('Failed to fetch projects, using static fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    const tags = project.metadata.tags?.map((t) => t.toLowerCase()) || [];
    if (filter === 'agent') return tags.includes('agent') || tags.includes('multi-agent');
    if (filter === 'rag') return tags.includes('rag') || tags.includes('memory') || tags.includes('vector search');
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <section className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Autonomous Architectures</h1>
        <p className="text-slate-400 max-w-xl text-sm">
          A showcase of custom agent loops, vector retrieval chains, and evaluation scripts designed for real-world deployments.
        </p>
      </section>

      {/* Filter Widgets */}
      <div className="flex gap-2.5 border-b border-slate-900 pb-4">
        {(['all', 'agent', 'rag'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
              filter === cat
                ? 'bg-cyan/10 text-cyan border-cyan/35 shadow-cyan-glow'
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900'
            }`}
          >
            {cat === 'all' ? 'All Systems' : cat === 'agent' ? 'Autonomous Agents' : 'Memory / RAG'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel h-80 rounded-lg p-5 space-y-4 animate-pulse">
              <div className="h-6 w-1/2 bg-slate-800 rounded"></div>
              <div className="h-20 bg-slate-800 rounded"></div>
              <div className="h-6 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card flex flex-col justify-between h-[340px] rounded-lg p-5 relative overflow-hidden group border border-slate-800/80 hover:border-cyan/30"
            >
              {/* Corner Glow Effect */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-cyan/5 blur-xl group-hover:bg-cyan/15 transition-all duration-500"></div>

              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded bg-slate-900 text-slate-400 group-hover:text-cyan border border-slate-800 group-hover:border-cyan/25 transition-all duration-300">
                    <Cpu size={16} />
                  </div>
                  {project.metadata.link && (
                    <a
                      href={project.metadata.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-cyan transition-colors"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                {/* Text Context */}
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-lg text-white group-hover:text-cyan transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Specs block */}
              <div className="space-y-3 mt-4">
                {/* Tools/Stack tags */}
                {project.metadata.tools && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.metadata.tools.slice(0, 3).map((tool, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.metadata.tools.length > 3 && (
                      <span className="text-[10px] text-slate-600 font-mono pt-0.5">
                        +{project.metadata.tools.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Metric footer */}
                {project.metadata.metrics && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan/5 border border-cyan/15 text-[10px] text-cyan font-mono">
                    <Award size={12} className="shrink-0" />
                    <span className="truncate">{project.metadata.metrics}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
