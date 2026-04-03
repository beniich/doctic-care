// ============================================================
// Doctic Care — src/pages/AIAssistant.tsx
// Interface chat IA SSE — Style unifié Doctic Dark Theme
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, AlertCircle, Loader2, Activity, StopCircle, Trash2, Sparkles, Zap, Shield } from 'lucide-react';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
}

interface AIStatus {
  available: boolean;
  models: { name: string; size: number }[];
  missingModels: string[];
  status: 'ready' | 'incomplete' | 'offline';
}

// ─── Hook SSE Chat ───────────────────────────────────────────
function useSSEChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (userContent: string, model = 'mistral:7b') => {
    if (isStreaming) return;
    setError(null);

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: userContent, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), model, isStreaming: true }]);
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })), model }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]' || data.startsWith(':')) continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'token' && parsed.content) {
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + parsed.content } : m));
            }
          } catch { /* partial JSON */ }
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      if (e.name !== 'AbortError') setError(e.message || 'Erreur de communication IA');
    } finally {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isStreaming: false } : m));
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming: () => abortControllerRef.current?.abort(),
    clearMessages: () => { setMessages([]); setError(null); },
  };
}

// ─── Bulle de message ────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === 'assistant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${isAssistant ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-accent/20 border-accent/30 text-accent'}`}>
        {isAssistant ? <Bot size={15} /> : <User size={15} />}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${isAssistant ? 'glass-card rounded-tl-none text-foreground' : 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-none'}`}>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content || (message.isStreaming ? '' : <span className="text-muted-foreground italic">Réflexion...</span>)}
          {message.isStreaming && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}
        </div>
        <div className={`flex items-center gap-2 mt-1.5 text-xs ${isAssistant ? 'text-muted-foreground' : 'text-primary/60'}`}>
          <span>{message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          {message.model && <span className="font-mono-tech">· {message.model}</span>}
          {message.isStreaming && <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> génération...</span>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Badge statut IA ─────────────────────────────────────────
function AIStatusBadge({ status }: { status: AIStatus | null }) {
  if (!status) return null;
  const cfg = {
    ready: { cls: 'text-success bg-success/10 border-success/30', label: 'IA Opérationnelle' },
    incomplete: { cls: 'text-warning bg-warning/10 border-warning/30', label: 'Modèles manquants' },
    offline: { cls: 'text-destructive bg-destructive/10 border-destructive/30', label: 'IA Hors ligne' },
  }[status.status];
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <Activity size={11} className="animate-pulse" />
      {cfg.label}
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────
export default function AIAssistant() {
  const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } = useSSEChat();
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('mistral:7b');
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = [
    { icon: '🫀', label: 'Urgence cardiaque', prompt: "Patient avec douleur thoracique irradiant dans le bras gauche, dyspnée et sueurs. Conduite à tenir ?" },
    { icon: '💊', label: 'Interaction méd.', prompt: "Quelles sont les interactions à surveiller entre warfarine et aspirine ?" },
    { icon: '🔬', label: 'Bilan sanguin', prompt: "Aide-moi à interpréter ce bilan avec une CRP élevée et leucocytose." },
    { icon: '📋', label: 'Protocole HAS', prompt: "Rappelle-moi le protocole HAS pour la prise en charge de l'HTA de l'adulte." },
  ];

  useEffect(() => {
    fetch('/api/ai/status', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setAIStatus(data); if (data.models.length > 0) setSelectedModel(data.models[0].name); }
        else setAIStatus({ available: false, models: [], missingModels: [], status: 'offline' });
      })
      .catch(() => setAIStatus({ available: false, models: [], missingModels: [], status: 'offline' }));
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || isStreaming) return;
    setInput('');
    sendMessage(t, selectedModel);
  };

  return (
    <OutlookLayout
      singlePane={
        <div className="flex flex-col h-full">
          {/* ── Header ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,200,255,0.2)]">
                <Sparkles className="text-primary" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-foreground">DoctIA — Assistant Médical</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield size={10} className="text-success" /> Données 100% locales · HIPAA compliant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                title="Sélection du modèle IA"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={isStreaming}
                className="text-xs border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:border-primary outline-none"
              >
                {aiStatus?.models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                {(!aiStatus || aiStatus.models.length === 0) && <option value="mistral:7b">mistral:7b</option>}
              </select>
              <AIStatusBadge status={aiStatus} />
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  disabled={isStreaming}
                  title="Effacer la conversation"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {/* Welcome state */}
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,200,255,0.15)]">
                    <Bot className="text-primary" size={36} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Bonjour, Docteur</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    Je suis <span className="text-primary font-medium">DoctIA</span>, votre assistant médical IA. Diagnostic différentiel, interprétation de bilans, rédaction de comptes rendus — je suis là.
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {quickPrompts.map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(qp.prompt, selectedModel)}
                        className="group text-left p-4 glass-card rounded-xl hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,200,255,0.1)] transition-all duration-200"
                      >
                        <span className="text-2xl">{qp.icon}</span>
                        <p className="text-sm font-medium text-foreground mt-2 group-hover:text-primary transition-colors">{qp.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map(message => <MessageBubble key={message.id} message={message} />)}
              </AnimatePresence>

              {/* Offline warning */}
              {aiStatus?.status === 'offline' && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-4">
                  <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">L'agent IA est hors ligne. Lancez <code className="bg-destructive/20 px-1 rounded text-xs">docker compose up ollama</code></p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-4">
                  <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Input Zone ── */}
          <div className="flex-shrink-0 border-t border-border bg-card/50 backdrop-blur-sm px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 glass-card rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.1)] transition-all duration-200">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Décrivez la situation clinique... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground max-h-44"
                  rows={1}
                />
                {isStreaming ? (
                  <button
                    onClick={stopStreaming}
                    title="Arrêter la génération"
                    className="flex-shrink-0 w-9 h-9 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <StopCircle size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || aiStatus?.status === 'offline'}
                    title="Envoyer (Entrée)"
                    className="flex-shrink-0 w-9 h-9 bg-primary/20 hover:bg-primary/30 disabled:opacity-30 text-primary border border-primary/30 rounded-xl flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(0,200,255,0.2)]"
                  >
                    {isStreaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                )}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <Zap size={10} className="text-warning" />
                DoctIA est un outil d'aide à la décision. Les réponses ne remplacent pas le jugement clinique.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}
