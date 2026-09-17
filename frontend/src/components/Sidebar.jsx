import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, MessageSquare, History, LogOut, Utensils, UserCircle, Sparkles, ArrowRightLeft } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Compare', path: '/compare', icon: ArrowRightLeft },
    { name: 'Analytics', path: '/analytics', icon: Activity },
  ];

  const healthNav = [
    { name: 'Nutrition Plan', path: '/nutrition/plan', icon: Utensils },
    { name: 'My Profile', path: '/nutrition/profile', icon: UserCircle },
    { name: 'AI Chatbot', path: '/chat', icon: MessageSquare },
    { name: 'History', path: '/history', icon: History },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
          isActive
            ? 'bg-blue-500/[0.12] text-blue-400 font-medium border-l-2 border-blue-400 ml-0 pl-[14px]'
            : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border-l-2 border-transparent ml-0 pl-[14px]'
        }`
      }
    >
      <item.icon className="w-[18px] h-[18px]" />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <aside className="w-72 bg-slate-950 h-screen fixed left-0 top-0 text-slate-300 flex flex-col font-inter z-50 border-r border-slate-800/40">
      
      {/* Logo */}
      <div className="px-6 pt-6 pb-5 flex items-center space-x-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl glow-blue">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <span className="text-base font-bold font-outfit text-white tracking-tight block">MEDICAL AI</span>
          <span className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">Health Platform</span>
        </div>
      </div>

      <div className="h-px bg-slate-800/40 mx-4 mb-4" />

      {/* Main Nav */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-hide space-y-1">
        <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase px-4 mb-2">Main</p>
        {mainNav.map(item => <NavItem key={item.name} item={item} />)}
        
        <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase px-4 mt-6 mb-2">Health & AI</p>
        {healthNav.map(item => <NavItem key={item.name} item={item} />)}
      </nav>

      {/* AI Card */}
      <div className="px-4 mb-3">
        <button
          onClick={() => navigate('/chat')}
          className="w-full glass-card rounded-xl p-4 text-left hover:border-blue-500/20 transition-all group"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white">AI Assistant</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
            </span>
            <span className="text-[11px] text-slate-600 group-hover:text-blue-400 transition-colors">Open →</span>
          </div>
        </button>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800/40">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all w-full text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] text-sm"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
