import { motion } from "framer-motion";
import {
  BookOpen, Brain, Briefcase, Calendar, ClipboardCheck, FileText,
  LayoutDashboard, MessageSquare, Shield, Users
} from "lucide-react";

const features = [
  { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Real-time overview of classes, deadlines, and attendance." },
  { icon: ClipboardCheck, title: "Attendance Tracker", desc: "AI-powered attendance analytics with predictions." },
  { icon: FileText, title: "Assignment System", desc: "Submit, grade, and get AI-powered feedback." },
  { icon: BookOpen, title: "Study Materials", desc: "Notes, PPTs, lectures, and past papers organized." },
  { icon: Brain, title: "AI Study Assistant", desc: "Chat-based tutor for quizzes, summaries, and coding." },
  { icon: Briefcase, title: "Internship Hub", desc: "Listings, resume builder, and placement stats." },
  { icon: Calendar, title: "Event Management", desc: "Register for hackathons, workshops, and fests." },
  { icon: MessageSquare, title: "Community Forum", desc: "Reddit-style discussion board for your campus." },
  { icon: Users, title: "Project Collab", desc: "Find teammates and collaborate on projects." },
  { icon: Shield, title: "Campus Safety", desc: "Emergency SOS with location sharing." },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Everything You Need, <span className="gradient-text">One App</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            18 powerful modules designed to transform your college experience.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-card-hover p-5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold font-display text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
