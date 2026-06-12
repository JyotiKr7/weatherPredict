import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Radio, Activity, Send, CheckCircle2 } from 'lucide-react';

const Disasters = () => {
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const [broadcasted, setBroadcasted] = useState<Record<number, boolean>>({});

  const simulatedThreats = [
    {
      id: 1,
      type: "Severe Cyclonic Storm",
      region: "Bay of Bengal (Target: Kolkata & Odisha Coast)",
      severity: "CRITICAL",
      eta: "48 Hours",
      details: "Wind speeds projected at 140 km/h. High tidal waves expected.",
      color: "red",
      radarImage: "radial-gradient(circle at 70% 30%, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0.4) 30%, transparent 70%)"
    },
    {
      id: 2,
      type: "Extreme Heatwave",
      region: "Northern Plains (Delhi, Punjab, Haryana)",
      severity: "SEVERE",
      eta: "Ongoing",
      details: "Temperatures exceeding 46°C. Severe health risks for outdoor workers.",
      color: "orange",
      radarImage: "radial-gradient(circle at 30% 20%, rgba(249,115,22,0.8) 0%, rgba(249,115,22,0.4) 40%, transparent 80%)"
    },
    {
      id: 3,
      type: "Flash Flood Warning",
      region: "Assam & Meghalaya",
      severity: "HIGH",
      eta: "24 Hours",
      details: "Intense monsoonal downpour. River Brahmaputra flowing above danger mark.",
      color: "blue",
      radarImage: "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.4) 30%, transparent 70%)"
    }
  ];

  const handleBroadcast = (id: number) => {
    setActiveAlert(id);
    setTimeout(() => {
      setBroadcasted(prev => ({ ...prev, [id]: true }));
      setActiveAlert(null);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={32} />
          Disaster Prediction & Early Warning
        </h2>
        <p className="text-gray-700 mt-1 font-medium">AI-simulated radar intelligence and automated emergency broadcast systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {simulatedThreats.map((threat) => (
            <div key={threat.id} className="p-6 rounded-2xl bg-card border border-border shadow-md relative overflow-hidden group">
              {/* Radar Simulation Background */}
              <div 
                className="absolute right-0 top-0 w-64 h-64 opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
                style={{ background: threat.radarImage }}
              />
              <div className="absolute right-10 top-10 w-48 h-48 border border-white/20 rounded-full animate-ping opacity-10 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${threat.color}-500/20 text-${threat.color}-600 uppercase tracking-wider`}>
                      {threat.severity}
                    </span>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900">{threat.type}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-bold uppercase">ETA</p>
                    <p className="text-lg font-black text-gray-900">{threat.eta}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-lg font-bold text-gray-800">{threat.region}</p>
                  <p className="text-gray-600 mt-1">{threat.details}</p>
                </div>

                <div className="flex justify-end border-t border-border pt-4">
                  <button 
                    onClick={() => handleBroadcast(threat.id)}
                    disabled={broadcasted[threat.id] || activeAlert === threat.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                      broadcasted[threat.id] 
                        ? 'bg-green-600 text-white' 
                        : activeAlert === threat.id
                        ? 'bg-red-500/20 text-red-600 animate-pulse'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {broadcasted[threat.id] ? (
                      <><CheckCircle2 size={20} /> SMS Broadcast Sent</>
                    ) : activeAlert === threat.id ? (
                      <><Radio size={20} className="animate-spin" /> Broadcasting to region...</>
                    ) : (
                      <><Send size={20} /> Send Emergency SMS Broadcast</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-green-400" />
                <h3 className="text-xl font-bold">System Status</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Satellite Uplink</span>
                    <span className="text-green-400 font-bold">Stable</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-green-400 h-1.5 rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Radar Arrays Active</span>
                    <span className="text-green-400 font-bold">24 / 24</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-green-400 h-1.5 rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Telecom Gateway API</span>
                    <span className="text-green-400 font-bold">Connected</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-green-400 h-1.5 rounded-full w-full"></div></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
            <h4 className="font-bold text-orange-800 mb-2">Protocol Guidelines</h4>
            <p className="text-sm text-orange-900 leading-relaxed">
              Before issuing an Emergency SMS Broadcast, ensure visual confirmation from dual radar arrays. False alarms can induce panic. The AI probability score must exceed 85%.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Disasters;
