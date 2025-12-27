import { NavLink } from "react-router-dom";
import { Home, Calendar, MessageSquare, FileText } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/appointments", icon: Calendar, label: "Appointments" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/medical-records", icon: FileText, label: "Medical Records" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs w-full h-full transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
