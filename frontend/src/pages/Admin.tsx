import { motion } from 'framer-motion';
import { Users, ShieldCheck, Database, Activity, Server, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/auth" />;
  }

  const mockUsers = [
    { id: 1, email: 'admin@climatesense.ai', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
    { id: 2, email: 'meteorologist_john@noaa.gov', role: 'Analyst', status: 'Active', lastLogin: '2 hours ago' },
    { id: 3, email: 'city_planner@mumbai.gov', role: 'Viewer', status: 'Inactive', lastLogin: '4 days ago' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        {/* Animated background flares */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/10 to-pink-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 border border-red-400/50">
            <ShieldCheck size={40} className="text-white drop-shadow-md" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-black text-red-600 uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Restricted Access
              </span>
            </div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 tracking-tight drop-shadow-sm mb-2">
              System Administration
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Manage users, view system health, and configure AI models.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">1,248</h3>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">API Requests (24h)</p>
            <h3 className="text-2xl font-bold text-gray-900">45.2K</h3>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Model Status</p>
            <h3 className="text-2xl font-bold text-gray-900">XGBoost Active</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold text-gray-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-muted-foreground text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Last Login</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/10 text-xs rounded-full">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-bold ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-bold text-red-400">High API Latency</p>
                  <p className="text-xs text-muted-foreground mt-1">NOAA weather data sync is experiencing 2s delays.</p>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                <Database className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-bold text-yellow-400">Database Storage</p>
                  <p className="text-xs text-muted-foreground mt-1">PostgreSQL volume is at 85% capacity. Consider archiving old telemetry.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
