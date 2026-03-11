import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, TrendingUp, Award, Target, 
  Plus, Loader2, BarChart3, ChevronRight 
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

const AcademicInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grades, setGrades] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("1");
  const [gradePoint, setGradePoint] = useState("");
  const [marks, setMarks] = useState("");

  const fetchGrades = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grades')
        .select('*, courses(title, code)')
        .order('semester', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error("Error fetching grades:", err);
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
    fetchGrades();
    fetchCourses();
  }, [user]);

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCourse) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('grades')
        .insert({
          student_id: user.id,
          course_id: selectedCourse,
          semester: parseInt(semester),
          grade_point: parseFloat(gradePoint),
          marks_obtained: parseInt(marks)
        });

      if (error) throw error;

      toast({
        title: "Grade Registered",
        description: "Your academic performance has been updated.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCourse("");
    setSemester("1");
    setGradePoint("");
    setMarks("");
  };

  const cgpa = grades.length > 0 
    ? (grades.reduce((acc, curr) => acc + parseFloat(curr.grade_point), 0) / grades.length).toFixed(2)
    : "0.00";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-2">
            Academic Insights <Brain className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Performance analytics and semester-wise credit tracking.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Input Performance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">Register Performance</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Add official results to your institutional transcript.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGrade} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Semester</Label>
                  <Select defaultValue="1" onValueChange={setSemester}>
                    <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Course</Label>
                  <Select onValueChange={setSelectedCourse} required>
                    <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                      <SelectValue placeholder="Select Course" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grade Point (0-10)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 9.5" 
                      value={gradePoint}
                      onChange={(e) => setGradePoint(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Marks Obtained</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 85" 
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Award className="w-4 h-4 mr-2" />}
                    Lock Performance
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
        <motion.div variants={itemAnim}>
          <Card className="border-none shadow-sm bg-primary text-primary-foreground rounded-3xl overflow-hidden relative">
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tighter italic">{cgpa}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 italic">Current CGPA</div>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
               <TrendingUp className="w-24 h-24" />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemAnim}>
          <Card className="border-none shadow-sm bg-white rounded-3xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-secondary/50 text-primary">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">Distinction</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Current Standing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnim}>
          <Card className="border-none shadow-sm bg-white rounded-3xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-secondary/50 text-emerald-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">98th</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Percentile Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnim}>
          <Card className="border-none shadow-sm bg-white rounded-3xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-secondary/50 text-amber-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight italic">24</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Total Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemAnim} initial="hidden" animate="show" className="lg:col-span-2 space-y-4 w-full">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Performance Log</h3>
           </div>
           
           {loading ? (
             <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Calculating Trajectory...</p>
             </div>
           ) : (
             <div className="space-y-4">
                {grades.length > 0 ? grades.map((g) => (
                   <Card key={g.id} className="border-none shadow-sm bg-white hover:shadow-md transition-all rounded-3xl overflow-hidden group">
                      <CardContent className="p-6">
                         <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                               <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex flex-col items-center justify-center border border-sidebar-border shrink-0">
                                  <div className="text-xs font-black uppercase tracking-widest opacity-60">SEM</div>
                                  <div className="text-xl font-black tracking-tight leading-none italic">{g.semester}</div>
                               </div>
                               <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                     <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary italic px-2">
                                        {g.courses?.code}
                                     </Badge>
                                  </div>
                                  <h4 className="text-lg font-black tracking-tighter uppercase italic truncate">{g.courses?.title}</h4>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-sidebar-border">
                               <div className="text-center sm:text-right">
                                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 italic">Score</div>
                                  <div className="text-lg font-black italic tracking-tighter">{g.marks_obtained}%</div>
                               </div>
                               <div className="text-center sm:text-right">
                                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 italic">Grade</div>
                                  <div className="text-2xl font-black text-primary italic tracking-tighter leading-none">{parseFloat(g.grade_point).toFixed(1)}</div>
                               </div>
                               <ChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary transition-colors hidden sm:block" />
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                )) : (
                  <div className="py-32 text-center border-2 border-dashed rounded-[2.5rem] bg-secondary/10 flex flex-col items-center justify-center gap-4">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/20" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Trajectory Unknown</h3>
                      <p className="text-sm font-bold text-muted-foreground italic">Input your performance data to see academic insights.</p>
                    </div>
                  </div>
                )}
             </div>
           )}
        </motion.div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-3xl overflow-hidden h-[fit-content]">
              <CardHeader className="p-6 border-b bg-secondary/10">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Semester breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {[1, 2].map((s) => (
                    <div key={s} className="space-y-2">
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-muted-foreground uppercase tracking-widest italic">Semester {s}</span>
                          <span className="font-black italic">9.2 SGPA</span>
                       </div>
                       <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '92%' }} />
                       </div>
                    </div>
                 ))}
                 <div className="pt-4 border-t border-sidebar-border flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Goal Optimization</span>
                    <Badge className="bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest">Active</Badge>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-3xl bg-secondary/5 border border-sidebar-border h-[fit-content] p-6">
              <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Award className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase italic tracking-tight">Dean's List Candidate</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Maintaining current trajectory will qualify you for technical honors.</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AcademicInsights;
