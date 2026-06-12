import React, { useEffect, useRef } from 'react';
import { User, Cpu, Briefcase, GraduationCap, Phone, Award, ExternalLink, Github, Linkedin, Send } from 'lucide-react';
import { knowledgeBase } from '../data/knowledgeBase';

interface PortfolioProps {
  setActiveSection: (sectionId: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ setActiveSection }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer to detect scroll section and activate sidebar highlight
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' }
    );

    const sections = document.querySelectorAll('section[data-section]');
    sections.forEach((sec) => observerRef.current?.observe(sec));

    return () => observerRef.current?.disconnect();
  }, [setActiveSection]);

  // Section data extractions
  const aboutChunks = knowledgeBase.filter(c => c.section === 'about');
  const skillsChunks = knowledgeBase.filter(c => c.section === 'skills');
  const projectsChunks = knowledgeBase.filter(c => c.section === 'projects');
  const expChunks = knowledgeBase.filter(c => c.section === 'experience');
  const eduChunks = knowledgeBase.filter(c => c.section === 'education');
  const contactChunk = knowledgeBase.find(c => c.section === 'contact');

  return (
    <div className="space-y-20 pb-20 scroll-smooth">
      
      {/* ABOUT SECTION */}
      <section
        id="about"
        data-section="about"
        className="scroll-mt-24 space-y-6 animate-fade-in"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <User className="text-cyan" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">About Me</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 text-slate-350 text-sm leading-relaxed">
            {aboutChunks.map((chunk, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{chunk.content}</p>
            ))}
          </div>
          <div className="glass-panel p-5 rounded-lg border border-slate-800 space-y-4 flex flex-col justify-center">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Highlights</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Internships:</span>
                <span className="text-white font-bold">Microsoft & Infosys</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hackathons won:</span>
                <span className="text-cyan font-bold">CineAI & SIH Internal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agent Frameworks:</span>
                <span className="text-white font-bold">LangGraph, CrewAI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current CGPA:</span>
                <span className="text-emerald-400 font-bold">8.93 / 10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section
        id="skills"
        data-section="skills"
        className="scroll-mt-24 space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <Cpu className="text-cyan" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsChunks.map((chunk, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-lg border border-slate-800/80 space-y-3">
              <h3 className="font-display font-semibold text-sm text-cyan">{chunk.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{chunk.content}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {chunk.metadata.tags.filter(t => t !== 'skills').map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-500 font-mono uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section
        id="projects"
        data-section="projects"
        className="scroll-mt-24 space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <Cpu className="text-cyan animate-pulse" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">Autonomous Work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsChunks.map((project, idx) => (
            <div
              key={idx}
              className="glass-card flex flex-col justify-between h-[360px] rounded-lg p-5 border border-slate-800/80 hover:border-cyan/30 transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-cyan/10 border border-cyan/25 text-[9px] text-cyan font-mono tracking-widest uppercase">
                    Agent System
                  </span>
                  <div className="flex gap-2">
                    {project.metadata.tags.includes('hackathon') && (
                      <span className="text-[9px] text-amber-500 font-mono font-semibold flex items-center gap-1">
                        <Award size={10} /> Hackathon
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-base text-white group-hover:text-cyan transition-colors line-clamp-1">
                    {project.title.replace('Project 1: ', '').replace('Project 2: ', '').replace('Project 3: ', '').replace('Project 4: ', '').replace('Project 5: ', '')}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-5">
                    {project.content}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.metadata.tags.slice(1, 4).map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-500 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section
        id="experience"
        data-section="experience"
        className="scroll-mt-24 space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <Briefcase className="text-cyan" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">Experience</h2>
        </div>
        <div className="relative pl-6 border-l border-slate-800 space-y-8">
          {expChunks.map((exp, idx) => (
            <div key={idx} className="relative space-y-2 group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-cyan/45 group-hover:border-cyan group-hover:bg-cyan transition-colors shadow-cyan-glow"></div>
              
              <div>
                <h3 className="font-display font-semibold text-sm text-white group-hover:text-cyan transition-colors">{exp.title}</h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {exp.title.includes('Microsoft') ? 'Dec 2025 - Jan 2026' : 'Nov 2025 - Jan 2026'}
                </span>
              </div>
              <p className="text-slate-450 text-xs leading-relaxed max-w-2xl">{exp.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section
        id="education"
        data-section="education"
        className="scroll-mt-24 space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <GraduationCap className="text-cyan" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">Education</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eduChunks.map((edu, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-lg border border-slate-800/80 space-y-3">
              <h3 className="font-display font-semibold text-sm text-white">{edu.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{edu.content}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {edu.metadata.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-500 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        data-section="contact"
        className="scroll-mt-24 space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
          <Phone className="text-cyan" size={20} />
          <h2 className="text-xl font-display font-semibold text-white uppercase tracking-wider">Connect</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {contactChunk?.content}
            </p>
            
            <div className="flex gap-4 items-center">
              <a
                href="https://linkedin.com/in/agent-engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-950 border border-slate-800 hover:border-cyan/35 text-slate-400 hover:text-cyan transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/agent-engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-950 border border-slate-800 hover:border-cyan/35 text-slate-400 hover:text-cyan transition-all duration-300"
              >
                <Github size={18} />
              </a>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                AVAILABLE FOR HIRE
              </span>
            </div>
          </div>

          {/* Message form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message successfully routed to Pavan Kumar!');
            }}
            className="space-y-3.5"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Name"
                className="bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan transition-colors"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Message..."
              className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan transition-colors resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-cyan hover:bg-cyan-dark text-slate-950 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-cyan-glow"
            >
              <Send size={12} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
