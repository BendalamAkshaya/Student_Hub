import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Library, BookOpen, Search, Download, 
  Filter, FileText, Video, Layout, FileCode,
  ArrowUpRight, ExternalLink, Plus, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Materials = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedType, setSelectedType] = useState("notes");

  const fetchMaterials = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_materials')
        .select('*, courses(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, code');
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, [user]);

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCourse) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('study_materials')
        .insert({
          course_id: selectedCourse,
          title: newTitle,
          file_url: newUrl,
          material_type: selectedType
        });

      if (error) throw error;

      toast({
        title: "Resource Added",
        description: "New material is now available in the library hub.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewUrl("");
    setSelectedCourse("");
    setSelectedType("notes");
  };

  const filteredMaterials = filter === "all" 
    ? materials 
    : materials.filter(m => m.material_type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notes': return <FileText className="w-5 h-5" />;
      case 'ppt': return <Layout className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'paper': return <FileCode className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
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
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-2">
            Library Access <Library className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Digital resource repository and archived lectures.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="h-10 w-64 bg-secondary/50 border-none rounded-xl pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">Contribute Resource</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Add a new study material to the institutional hub.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMaterial} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Course</Label>
                  <Select onValueChange={setSelectedCourse} required>
                    <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Material Type</Label>
                  <Select defaultValue="notes" onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notes">Notes (PDF)</SelectItem>
                      <SelectItem value="ppt">Slides (PPTX)</SelectItem>
                      <SelectItem value="video">Lecture Video</SelectItem>
                      <SelectItem value="paper">Academic Paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource Title</Label>
                  <Input 
                    placeholder="e.g. Intro to Quantum Computing" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="rounded-xl border-sidebar-border bg-secondary/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource URL / Link</Label>
                  <Input 
                    placeholder="https://drive.google.com/..." 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="rounded-xl border-sidebar-border bg-secondary/30"
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Confirm Sync
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'notes', 'ppt', 'video', 'paper'].map((t) => (
          <Button
            key={t}
            onClick={() => setFilter(t)}
            variant={filter === t ? "default" : "secondary"}
            size="sm"
            className={`h-9 rounded-xl px-5 text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === t ? 'shadow-md shadow-primary/10' : 'bg-white border hover:bg-primary/5'
            }`}
          >
            {t}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic text-center">Calibrating Resource Vault...</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredMaterials.length > 0 ? filteredMaterials.map((m) => (
              <motion.div variants={itemAnim} key={m.id} layout>
                <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden rounded-2xl bg-white h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="p-5 border-b bg-secondary/10 flex items-start justify-between">
                      <div className={`p-3 rounded-2xl bg-primary/10 text-primary shadow-inner`}>
                        {getTypeIcon(m.material_type)}
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-white/50 backdrop-blur-sm border-sidebar-border">
                        {m.material_type}
                      </Badge>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1 truncate italic">
                        {m.courses?.title || 'General Resource'}
                      </div>
                      <h4 className="text-sm font-black tracking-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] uppercase italic leading-tight">
                        {m.title}
                      </h4>
                      <div className="flex items-center justify-between pt-6 mt-auto">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                          {new Date(m.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            asChild 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all"
                          >
                            <a href={m.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center flex flex-col items-center justify-center gap-4 bg-secondary/10 border-2 border-dashed rounded-3xl"
              >
                <Library className="w-12 h-12 text-muted-foreground/20" />
                <div className="space-y-1">
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Resource Vault Empty</h3>
                   <p className="text-sm font-bold text-muted-foreground italic">Contribute materials to build the institutional knowledge base.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                  Upload Material
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Materials;
