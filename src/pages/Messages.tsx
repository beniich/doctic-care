import { useState, useEffect, useRef } from 'react';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
import { ListPane } from '@/components/layout/ListPane';
import { DetailPane } from '@/components/layout/DetailPane';
import { Search, Send, Paperclip, MoreVertical, Plus, User, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const API_BASE = '/api';

export default function Messages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    }
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/messages/conversations`);
      if (res.ok) {
        const json = await res.json();
        setConversations(json.data || []);
      }
    } catch (e) {
      toast.error('Impossible de charger les conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`${API_BASE}/messages/conversations/${convId}/messages`);
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch (e) {
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    try {
      const res = await fetch(`${API_BASE}/messages/conversations/${selectedConv.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      if (res.ok) {
        const json = await res.json();
        setMessages([...messages, json.data]);
        setNewMessage('');
        fetchConversations(); // Refresh last message in list
      }
    } catch (e) {
      toast.error('Échec de l\'envoi');
    }
  };

  const filteredConversations = conversations.filter(c => 
    `${c.patient?.firstName} ${c.patient?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderListPane = () => (
    <ListPane
      title="Messages"
      searchPlaceholder="Rechercher une discussion..."
      onSearch={setSearchQuery}
      actions={<Button variant="ghost" size="icon" onClick={() => toast.info('Nouvelle discussion bientôt disponible')}><Plus className="h-4 w-4" /></Button>}
    >
      <div className="space-y-1">
        {filteredConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedConv(conv)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
              selectedConv?.id === conv.id
                ? 'bg-primary/10 border-l-2 border-primary'
                : 'hover:bg-muted'
            }`}
          >
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={conv.patient?.avatar} />
              <AvatarFallback>{conv.patient?.firstName?.[0]}{conv.patient?.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="font-semibold text-slate-200 truncate">{conv.patient?.firstName} {conv.patient?.lastName}</p>
                <span className="text-[10px] text-muted-foreground">{new Date(conv.updatedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {conv.messages?.[0]?.content || "Démarrer la discussion..."}
              </p>
            </div>
            {conv.messages?.[0]?.isRead === false && conv.messages?.[0]?.senderRole === 'PATIENT' && (
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_5px_rgba(0,210,255,0.8)]" />
            )}
          </button>
        ))}
        {filteredConversations.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Aucune discussion trouvée</p>
          </div>
        )}
      </div>
    </ListPane>
  );

  const renderEmptyDetail = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-950/30">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <MessageCircle className="h-10 w-10 text-primary animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-slate-200">Sélectionnez une discussion</h2>
      <p className="text-muted-foreground max-w-xs mt-2">
        Communiquez de manière sécurisée avec vos patients. Tous les échanges sont tracés et isolés par clinique.
      </p>
    </div>
  );

  const renderDetailPane = () => (
    <DetailPane>
      <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConv.patient?.avatar} />
              <AvatarFallback>{selectedConv.patient?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-100">{selectedConv.patient?.firstName} {selectedConv.patient?.lastName}</p>
              <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">En ligne</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isMe = msg.senderRole !== 'PATIENT';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={cn(
                  "max-w-[70%] p-3 rounded-2xl text-sm shadow-sm",
                  isMe 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-slate-800 text-slate-200 rounded-tl-none border border-white/5"
                )}>
                  <p>{msg.content}</p>
                  <div className="text-[10px] mt-1 opacity-50 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-3"
          >
            <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-white/5 border-white/10 focus-visible:ring-primary h-11"
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </DetailPane>
  );

  return (
    <OutlookLayout
      listPane={renderListPane()}
      detailPane={selectedConv ? renderDetailPane() : renderEmptyDetail()}
    />
  );
}

// Helper function for CN
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
