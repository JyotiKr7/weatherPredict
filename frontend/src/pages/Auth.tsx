import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate real auth for demonstration
    const isAdmin = email.includes('admin');
    login(email || 'demo@climatesense.ai', isAdmin);
    navigate(isAdmin ? '/admin' : '/');
  };

  const handleDemoAdmin = () => {
    login('admin@climatesense.ai', true);
    navigate('/admin');
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
                ClimateSense AI
              </h2>
              <p className="text-muted-foreground">Authenticate to access intelligent analytics.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 mt-4"
              >
                {isLogin ? 'Secure Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-500/5 p-6 border-t border-border">
            <button 
              onClick={handleDemoAdmin}
              className="w-full py-3 bg-gray-900/5 hover:bg-gray-900/10 border border-gray-900/10 text-gray-900 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert size={18} className="text-orange-400" />
              Demo: Instant Admin Access
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
