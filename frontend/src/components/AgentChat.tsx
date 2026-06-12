import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { AgentResult, ThoughtStep } from '../types';
import { Send, Bot, User, Brain, Terminal, Database, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughts?: ThoughtStep[];
  meta?: {
    latencyMs: number;
    costUsd: number;
    toolsCalled: string[];
  };
}

export const AgentChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello, I am the developer's Agent Guide. I can access their semantic repository of skills, projects, and careers. Ask me anything, like:\n• 'What LLM frameworks did they use in AutoDoc?'\n• 'Does this developer know Tailwind?'\n• 'Summarize their career history.'",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);
  const sessionIdRef = useRef<string>('chat-session-' + Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    setInput('');
    const userMsgId = 'msg-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // Map message history to format expected by backend
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await api.askAgent(query, sessionIdRef.current, history);
      
      const assistantMsgId = 'msg-' + (Date.now() + 1);
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: response.response,
        thoughts: response.thoughts,
        meta: {
          latencyMs: response.latencyMs,
          costUsd: response.costUsd,
          toolsCalled: response.toolsCalled,
        },
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setExpandedThoughtId(assistantMsgId); // Auto-expand thoughts for the latest response
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: `Sorry, I failed to reach my AI cores: ${(err as Error).message}. Check if your backend is running.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const getThoughtIcon = (stepName: string) => {
    const name = stepName.toLowerCase();
    if (name.includes('input') || name.includes('analy')) return <Terminal size={14} className="text-cyan" />;
    if (name.includes('embedding') || name.includes('vector')) return <Brain size={14} className="text-purple-400" />;
    if (name.includes('db') || name.includes('database') || name.includes('retriev')) return <Database size={14} className="text-emerald-400" />;
    if (name.includes('llm') || name.includes('response') || name.includes('synthe')) return <Sparkles size={14} className="text-amber-400" />;
    return <Bot size={14} className="text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel-cyan rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
      {/* Header bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan/15 text-cyan">
            <Bot size={18} className="neon-text-glow" />
          </div>
          <div>
            <span className="font-display font-semibold text-sm text-white">Agentic Portfolio Guide</span>
            <p className="text-[10px] text-slate-500 font-mono">MODEL: Claude-3.5-Sonnet + Voyage-3 RAG</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
            RAG ACTIVE
          </div>
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-950/20 scrollbar-thin">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          const hasThoughts = message.thoughts && message.thoughts.length > 0;
          const isExpanded = expandedThoughtId === message.id;

          return (
            <div key={message.id} className={`flex gap-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
              
              {/* Avatar Icon */}
              {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/25 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-cyan" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`max-w-[80%] flex flex-col gap-2`}>
                <div
                  className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-cyan/10 border border-cyan/35 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {/* Telemetry metadata stats */}
                  {isAssistant && message.meta && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono">
                      <span>Latency: <strong className="text-slate-400">{message.meta.latencyMs}ms</strong></span>
                      <span>Cost: <strong className="text-emerald-500">${message.meta.costUsd.toFixed(5)}</strong></span>
                      <span>Tools: <strong className="text-slate-400">{message.meta.toolsCalled.join(', ') || 'None'}</strong></span>
                    </div>
                  )}
                </div>

                {/* Collapsible Thoughts Accordion */}
                {isAssistant && hasThoughts && (
                  <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                    <button
                      onClick={() => setExpandedThoughtId(isExpanded ? null : message.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-500 font-mono hover:bg-slate-900 hover:text-slate-300 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Brain size={12} className="text-cyan animate-pulse" />
                        View Agent Thought Process ({message.thoughts!.length} steps)
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-slate-800/80 px-3 py-2.5 space-y-2.5 text-xs font-mono bg-slate-950/40 select-none">
                        {message.thoughts!.map((thought, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start pl-1 border-l border-slate-800/80 hover:border-cyan/30 transition-colors py-0.5">
                            <span className="shrink-0 mt-0.5">{getThoughtIcon(thought.step)}</span>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-400">{thought.step}</span>
                              <p className="text-slate-500 mt-0.5">{thought.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/45 flex items-center justify-center shrink-0">
                  <User size={15} className="text-cyan" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/25 flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={15} className="text-cyan" />
            </div>
            <div className="flex flex-col gap-2 w-[70%]">
              <div className="rounded-lg px-4 py-3 bg-slate-900 border border-slate-800 text-slate-500 text-sm italic animate-pulse-slow">
                ▋ Agent is compiling vector searches and synthesizing memory...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form footer */}
      <form onSubmit={handleSubmit} className="border-t border-slate-850 p-4 bg-slate-900/90 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
          placeholder="Ask me about skills, projects, tools, or experience..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan/60 transition-colors disabled:opacity-55"
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          className="px-4 rounded-md bg-cyan hover:bg-cyan-dark text-slate-950 font-semibold flex items-center justify-center transition-all duration-300 disabled:opacity-35 shadow-cyan-glow"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
