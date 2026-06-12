import React from 'react';
import { Mail, MapPin, Linkedin, Github, Download, Terminal, Award } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  toggleTelemetryMode: () => void;
  isTelemetryMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  scrollToSection,
  toggleTelemetryMode,
  isTelemetryMode
}) => {
  const socialLinks = [
    { icon: Mail, url: 'mailto:pavankumarkunukuntla@gmail.com', label: 'pavankumarkunukuntla@gmail.com' },
    { icon: MapPin, url: '#', label: 'Basar, Telangana, India', isText: true },
    { icon: Linkedin, url: 'https://linkedin.com/in/agent-engineer', label: 'LinkedIn' },
    { icon: Github, url: 'https://github.com/agent-engineer', label: 'GitHub' },
  ];

  const cvSections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <aside className="w-full xl:w-[320px] xl:fixed xl:top-0 xl:left-0 xl:bottom-0 bg-slate-900/90 xl:border-r border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-30 select-none">
      
      <div className="space-y-6">
        {/* Profile Avatar with Neural Pulse Ring */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-950 p-1 border border-slate-850">
            {/* Animated Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-cyan/45 animate-ping opacity-25"></div>
            <div className="absolute -inset-1 rounded-full border border-cyan/35 animate-pulse-slow"></div>
            
            {/* Profile Image with Cyberpunk Hover Effects */}
            <div className="w-full h-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative group">
              <img 
                src="/pavan.jpg" 
                alt="Pavan Kumar Kunukuntla" 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                onError={(e) => {
                  // Fallback
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="35" r="8" fill="%2300F5FF"/><circle cx="30" cy="65" r="6" fill="%2300B5CC"/><circle cx="70" cy="65" r="6" fill="%2300B5CC"/><line x1="50" y1="35" x2="30" y2="65" stroke="%2300F5FF" stroke-width="2" stroke-dasharray="3 3"/><line x1="50" y1="35" x2="70" y2="65" stroke="%2300F5FF" stroke-width="2" stroke-dasharray="3 3"/><line x1="30" y1="65" x2="70" y2="65" stroke="%2300F5FF" stroke-width="1"/></svg>';
                }}
              />
              {/* Overlay scanline effects on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              {/* Micro badge shown on hover */}
              <div className="absolute bottom-2 bg-slate-950/80 border border-cyan/30 text-cyan text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none uppercase tracking-wider">
                P.K.K
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-white tracking-wide">
              Pavan Kumar
            </h2>
            <p className="text-xs font-mono text-cyan uppercase tracking-widest mt-1">
              Agentic AI Engineer
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">RGUKT Basar CSE '27</p>
          </div>
        </div>

        {/* Section Navigation Link Panel (Only in CV/Portfolio Mode) */}
        {!isTelemetryMode && (
          <nav className="hidden xl:flex flex-col gap-1 border-t border-b border-slate-800/60 py-4 font-display">
            {cvSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left px-3.5 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                    isActive
                      ? 'bg-cyan/10 text-cyan border-cyan/25 shadow-cyan-glow'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/40'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Info Credentials Stack */}
        <div className="space-y-3 font-mono text-[11px] text-slate-400 border-t xl:border-none border-slate-800/60 pt-4 xl:pt-0">
          {socialLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-3 hover:text-white transition-colors py-1 ${
                  link.isText ? 'cursor-default pointer-events-none' : ''
                }`}
              >
                <Icon size={14} className="text-cyan shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Action Trigger Buttons Footer */}
      <div className="flex flex-col gap-2.5 mt-6 border-t border-slate-800/60 pt-4">
        {/* Toggle Telemetry Dashboard */}
        <button
          onClick={toggleTelemetryMode}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
            isTelemetryMode
              ? 'bg-cyan/15 text-cyan border-cyan/35 shadow-cyan-glow'
              : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal size={13} />
          <span>{isTelemetryMode ? 'View Portfolio' : 'Telemetry OS'}</span>
        </button>

        {/* Download CV Action */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("Downloading Pavan Kumar Kunukuntla's CV...");
          }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-cyan hover:bg-cyan-dark text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-cyan-glow"
        >
          <Download size={13} />
          <span>Download CV</span>
        </a>
      </div>
    </aside>
  );
};
