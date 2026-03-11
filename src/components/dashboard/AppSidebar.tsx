import {
  LayoutDashboard, ClipboardCheck, FileText, BookOpen, Brain,
  Briefcase, Calendar, MessageSquare, Users, Bell, GraduationCap,
  ShoppingBag, MapPin, BarChart3, Clock, Shield
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Attendance", url: "/dashboard/attendance", icon: ClipboardCheck },
  { title: "Assignments", url: "/dashboard/assignments", icon: FileText },
  { title: "Study Materials", url: "/dashboard/materials", icon: BookOpen },
  { title: "AI Assistant", url: "/dashboard/ai", icon: Brain },
  { title: "Timetable", url: "/dashboard/timetable", icon: Clock },
];

const socialItems = [
  { title: "Internships", url: "/dashboard/internships", icon: Briefcase },
  { title: "Events", url: "/dashboard/events", icon: Calendar },
  { title: "Forum", url: "/dashboard/forum", icon: MessageSquare },
  { title: "Projects", url: "/dashboard/projects", icon: Users },
  { title: "Portfolio", url: "/dashboard/portfolio", icon: GraduationCap },
];

const moreItems = [
  { title: "Marketplace", url: "/dashboard/marketplace", icon: ShoppingBag },
  { title: "Lost & Found", url: "/dashboard/lost-found", icon: MapPin },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Emergency", url: "/dashboard/emergency", icon: Shield },
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
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-display font-bold text-lg">StudentHub</span>}
      </div>
      <SidebarContent className="px-2">
        <NavGroup label="Main" items={mainItems} collapsed={collapsed} />
        <NavGroup label="Social" items={socialItems} collapsed={collapsed} />
        <NavGroup label="More" items={moreItems} collapsed={collapsed} />
      </SidebarContent>
    </Sidebar>
  );
}
