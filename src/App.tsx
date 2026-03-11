import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Materials from "./pages/Materials";
import AIAssistant from "./pages/AIAssistant";
import Marketplace from "./pages/Marketplace";
import Timetable from "./pages/Timetable";
import Forum from "./pages/Forum";
import AcademicInsights from "./pages/AcademicInsights";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import ComingSoon from "./components/dashboard/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="materials" element={<Materials />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="internships" element={<ComingSoon title="Internship Hub" />} />
            <Route path="events" element={<ComingSoon title="Event Management" />} />
            <Route path="forum" element={<Forum />} />
            <Route path="projects" element={<ComingSoon title="Project Collaboration" />} />
            <Route path="portfolio" element={<ComingSoon title="Portfolio Builder" />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="lost-found" element={<ComingSoon title="Lost & Found" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications" />} />
            <Route path="insights" element={<AcademicInsights />} />
            <Route path="emergency" element={<ComingSoon title="Emergency SOS" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
