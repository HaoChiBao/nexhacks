import { useState, useRef, useEffect } from "react";
import { Send, User as UserIcon, Bot, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFundBuilderStore } from "@/store/useFundBuilderStore";

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
       id: '1',
       role: 'agent',
       content: "I've balanced the High Liquidity cluster at 25% each. Would you like me to explain the correlation factors?",
       timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addAgentEvent } = useFundBuilderStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock Agent Response
    setTimeout(() => {
       const agentMsg: Message = {
         id: crypto.randomUUID(),
         role: 'agent',
         content: "I'm analyzing that request. One moment...",
         timestamp: new Date().toISOString()
       };
       setMessages(prev => [...prev, agentMsg]);
       
       addAgentEvent({
           title: 'Processing User Request',
           message: userMsg.content,
           status: 'running',
           type: 'thinking'
       });
       
       setTimeout(() => {
           addAgentEvent({
               title: 'Response Ready',
               message: 'Generated explanation for weighting strategy.',
               status: 'done',
               type: 'thinking'
           });
           setMessages(prev => prev.map(m => m.id === agentMsg.id ? {
               ...m, content: "The weighting strategy minimizes variance by capping exposure to high-volatility events like 'GPT-5 Release'. This aligns with your risk rule of max 15% drawdown."
           } : m));
       }, 2000);

    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-surface-dark border-l border-border-dark">
      <div className="p-4 border-b border-border-dark flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <h3 className="font-bold text-white text-sm">AI Chat</h3>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-none">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'agent' ? "bg-emerald-900/50 text-emerald-500" : "bg-gray-700 text-gray-300"
            )}>
              {msg.role === 'agent' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "p-3 rounded-2xl text-xs leading-relaxed",
              msg.role === 'agent' 
                ? "bg-gray-800/50 text-gray-200 rounded-tl-none border border-gray-700/50" 
                : "bg-emerald-900/30 text-emerald-100 rounded-tr-none border border-emerald-800/30"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border-dark">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
           {['Explain Weights', 'Show Sources', 'Re-run Sim'].map(chip => (
               <button 
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 rounded-full border border-gray-700 transition-colors whitespace-nowrap"
               >
                   {chip}
               </button>
           ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message AI Agent..."
            className="w-full bg-black/20 border border-gray-700/50 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button 
             onClick={handleSend}
             className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 p-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
