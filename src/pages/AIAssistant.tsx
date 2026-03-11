import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Brain, Send, Sparkles, MessageSquare, 
  Lightbulb, Zap, ArrowRight, Bot 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "Summarize my Database notes",
  "Explain React Hooks simply",
  "Create a study plan for CS401",
  "How to prepare for Mid-terms?"
];

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: `Hello ${user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}! I'm your Academic Insight assistant. How can I help you with your studies today?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `I've analyzed your current courses. Regarding "${userMsg}", I recommend focusing on the core concepts in your "Advanced Web Technologies" module. Would you like me to generate a summary of the latest lecture?` 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Academic Insights <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Your AI-powered study companion and research assistant.</p>
        </div>
        <Badge variant="outline" className="h-6 border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
          Beta v1.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0 gap-4">
          <Card className="flex-1 flex flex-col min-h-0 border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="py-3 border-b bg-secondary/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Encryption Active</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-white border text-foreground rounded-tl-none'
                    }`}>
                      {m.role === 'bot' && <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
                        <Bot className="w-3 h-3" /> System Insight
                      </div>}
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white border p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <div className="p-4 bg-white/80 border-t shrink-0">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask any question about your courses..." 
                  className="flex-1 bg-secondary/30 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary h-11 px-4"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} className="w-11 h-11 rounded-full p-0 shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">Suggested Prompts</h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(s)}
                    className="w-full text-left p-3 rounded-xl border bg-white hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="group-hover:text-primary transition-colors">{s}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none bg-primary/5 shadow-none p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Study Tip</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "Students who use AI for summarization recall 40% more detail when tested."
                </p>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none bg-emerald-50 shadow-none p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded bg-emerald-100 text-emerald-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Quick Actions</h4>
                </div>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-8 hover:bg-emerald-100/50">
                    Flashcards
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-8 hover:bg-emerald-100/50">
                    Voice Note
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default AIAssistant;
