import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  Files,
  Search,
  ClipboardList,
  Users,
  Sparkles,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  ChevronRight,
  BrainCircuit,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import NotificationsMenu from "../components/NotificationsMenu";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contractorLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Create Tender", path: "/create-tender", icon: FilePlus2 },
    { label: "My Tenders", path: "/my-tenders", icon: Files },
    { label: "Applications", path: "/applications", icon: ClipboardList },
  ];

  const writerLinks = [
    { label: "Dashboard", path: "/writer-dashboard", icon: LayoutDashboard },
    { label: "Browse Tenders", path: "/browse-tenders", icon: Search },
    { label: "My Applications", path: "/applications", icon: ClipboardList },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin-dashboard#users", icon: Users },
    { label: "Tenders", path: "/admin-dashboard#tenders", icon: Files },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "writer"
      ? writerLinks
      : contractorLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel =
    user?.role === "writer"
      ? "Bid Writer"
      : user?.role === "admin"
      ? "Administrator"
      : "Contractor";

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-bold">GovTender</p>
              <p className="text-xs text-slate-400">Tender Marketplace</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {links.map((item) => {
            const Icon = item.icon;
            const basePath = item.path.split("#")[0];
            const active = location.pathname === basePath;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}

          <div className="my-6 border-t border-white/10" />
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Platform
          </p>

          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Sparkles size={18} />
            View Marketplace
          </Link>

          <Link to="/ai-assistant" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <BrainCircuit size={18} />
            AI Assistant
          </Link>

          <Link to="/messages" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <MessageSquare size={18} />
            Messages
          </Link>

          <Link to="/reviews" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Star size={18} />
            Reviews
          </Link>

          <Link to="/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Welcome back,</p>
            <p className="font-semibold text-slate-900">{user?.name}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <NotificationsMenu />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{roleLabel}</p>
              <p className="text-xs text-slate-500">GovTender Account</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-5rem)] p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
