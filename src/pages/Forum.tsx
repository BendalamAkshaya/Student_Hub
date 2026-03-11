import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Heart, Share2, 
  MessageCircle, Send, Plus, 
  Filter, Award, Loader2, User 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = ["General", "Academic", "Events", "Hostel", "Internships"];

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  author_id: string;
  profiles?: { full_name: string; avatar_url: string };
}

const Forum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState("General");

  // New Post State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:author_id (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim() || !newContent.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          author_id: user.id,
          title: newTitle,
          content: newContent,
          category: activeCategory
        });

      if (error) throw error;

      toast({
        title: "Posted successfully!",
        description: "Your discussion is now live on the forum.",
      });

      setNewTitle("");
      setNewContent("");
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Failed to post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const likePost = async (postId: string, currentLikes: number) => {
    // Optimistic UI update could go here
    const { error } = await supabase
      .from('forum_posts')
      .update({ likes_count: currentLikes + 1 })
      .eq('id', postId);
    
    if (!error) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Community Forum <MessageSquare className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Engage with fellow students and share institutional updates.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
             <Filter className="w-3.5 h-3.5 mr-2" /> Filter
           </Button>
           <Button size="sm" className="h-9 rounded-xl bg-primary text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10">
             <Award className="w-3.5 h-3.5 mr-2" /> Top Rated
           </Button>
        </div>
      </div>

      {/* Post Creation Area */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
        <form onSubmit={handlePostSubmit}>
          <CardHeader className="p-4 border-b bg-secondary/10 flex flex-row items-center gap-3">
             <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px] uppercase font-bold">
                  {user?.user_metadata?.full_name?.substring(0,2) || 'ST'}
                </AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <Input 
                   placeholder="Discussion Title..." 
                   value={newTitle}
                   onChange={(e) => setNewTitle(e.target.value)}
                   className="bg-transparent border-none shadow-none focus-visible:ring-0 text-sm font-bold placeholder:text-muted-foreground/50 h-9"
                />
             </div>
             <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter transition-all border ${
                      activeCategory === cat 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-white text-muted-foreground border-transparent hover:border-sidebar-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </CardHeader>
          <CardContent className="p-0 relative">
             <textarea 
               placeholder="What's happening on campus?"
               value={newContent}
               onChange={(e) => setNewContent(e.target.value)}
               className="w-full min-h-[120px] p-6 text-sm resize-none focus:outline-none bg-transparent placeholder:text-muted-foreground/40 leading-relaxed font-medium"
             />
             <div className="flex items-center justify-between p-4 border-t border-secondary/20">
                <div className="flex items-center gap-2">
                   <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                   </Button>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                  className="h-9 rounded-xl px-6 bg-primary text-[10px] font-bold uppercase tracking-widest transition-all hover:shadow-xl hover:shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Send className="w-3 h-3 mr-2" />}
                  Post Discussion
                </Button>
             </div>
          </CardContent>
        </form>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Syncing Community Ledger...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all group cursor-default">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                        <Avatar className="w-10 h-10 border border-primary/10">
                          <AvatarFallback className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase">
                             <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="w-px h-full bg-secondary/50 flex-1" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-black text-foreground hover:text-primary transition-colors cursor-pointer uppercase italic">
                                {post.profiles?.full_name || 'Alumni User'}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">•</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                {post.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                           <button 
                             onClick={() => likePost(post.id, post.likes_count)}
                             className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group/btn"
                           >
                             <Heart className={`w-4 h-4 ${post.likes_count > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                             <span className="text-xs font-black italic">{post.likes_count}</span>
                           </button>
                           <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                             <MessageCircle className="w-4 h-4" />
                             <span className="text-xs font-black italic">Reply</span>
                           </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center gap-4">
              <MessageSquare className="w-12 h-12 text-muted-foreground/20" />
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">No Threads Yet</h3>
                <p className="text-sm font-bold text-muted-foreground italic">Start the first conversation on campus!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;
