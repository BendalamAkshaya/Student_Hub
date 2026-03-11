import { motion } from "framer-motion";
import {
  BookOpen, CalendarDays, CheckCircle2, TrendingUp,
  Clock, AlertTriangle, Sparkles, ArrowUpRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const attendanceData = [
  { month: "Jan", value: 92 }, { month: "Feb", value: 88 },
  { month: "Mar", value: 85 }, { month: "Apr", value: 90 },
  { month: "May", value: 78 }, { month: "Jun", value: 82 },
];

const subjectAttendance = [
  { subject: "Math", value: 92 }, { subject: "Physics", value: 85 },
  { subject: "CS", value: 96 }, { subject: "English", value: 78 },
  { subject: "Chemistry", value: 88 },
];

const todayClasses = [
  { time: "9:00 AM", subject: "Data Structures", room: "CS-201", faculty: "Dr. Kumar" },
  { time: "11:00 AM", subject: "Linear Algebra", room: "M-105", faculty: "Prof. Singh" },
  { time: "2:00 PM", subject: "Digital Electronics", room: "EC-302", faculty: "Dr. Patel" },
];

const assignments = [
  { title: "DSA Problem Set 5", due: "Tomorrow", status: "pending", subject: "CS" },
  { title: "Physics Lab Report", due: "Mar 14", status: "submitted", subject: "PHY" },
  { title: "Math Assignment 8", due: "Mar 16", status: "pending", subject: "MATH" },
];

const announcements = [
  { title: "Mid-Semester Exams Schedule Released", time: "2h ago", urgent: true },
  { title: "Hackathon 2026 Registration Open", time: "5h ago", urgent: false },
  { title: "Library timings extended during exams", time: "1d ago", urgent: false },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardHome = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">
          Good Morning, <span className="gradient-text">Priya</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Attendance", value: "87%", icon: CheckCircle2, change: "+2%", color: "text-emerald-500" },
          { label: "Assignments Due", value: "3", icon: Clock, change: "This week", color: "text-amber-500" },
          { label: "CGPA", value: "8.7", icon: TrendingUp, change: "+0.3", color: "text-primary" },
          { label: "Events", value: "5", icon: CalendarDays, change: "Upcoming", color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex justify-between items-start">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.change}</span>
            </div>
            <div className="text-2xl font-bold font-display">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Charts + Classes */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-semibold">Attendance Trend</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(245, 58%, 51%)" fill="url(#attendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Today's Classes */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Today's Classes
          </h3>
          <div className="space-y-3">
            {todayClasses.map((c) => (
              <div key={c.time} className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{c.subject}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.faculty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-primary">{c.time}</div>
                    <div className="text-xs text-muted-foreground">{c.room}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Assignments + Subject Attendance + Announcements */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Assignments */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a.title} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className={`w-2 h-2 rounded-full ${a.status === "submitted" ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">Due: {a.due}</div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{a.subject}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Attendance Bar */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">Subject-wise Attendance</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" width={60} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(245, 58%, 51%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">Announcements</h3>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.title} className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {a.urgent && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                      {a.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{a.time}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Recommendation */}
      <motion.div variants={item} className="glass-card p-5 gradient-bg-subtle">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold mb-1">AI Study Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on your upcoming Linear Algebra exam and current attendance pattern, I recommend focusing on Eigenvalues & Eigenvectors today. You've spent 40% less time on this topic compared to others. Want me to generate a quick quiz?
            </p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg gradient-bg text-primary-foreground">Generate Quiz</button>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground">View Study Plan</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick attendance */}
      <motion.div variants={item} className="glass-card p-5">
        <h3 className="font-display font-semibold mb-3">Quick Attendance Overview</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { subject: "Data Structures", pct: 96 },
            { subject: "Linear Algebra", pct: 78 },
            { subject: "Digital Electronics", pct: 85 },
          ].map((s) => (
            <div key={s.subject} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.subject}</span>
                <span className={s.pct < 80 ? "text-destructive font-semibold" : "text-muted-foreground"}>{s.pct}%</span>
              </div>
              <Progress value={s.pct} className="h-2" />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
