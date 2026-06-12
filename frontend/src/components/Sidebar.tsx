import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart2, Map as MapIcon, BrainCircuit, ShieldCheck, LogIn, LogOut, User as UserIcon, AlertTriangle, BadgeCheck, Code2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Live Map', path: '/map', icon: MapIcon },
    { name: 'ML Insights', path: '/ml-insights', icon: BrainCircuit },
    { name: 'Extreme Events', path: '/disasters', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur-xl flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="p-6 pt-8 pb-8 relative overflow-hidden border-b border-slate-100/50 bg-gradient-to-b from-blue-50/50 to-transparent shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          {/* Logo Box */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
            <CloudIcon />
          </div>
          
          {/* Typographic Lockup */}
          <h1 className="text-[26px] font-black tracking-tight text-slate-800 text-center leading-none mb-2">
            Climate<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">Sense</span>
          </h1>
          
          {/* Subtitle */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-[2px] bg-indigo-500/30 rounded-full"></span>
            <p className="text-[9px] text-indigo-600 tracking-[0.3em] uppercase font-black">AI Intelligence</p>
            <span className="w-4 h-[2px] bg-indigo-500/30 rounded-full"></span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_-4px_rgba(79,70,229,0.4)] hover:shadow-[0_4px_25px_-4px_rgba(79,70,229,0.5)] translate-x-1' 
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}

        {user?.isAdmin && (
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 px-4 mb-3 tracking-[0.2em] uppercase font-bold">Administration</p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_4px_20px_-4px_rgba(225,29,72,0.4)] translate-x-1' 
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:translate-x-1'
                }`
              }
            >
              <ShieldCheck size={20} />
              Admin Portal
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/50">
        {user ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <UserIcon size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user.email.split('@')[0]}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 truncate">{user.isAdmin ? 'Administrator' : 'Analyst'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 relative z-10"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <NavLink 
            to="/auth"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-[0_4px_20px_-4px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02]"
          >
            <LogIn size={18} /> Sign In
          </NavLink>
        )}

      </div>
    </aside>
  );
};

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

export default Sidebar;
