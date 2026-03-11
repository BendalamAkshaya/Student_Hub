import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, Calendar, MapPin, User, 
  ChevronLeft, ChevronRight, Plus, 
  CheckCircle2, AlertCircle, Loader2 
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

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["08 AM", "09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM"];

const Timetable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [timetableData, setTimetableData] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [eventDay, setEventDay] = useState("Mon");
  const [startTime, setStartTime] = useState("09 AM");
  const [endTime, setEndTime] = useState("11 AM");
  const [room, setRoom] = useState("");

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          courses(title, code),
          profiles:professor_id(full_name)
        `);
      if (error) throw error;
      setTimetableData(data || []);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [coursesRes, facultyRes] = await Promise.all([
        supabase.from('courses').select('id, title, code'),
        supabase.from('profiles').select('id, full_name').eq('role', 'faculty')
      ]);
      setCourses(coursesRes.data || []);
      setFaculty(facultyRes.data || []);
    } catch (err) {
      console.error("Error fetching dependencies:", err);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchDependencies();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedFaculty) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('timetable')
        .insert({
          course_id: selectedCourse,
          professor_id: selectedFaculty,
          day_of_week: eventDay,
          start_time: startTime,
          end_time: endTime,
          room_number: room
        });

      if (error) throw error;

      toast({
        title: "Schedule Updated",
        description: "New lecture has been successfully registered.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchTimetable();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCourse("");
    setSelectedFaculty("");
    setEventDay("Mon");
    setStartTime("09 AM");
    setEndTime("11 AM");
    setRoom("");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  const getSlotColor = (index: number) => {
    const colors = [
      "bg-primary/5 text-primary border-primary/20",
      "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      "bg-indigo-500/10 text-indigo-600 border-indigo-200",
      "bg-amber-500/10 text-amber-600 border-amber-200",
      "bg-rose-500/10 text-rose-600 border-rose-200"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-2">
            Smart Timetable <Clock className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Institutional schedule and real-time class tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl px-6 text-[10px] font-bold uppercase tracking-widest border-sidebar-border hidden sm:flex">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly View
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 rounded-xl bg-primary px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase italic">Register Lecture</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Define a new session in the institutional calendar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Day</Label>
                    <Select defaultValue="Mon" onValueChange={setEventDay}>
                      <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Room / Lab</Label>
                    <Input 
                      placeholder="e.g. LT-401" 
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="rounded-xl border-sidebar-border bg-secondary/30"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject / Course</Label>
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
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Professor / Faculty</Label>
                   <Select onValueChange={setSelectedFaculty} required>
                    <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Time</Label>
                    <Select defaultValue="09 AM" onValueChange={setStartTime}>
                      <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">End Time</Label>
                    <Select defaultValue="11 AM" onValueChange={setEndTime}>
                      <SelectTrigger className="rounded-xl border-sidebar-border bg-secondary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-[10px] font-bold uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Lock Schedule
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-secondary/30 rounded-2xl w-fit flex-wrap">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedDay === day 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:bg-white hover:shadow-sm'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4 w-full">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Syncing Calendar Hub...</p>
             </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {timetableData.filter(t => t.day_of_week === selectedDay).length > 0 ? (
                  timetableData.filter(t => t.day_of_week === selectedDay).map((slot, i) => (
                    <motion.div variants={itemAnim} key={slot.id} layout>
                      <Card className={`border shadow-sm ${getSlotColor(i)} transition-all hover:shadow-xl group cursor-default rounded-3xl overflow-hidden`}>
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row items-stretch">
                            <div className="p-6 sm:px-8 flex flex-row sm:flex-col items-center justify-center sm:border-r border-current/10 bg-white/40">
                              <div className="text-2xl font-black tracking-tight leading-none italic uppercase">{slot.start_time.split(' ')[0]}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-2 sm:ml-0 sm:mt-1">{slot.start_time.split(' ')[1]}</div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-2 min-w-0">
                                  <div className="flex items-center gap-2">
                                     <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white/50 border-current/10 italic">
                                        {slot.courses?.code}
                                     </Badge>
                                     <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">#{slot.id.slice(0, 4)}</span>
                                  </div>
                                  <h4 className="font-black text-xl sm:text-2xl tracking-tighter leading-none truncate uppercase italic">{slot.courses?.title}</h4>
                                  <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-1.5 opacity-70">
                                      <MapPin className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-black uppercase tracking-widest italic">{slot.room_number}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-70">
                                      <User className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-black uppercase tracking-widest italic">{slot.profiles?.full_name}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 self-end sm:self-auto shrink-0 bg-white/30 p-4 rounded-2xl border border-current/5">
                                  <div className="text-right">
                                    <div className="text-[9px] font-bold uppercase tracking-widest opacity-50">Duration</div>
                                    <div className="text-base font-black italic tracking-tighter uppercase">{slot.start_time} - {slot.end_time}</div>
                                  </div>
                                  <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                  </div>
                                </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center gap-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Schedule Empty</h3>
                      <p className="text-sm font-bold text-muted-foreground italic">No official lectures registered for this day.</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                       Set Class
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block w-80 shrink-0 space-y-6">
           <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden h-[fit-content] rounded-3xl relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest opacity-80 italic">Immediate Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter leading-none italic uppercase">System Sync</h2>
                  <p className="text-xs font-bold opacity-80 mt-2 uppercase tracking-widest">Calendar Updated</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                   <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <Button className="w-full h-12 bg-white text-primary font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/90 shadow-lg">
                View Global Deck
              </Button>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 p-8 opacity-10 blur-2xl">
               <Clock className="w-48 h-48" />
            </div>
          </Card>

          <Card className="border-none shadow-sm h-[fit-content] rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b bg-secondary/10">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Efficiency Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-muted-foreground uppercase tracking-widest italic">Weekly Load</span>
                 <span className="font-black italic uppercase tracking-tighter text-sm">24 Sessions</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-muted-foreground uppercase tracking-widest italic">Avg Duration</span>
                 <span className="font-black italic uppercase tracking-tighter text-sm">2.0 Hours</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-muted-foreground uppercase tracking-widest italic">Calendar Lock</span>
                 <span className="font-black text-emerald-500 italic uppercase tracking-tighter text-sm">Active</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
