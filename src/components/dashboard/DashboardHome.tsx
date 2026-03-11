import { motion } from "framer-motion";
import {
  BookOpen, CalendarDays, CheckCircle2, TrendingUp,
  Clock, AlertTriangle, Sparkles, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const attendanceData: any[] = [];

const subjectAttendance: any[] = [];

const todayClasses: any[] = [];

const assignments: any[] = [];

const announcements: any[] = [];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardHome = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [localAnnouncements, setLocalAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // Fetch Announcements
        const { data: announcementData } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (announcementData) setLocalAnnouncements(announcementData);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Status: <span className="text-primary">{profile?.full_name || 'Student'}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-tight">
            {profile?.department ? `${profile.department} Dept | ` : ""}System synchronized.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded border-border text-xs font-semibold uppercase tracking-wider">
            Export Report
          </Button>
          <Button size="sm" className="h-9 rounded bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
            Refresh Data
          </Button>
        </div>
      </motion.div>

      {/* Primary KPI Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Attendance Average", value: "0%", icon: CheckCircle2, status: "Pending Sync" },
          { label: "Active Courses", value: "0", icon: BookOpen, status: "Active" },
          { label: "Cumulative GPA", value: "0.00", icon: TrendingUp, status: "Official" },
          { label: "Pending Tasks", value: "0", icon: Clock, status: "Action Required" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{s.status}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tighter">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analytics Section */}
        <motion.div variants={item} className="lg:col-span-2 border rounded-lg bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Performance Analytics</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Attendance</span>
              <span className="flex items-center gap-1.5 text-muted-foreground/40"><div className="w-2 h-2 rounded-full bg-border" /> Threshold</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.05)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Schedule/Upcoming */}
        <motion.div variants={item} className="border rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Course Schedule</h3>
          <div className="space-y-4">
            {todayClasses.length > 0 ? todayClasses.map((c) => (
              <div key={c.time} className="p-4 rounded border border-border bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm tracking-tight">{c.subject}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{c.faculty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary">{c.time}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{c.room}</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded bg-secondary/5">
                <CalendarDays className="w-8 h-8 text-muted-foreground/20 mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">No sessions scheduled</p>
              </div>
            )}
          </div>
          <Button variant="ghost" className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
            View Full Calendar
          </Button>
        </motion.div>
      </div>

      {/* Secondary Information Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assignments */}
        <motion.div variants={item} className="border rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Internal Tasks</h3>
          <div className="space-y-3">
            {assignments.length > 0 ? assignments.map((a) => (
              <div key={a.title} className="flex items-center gap-4 p-4 rounded border bg-secondary/5">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.status === "submitted" ? "bg-success" : "bg-warning"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold tracking-tight truncate">{a.title}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Due: {a.due}</div>
                </div>
                <div className="px-2 py-1 rounded bg-secondary text-[9px] font-bold uppercase tracking-widest">{a.subject}</div>
              </div>
            )) : (
              <div className="py-8 text-center border border-dashed rounded text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                No active requirements
              </div>
            )}
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div variants={item} className="border rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Metric Variance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendance} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 2, 2, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div variants={item} className="border rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">System Notices</h3>
          <div className="space-y-4">
            {localAnnouncements.length > 0 ? localAnnouncements.map((a) => (
              <div key={a.id} className="p-4 rounded border bg-secondary/5 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold tracking-tight flex items-center gap-2">
                      {a.priority === 'urgent' && <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />}
                      <span className="truncate">{a.title}</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            )) : (
              <div className="py-8 text-center border border-dashed rounded text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                Official notices pending
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Administrative Info Section */}
      <motion.div variants={item} className="border rounded-lg bg-primary/[0.03] p-8 border-primary/20 shadow-sm overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold tracking-tight mb-2">Portal Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your academic dashboard serves as the central interface for all institutional data. 
              Synchronization is performed daily at 00:00 UTC. For support or documentation regarding 
              this interface, please visit the internal knowledge base.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button variant="outline" className="h-10 rounded border-primary/20 bg-background/50 text-[10px] font-bold uppercase tracking-widest">
              Knowledge Base
            </Button>
            <Button className="h-10 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
              Contact Support
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
