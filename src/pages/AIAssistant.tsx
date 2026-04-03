// ============================================================
// Doctic Care — src/pages/AIAssistant.tsx
// Interface chat IA avec streaming SSE temps réel
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, AlertCircle, Loader2, Mic, Image, FileText, Activity } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────
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

// ─── Hook : useSSEChat ──────────────────────────────────────
function useSSEChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    userContent: string,
    model: string = 'mistral:7b'
  ) => {
    if (isStreaming) return;

    setError(null);

    // Ajoute le message utilisateur
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Prépare le message assistant (streaming)
    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      model,
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsStreaming(true);

    // Annulation possible
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Lecture du stream SSE
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
          if (data === '[DONE]') continue;
          if (data.startsWith(':')) continue; // heartbeat

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              setError(parsed.error);
              break;
            }

            if (parsed.type === 'token' && parsed.content) {
              // Accumule les tokens en temps réel
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + parsed.content }
                  : m
              ));
            }
          } catch {
            // JSON partiel — ignoré
          }
        }
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[AI] Stream annulé par l\'utilisateur');
      } else {
        setError(err.message || 'Erreur lors de la communication avec l\'IA');
        console.error('[AI Chat] Error:', err);
      }
    } finally {
      // Marque le message comme terminé
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, isStreaming: false }
          : m
      ));
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages };
}

// ─── Composant Message ──────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3 ${isAssistant ? 'flex-row' : 'flex-row-reverse'} mb-4`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isAssistant ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Bulle */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 
        ${isAssistant
          ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
          : 'bg-blue-600 text-white rounded-tr-none'
        }`}>
        {/* Contenu */}
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content || (message.isStreaming ? '' : '...')}
          {/* Curseur clignotant pendant le streaming */}
          {message.isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 animate-pulse" />
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center gap-2 mt-1 text-xs
          ${isAssistant ? 'text-gray-400' : 'text-blue-200'}`}>
          <span>{message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          {message.model && <span>· {message.model}</span>}
          {message.isStreaming && <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> génération...</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Composant AIStatus Badge ───────────────────────────────
function AIStatusBadge({ status }: { status: AIStatus | null }) {
  if (!status) return null;

  const colors = {
    ready: 'bg-green-100 text-green-700',
    incomplete: 'bg-yellow-100 text-yellow-700',
    offline: 'bg-red-100 text-red-700',
  };

  const labels = {
    ready: 'IA opérationnelle',
    incomplete: 'Modèles manquants',
    offline: 'IA hors ligne',
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status.status]}`}>
      <Activity size={12} />
      {labels[status.status]}
    </div>
  );
}

// ─── Composant Principal AIAssistant ────────────────────────
export default function AIAssistant() {
  const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } = useSSEChat();
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('mistral:7b');
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prompts rapides médicaux
  const quickPrompts = [
    { icon: '🫀', label: 'Urgence cardiaque', prompt: 'Patient avec douleur thoracique irradiant dans le bras gauche, dyspnée et sueurs. Conduite à tenir ?' },
    { icon: '💊', label: 'Interaction médicamenteuse', prompt: 'Quelles sont les interactions à surveiller entre warfarine et aspirine ?' },
    { icon: '🔬', label: 'Interprétation bilan', prompt: 'Aide-moi à interpréter ce bilan sanguin avec une CRP élevée et leucocytose.' },
    { icon: '📋', label: 'Protocole HAS', prompt: 'Rappelle-moi le protocole HAS pour la prise en charge de l\'HTA de l\'adulte.' },
  ];

  // Récupère le statut IA au chargement
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/ai/status', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAIStatus(data);
          if (data.models.length > 0) {
            setSelectedModel(data.models[0].name);
          }
        }
      } catch {
        setAIStatus({ available: false, models: [], missingModels: [], status: 'offline' });
      } finally {
        setIsLoadingStatus(false);
      }
    }
    fetchStatus();
  }, []);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;
    setInputValue('');
    sendMessage(trimmed, selectedModel);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">DoctIA — Assistant Médical</h1>
            <p className="text-xs text-gray-500">Alimenté par Ollama · Données locales HIPAA</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélecteur de modèle */}
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
            disabled={isStreaming}
          >
            {aiStatus?.models.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
            {(!aiStatus || aiStatus.models.length === 0) && (
              <option value="mistral:7b">mistral:7b</option>
            )}
          </select>

          <AIStatusBadge status={aiStatus} />

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
              disabled={isStreaming}
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── Zone Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">

          {/* Message de bienvenue */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="text-blue-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Bonjour, Docteur</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Je suis DoctIA, votre assistant médical IA. Je peux vous aider avec des informations cliniques,
                des diagnostics différentiels et la rédaction de comptes rendus.
              </p>

              {/* Prompts rapides */}
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(qp.prompt, selectedModel)}
                    className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-lg">{qp.icon}</span>
                    <p className="text-sm font-medium text-gray-700 mt-1">{qp.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Avertissement IA hors ligne */}
          {aiStatus?.status === 'offline' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">
                L'agent IA est hors ligne. Vérifiez qu'Ollama est démarré avec <code className="bg-red-100 px-1 rounded">docker compose up ollama</code>
              </p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Zone de Saisie ── */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100">
            {/* Textarea auto-resize */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez la situation clinique... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-48"
              rows={1}
              disabled={isStreaming && false} // Laisse taper pendant le stream
            />

            {/* Bouton stop ou send */}
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="flex-shrink-0 w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                title="Arrêter la génération"
              >
                <div className="w-3 h-3 bg-red-600 rounded-sm" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || aiStatus?.status === 'offline'}
                className="flex-shrink-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors"
                title="Envoyer (Entrée)"
              >
                <Send size={15} />
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            DoctIA est un outil d'aide à la décision. Les réponses ne remplacent pas le jugement clinique.
          </p>
        </div>
      </div>
    </div>
  );
}
