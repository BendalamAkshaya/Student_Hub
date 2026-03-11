import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Clock, CheckCircle2, AlertCircle, 
  Plus, Search, ArrowUpRight, UploadCloud, 
  Calendar as CalendarIcon, Loader2 
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Assignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newPoints, setNewPoints] = useState("100");
  const [newDueDate, setNewDueDate] = useState("");

  const fetchAssignments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, courses(title), submissions(*)');

      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
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
    fetchAssignments();
    fetchCourses();
  }, [user]);

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCourse) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('assignments')
        .insert({
          course_id: selectedCourse,
          title: newTitle,
          description: newDescription,
          total_points: parseInt(newPoints),
          due_date: newDueDate
        });

      if (error) throw error;

      toast({
        title: "Assignment Created",
        description: "New task has been added to the course registry.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setSelectedCourse("");
    setNewPoints("100");
    setNewDueDate("");
  };

  const pendingCount = assignments.filter(a => a.submissions.length === 0).length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Course Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage assignments and academic submissions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="h-10 w-64 bg-secondary/50 border-none rounded-xl pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">Create Assignment</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Define a new academic task for the course registry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAssignment} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Course Assignment</Label>
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
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task Title</Label>
                  <Input 
                    placeholder="e.g. Lab Report: Database Design" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="rounded-xl border-sidebar-border bg-secondary/30"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Points</Label>
                    <Input 
                      type="number" 
                      value={newPoints}
                      onChange={(e) => setNewPoints(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due Date</Label>
                    <Input 
                      type="date" 
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Instructions</Label>
                  <Textarea 
                    placeholder="Provide details for the students..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="rounded-xl border-sidebar-border bg-secondary/30 min-h-[100px]"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Confirm Registration
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-card rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">{assignments.length}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Total Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-destructive/5 rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">{pendingCount}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-destructive/80 italic">Action Required</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-card rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">{assignments.length - pendingCount}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/80 italic">System Cleared</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-card rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">84%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600/80 italic">Credit Yield</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Registry</h3>
          </div>
          
          <div className="space-y-3">
            {assignments.length > 0 ? assignments.map((a) => (
              <Card key={a.id} className="border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className={`w-1.5 ${a.submissions?.[0] ? 'bg-emerald-500' : 'bg-primary'}`} />
                    <div className="p-5 flex-1 flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1 min-w-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 italic">
                              {a.courses?.title || 'System'}
                            </span>
                          </div>
                          <h4 className="text-lg font-black tracking-tight mt-1 group-hover:text-primary transition-colors uppercase italic">{a.title}</h4>
                          <p className="text-sm text-foreground/70 line-clamp-2 mt-1 leading-relaxed font-medium">{a.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none italic">
                              Due {new Date(a.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none italic">{a.total_points} Points</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                        {a.submissions?.[0] ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none italic">Verified</span>
                          </div>
                        ) : (
                          <Button size="sm" className="h-9 rounded-xl bg-primary text-[9px] font-black uppercase tracking-widest px-4 shadow-sm">
                            <UploadCloud className="w-3.5 h-3.5 mr-2" />
                            Submit
                          </Button>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center gap-4">
                <FileText className="w-12 h-12 text-muted-foreground/20" />
                <div className="space-y-1">
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Registry Empty</h3>
                   <p className="text-sm font-bold text-muted-foreground italic">No academic tasks are currently assigned.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                  Create First Task
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show" className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Evaluation Log</h3>
          <Card className="border-none shadow-sm bg-white h-[fit-content] rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-secondary/10">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Latest Grades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-secondary/20">
                <div className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                  <div>
                    <div className="font-black tracking-tight text-sm uppercase italic">Introduction to CS</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest italic">Assignment 1</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 text-sm">92/100</div>
                    <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest italic">A Grade</div>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                  <div>
                    <div className="font-black tracking-tight text-sm uppercase italic">Discrete Math</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest italic">Quiz 2</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 text-sm">45/50</div>
                    <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest italic">A Grade</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Assignments;
