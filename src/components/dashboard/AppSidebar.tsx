import {
  LayoutDashboard, ClipboardCheck, FileText, BookOpen, Brain,
  Briefcase, Calendar, MessageSquare, Users, Bell, GraduationCap,
  ShoppingBag, MapPin, BarChart3, Clock, Shield, TrendingUp
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Academic Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Attendance", url: "/dashboard/attendance", icon: ClipboardCheck },
  { title: "Course Registry", url: "/dashboard/assignments", icon: FileText },
  { title: "Library Access", url: "/dashboard/materials", icon: BookOpen },
  { title: "Academic Insights", url: "/dashboard/insights", icon: TrendingUp },
  { title: "Class Schedule", url: "/dashboard/timetable", icon: Clock },
  { title: "AI Tutor Hub", url: "/dashboard/ai", icon: Brain },
];

const socialItems = [
  { title: "Internships", url: "/dashboard/internships", icon: Briefcase },
  { title: "Events", url: "/dashboard/events", icon: Calendar },
  { title: "Forum", url: "/dashboard/forum", icon: MessageSquare },
  { title: "Projects", url: "/dashboard/projects", icon: Users },
  { title: "Portfolio", url: "/dashboard/portfolio", icon: GraduationCap },
];

const moreItems = [
  { title: "Student Stores", url: "/dashboard/marketplace", icon: ShoppingBag },
  { title: "Lost & Found", url: "/dashboard/lost-found", icon: MapPin },
  { title: "Official Notices", url: "/dashboard/notifications", icon: Bell },
  { title: "Performance Pro", url: "/dashboard/insights", icon: BarChart3 },
  { title: "Campus Security", url: "/dashboard/emergency", icon: Shield },
];

const NavGroup = ({ label, items, collapsed }: { label: string; items: typeof mainItems; collapsed: boolean }) => {
  const location = useLocation();
  const isExpanded = items.some((i) => location.pathname === i.url);

  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="hover:bg-sidebar-accent/50 rounded-lg transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border/50 mb-4">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-sm tracking-tight uppercase">Campus Connect Hub</span>}
      </div>
      <SidebarContent className="px-2">
        <NavGroup label="Main" items={mainItems} collapsed={collapsed} />
        <NavGroup label="Social" items={socialItems} collapsed={collapsed} />
        <NavGroup label="More" items={moreItems} collapsed={collapsed} />
      </SidebarContent>
    </Sidebar>
  );
}
