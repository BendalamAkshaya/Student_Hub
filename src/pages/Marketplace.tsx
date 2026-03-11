import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Search, Plus, Heart, 
  MapPin, ChevronRight, Sparkles, Loader2 
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All Items", "Textbooks", "Electronics", "Furniture", "Tickets", "Other"];

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  image_url: string;
  seller_id: string;
  profiles?: { full_name: string };
}

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (activeCategory !== "All Items") {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          seller_id: user.id,
          title: newTitle,
          price: parseFloat(newPrice),
          category: newCategory,
          condition: newCondition,
          description: newDescription,
          image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200" // Placeholder
        });

      if (error) throw error;

      toast({
        title: "Item Listed!",
        description: "Your item is now live in the student store.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Listing failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewPrice("");
    setNewCategory("");
    setNewCondition("");
    setNewDescription("");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Student Stores <ShoppingBag className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Institutional marketplace for student-to-student commerce.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="h-10 w-64 bg-secondary/50 border-none rounded-xl pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Plus className="w-4 h-4 mr-2" /> List Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">List New Item</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Fill in the details to list your item
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Item Name</Label>
                  <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Calculus Textbook" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                    <Input id="price" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select onValueChange={setNewCategory} required>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All Items").map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Condition</Label>
                  <Select onValueChange={setNewCondition} required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand New">Brand New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Worn">Worn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                  <Textarea id="desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Tell us more about the item..." />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Confirm Listing
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "secondary"}
            size="sm"
            className={`h-9 rounded-xl px-5 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat ? 'shadow-md shadow-primary/10' : 'bg-white border hover:bg-primary/5'
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Syncing Student Store...</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div variants={itemAnim} key={item.id}>
              <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-white h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-primary px-2 py-1 rounded shadow-sm border border-primary/10">
                      {item.category}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:scale-110 transition-all">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-sm font-black text-primary">₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">{item.profiles?.full_name || 'Anonymous'} • {item.condition}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-secondary mt-auto">
                    <Button variant="outline" className="flex-1 h-9 rounded-lg border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5">
                      Chat
                    </Button>
                    <Button className="flex-1 h-9 rounded-lg bg-primary text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center gap-4">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">No Items Found</h3>
                <p className="text-sm font-bold text-muted-foreground italic">Be the first to list something in this category!</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <Card className="border-none bg-gradient-to-r from-primary/10 to-indigo-500/10 shadow-none overflow-hidden relative mt-8">
        <div className="p-8 flex items-center justify-between gap-8">
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Premium Service</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter italic">SELL YOUR STUFF INSTANTLY</h2>
            <p className="text-sm text-muted-foreground max-w-md">Join over 2,000 students already trading on the platform. Safe, institutional-only access.</p>
          </div>
          <div className="hidden lg:block shrink-0 opacity-10 blur-sm absolute -right-20 -top-20">
             <ShoppingBag className="w-96 h-96 transform rotate-12" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Marketplace;
