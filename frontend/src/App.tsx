import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import MapView from './pages/MapView';
import MLInsights from './pages/MLInsights';
import Disasters from './pages/Disasters';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Sidebar from './components/Sidebar';
import ChatAssistant from './components/ChatAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import { Code2, BadgeCheck, Sparkles, Heart, Globe } from 'lucide-react';

// Simple protected route component
const ProtectedRoute = ({ children, requireAdmin = false }: any) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppContent = () => {
  const [copied, setCopied] = useState(false);

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('jyotiprakashdps2526@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="flex h-screen text-foreground bg-cover bg-center transition-colors duration-500" 
      style={{ backgroundImage: 'url(/sky.png)' }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-0"></div>
      <div className="flex flex-col w-full h-full relative z-10">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/ml-insights" element={<MLInsights />} />
              <Route path="/disasters" element={<Disasters />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>

        {/* Full-Width Premium Footer */}
        <footer className="w-full shrink-0 relative bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Animated Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse" />
          
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Globe size={16} className="text-white" />
              </div>
              <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                ClimateSense AI
              </span>
              <span className="text-gray-300 font-light text-xl px-1">|</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-md">
                <span className="text-xs font-mono font-bold text-slate-300">v2.4.0</span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600 uppercase tracking-widest drop-shadow-sm">
                  Premium Enterprise
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                <Sparkles size={14} className="text-orange-500" />
                <p className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">Master Architect</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Built with <Heart size={14} className="inline text-red-500 mx-0.5 animate-pulse" /> by</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100">
                  <div className="relative">
                    <Code2 size={16} className="text-purple-600" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                      <BadgeCheck size={12} className="text-blue-500 fill-blue-100" />
                    </div>
                  </div>
                  <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500">
                    Jyoti Kumar
                  </span>
                </div>
              </div>

              <button 
                onClick={handleContact}
                className={`text-xs py-1.5 px-4 font-bold rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg ${
                  copied 
                    ? 'bg-green-500 hover:bg-green-600 text-white scale-105' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {copied ? 'Email Copied! ✓' : 'Contact Developer'}
              </button>
            </div>
          </div>
        </footer>

        <ChatAssistant />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
