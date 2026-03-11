import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, 
  Calendar as CalendarIcon, Filter, ArrowUpRight, 
  Plus, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("present");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAttendance = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, courses(title)')
        .eq('student_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
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
    fetchAttendance();
    fetchCourses();
  }, [user]);

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCourse) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('attendance')
        .insert({
          student_id: user.id,
          course_id: selectedCourse,
          status: selectedStatus,
          date: selectedDate
        });

      if (error) throw error;

      toast({
        title: "Attendance Recorded",
        description: `Marked as ${selectedStatus} for the selected session.`,
      });

      setIsDialogOpen(false);
      fetchAttendance();
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

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const percentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

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
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Attendance Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your presence and compliance records.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">Record Attendance</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Manually enter your class presence for the registry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAttendance} className="space-y-4 py-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
                    <Select defaultValue="present" onValueChange={setSelectedStatus}>
                      <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
                    <Input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30" 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Confirm Registry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-primary/5 relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Overall Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight italic">{percentage.toFixed(1)}%</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider italic">Requirement: 75%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={percentage} className="h-1.5 mt-4" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight italic">{totalClasses}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider italic">Current Semester</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-3xl font-black tracking-tight italic ${percentage >= 75 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {percentage >= 75 ? 'Secure' : 'At Risk'}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider italic">
                    {percentage >= 75 ? 'Attendance compliant' : 'Action required'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${percentage >= 75 ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  {percentage >= 75 ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-amber-500" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Attendance History */}
      <motion.div 
        variants={item}
        initial="hidden"
        animate="show"
        className="border-none rounded-3xl bg-white overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b bg-secondary/10 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log History</h3>
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10 italic">Real-time Sync</span>
        </div>
        <div className="divide-y divide-secondary/30">
          {attendance.length > 0 ? attendance.map((record) => (
            <div key={record.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className={`p-3 rounded-2xl ${
                  record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                  record.status === 'absent' ? 'bg-destructive/10 text-destructive' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  {record.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : 
                   record.status === 'absent' ? <XCircle className="w-5 h-5" /> : 
                   <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black tracking-tight group-hover:text-primary transition-colors uppercase italic">
                    {record.courses?.title || 'Unknown Course'}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full italic ${
                  record.status === 'present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                  record.status === 'absent' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 
                  'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {record.status}
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/40 transition-colors hidden sm:block" />
              </div>
            </div>
          )) : (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
              <AlertTriangle className="w-12 h-12 text-muted-foreground/20" />
              <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Registry Empty</h3>
                 <p className="text-sm font-bold text-muted-foreground italic">No attendance records found for this period.</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                Create First Entry
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Attendance;
