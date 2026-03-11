import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
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
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="attendance" element={<ComingSoon title="Attendance Tracker" />} />
            <Route path="assignments" element={<ComingSoon title="Assignment System" />} />
            <Route path="materials" element={<ComingSoon title="Study Material Hub" />} />
            <Route path="ai" element={<ComingSoon title="AI Study Assistant" />} />
            <Route path="timetable" element={<ComingSoon title="Smart Timetable" />} />
            <Route path="internships" element={<ComingSoon title="Internship Hub" />} />
            <Route path="events" element={<ComingSoon title="Event Management" />} />
            <Route path="forum" element={<ComingSoon title="Community Forum" />} />
            <Route path="projects" element={<ComingSoon title="Project Collaboration" />} />
            <Route path="portfolio" element={<ComingSoon title="Portfolio Builder" />} />
            <Route path="marketplace" element={<ComingSoon title="Campus Marketplace" />} />
            <Route path="lost-found" element={<ComingSoon title="Lost & Found" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications" />} />
            <Route path="analytics" element={<ComingSoon title="Admin Analytics" />} />
            <Route path="emergency" element={<ComingSoon title="Emergency SOS" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
