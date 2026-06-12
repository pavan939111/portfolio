import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { portfolioItems } from '../data/portfolioData';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'thought' | 'speak';
}

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'AGENT.OS Console initialized.', type: 'success' },
    { text: 'Type "help" to list available commands.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (!command) return;

      setCommandHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);
      setInput('');
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      if (historyIndex === -1) return;
      if (historyIndex === commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  };

  const executeCommand = async (commandLine: string) => {
    const lines: TerminalLine[] = [{ text: `guest@agent.os:~$ ${commandLine}`, type: 'input' }];
    setHistory((prev) => [...prev, ...lines]);

    const parts = commandLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: 'Available commands:', type: 'success' },
          { text: '  about               - Summary of the Agentic AI Engineer', type: 'output' },
          { text: '  skills              - Interactive layout of technical skills', type: 'output' },
          { text: '  projects            - Explore developed autonomous solutions', type: 'output' },
          { text: '  agent run <task>    - Trigger LLM Agent loop to answer a question semantically', type: 'output' },
          { text: '  clear               - Clear console history', type: 'output' },
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'about':
        const aboutItem = portfolioItems.find((i) => i.id === 'about-1');
        setHistory((prev) => [
          ...prev,
          { text: aboutItem?.title || 'About', type: 'success' },
          { text: aboutItem?.description || '', type: 'output' },
          { text: `Focus: ${aboutItem?.metadata.tags?.join(', ') || ''}`, type: 'output' },
        ]);
        break;

      case 'skills':
        const skills = portfolioItems.filter((i) => i.category === 'skill');
        setHistory((prev) => [
          ...prev,
          { text: 'TECHNICAL SKILL MATRIX:', type: 'success' },
          ...skills.flatMap((s) => [
            { text: `▶ ${s.title}: ${s.description}`, type: 'output' as const },
            { text: `  Tags: ${s.metadata.tags?.join(' | ') || ''}`, type: 'thought' as const },
          ]),
        ]);
        break;

      case 'projects':
        const projects = portfolioItems.filter((i) => i.category === 'project');
        setHistory((prev) => [
          ...prev,
          { text: 'DEVELOPED AI SYSTEMS:', type: 'success' },
          ...projects.flatMap((p) => [
            { text: `★ ${p.title} -> ${p.description}`, type: 'output' as const },
            { text: `  Stack: ${p.metadata.tools?.join(', ')}`, type: 'thought' as const },
            { text: `  Metric: ${p.metadata.metrics}`, type: 'success' as const },
          ]),
        ]);
        break;

      case 'agent':
        if (parts[1]?.toLowerCase() === 'run') {
          const task = parts.slice(2).join(' ');
          if (!task) {
            setHistory((prev) => [
              ...prev,
              { text: 'Error: Please specify a task. Example: agent run Summarize the finance swarm project.', type: 'error' },
            ]);
            break;
          }

          setIsProcessing(true);
          setHistory((prev) => [...prev, { text: `Spawning agent thread context...`, type: 'thought' }]);

          try {
            const result = await api.askAgent(task, 'terminal-session-' + Date.now(), []);
            
            // Add reasoning logs to console
            const thoughtsLines: TerminalLine[] = result.thoughts.map((t) => ({
              text: `[THOUGHT] [${t.step}] - ${t.message}`,
              type: 'thought',
            }));

            setHistory((prev) => [
              ...prev,
              ...thoughtsLines,
              { text: `[AGENT SYNTHESIS] Cost: $${result.costUsd.toFixed(5)} | Latency: ${result.latencyMs}ms`, type: 'success' },
              { text: result.response, type: 'speak' },
            ]);
          } catch (err) {
            setHistory((prev) => [
              ...prev,
              { text: `Agent run encountered error: ${(err as Error).message}`, type: 'error' },
            ]);
          } finally {
            setIsProcessing(false);
          }
        } else {
          setHistory((prev) => [
            ...prev,
            { text: 'Error: Invalid agent syntax. Use "agent run <task>".', type: 'error' },
          ]);
        }
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { text: `Command not found: "${cmd}". Type "help" for a list of commands.`, type: 'error' },
        ]);
        break;
    }
  };

  return (
    <div
      onClick={focusInput}
      className="terminal-scanlines w-full h-[450px] bg-slate-950 border border-slate-800 rounded-lg p-5 font-mono text-sm overflow-hidden flex flex-col cursor-text shadow-2xl relative"
    >
      {/* Terminal Title Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-semibold">
          AI-CORE://guest@agent.os
        </span>
        <div className="w-10"></div>
      </div>

      {/* Terminal Content Screen */}
      <div ref={containerRef} className="flex-1 overflow-y-auto mt-6 pr-2 space-y-2.5 scrollbar-thin">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'input'
                ? 'text-slate-100 font-semibold'
                : line.type === 'error'
                ? 'text-red-400'
                : line.type === 'success'
                ? 'text-cyan font-bold'
                : line.type === 'thought'
                ? 'text-slate-500 italic'
                : line.type === 'speak'
                ? 'text-slate-200 pl-4 border-l-2 border-cyan/45 bg-cyan/5 py-1.5 pr-2 rounded-r-md'
                : 'text-slate-300'
            }`}
          >
            {line.text}
          </div>
        ))}

        {isProcessing && (
          <div className="text-slate-500 italic animate-pulse flex items-center gap-1">
            <span>▋</span> Computing agent reasoning state...
          </div>
        )}
      </div>

      {/* Command prompt input */}
      <div className="flex items-center gap-2 border-t border-slate-900/60 pt-2.5 mt-2 z-10 bg-slate-950">
        <span className="text-cyan font-semibold shrink-0">guest@agent.os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-mono placeholder-slate-700 caret-cyan"
          placeholder={isProcessing ? 'Agent is thinking...' : 'type help...'}
          autoComplete="off"
          autoFocus
        />
      </div>
    </div>
  );
};
