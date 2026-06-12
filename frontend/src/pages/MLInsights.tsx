import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Activity, Volume2, Sprout } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const cropData = [
  { crop: 'Wheat (Punjab)', projected: 92, optimal: 100, impact: -8 },
  { crop: 'Rice (W. Bengal)', projected: 105, optimal: 100, impact: +5 },
  { crop: 'Sugarcane (UP)', projected: 88, optimal: 100, impact: -12 },
  { crop: 'Cotton (Gujarat)', projected: 98, optimal: 100, impact: -2 },
];

const MLInsights = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const stories = [
    "Over the past decade, London has experienced a 1.2°C increase in average summer temperatures. This warming trend correlates with a 15% reduction in spring rainfall, leading to drier soil conditions and an elevated risk of heatwaves.",
    "The data suggests a shift in New York's microclimate. Increased urban density has amplified the heat island effect, causing nighttime temperatures to remain 2°C higher than historical baselines.",
    "Tokyo's monsoon intensity has increased by 12% compared to the 5-year average. Our anomaly detection models suggest this is linked to changing ocean currents in the Pacific."
  ];

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const playStoryAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text to speech!");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(stories[activeStory]);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US'; // Force English pronunciation
    
    const voices = window.speechSynthesis.getVoices();
    // Prioritize English voices
    const preferredVoice = voices.find(voice => 
      (voice.lang.includes('en-') || voice.lang.includes('en_')) && 
      (voice.name.includes('Female') || voice.name.includes('Google') || voice.name.includes('Natural'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Machine Learning Insights Engine 🤖</h2>
        <p className="text-gray-700 mt-1 font-medium">Explainable AI, Model Comparisons, and Premium Climate Intelligence.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Values / Explainable AI */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-purple-400" />
            <h3 className="font-bold text-xl">Explainable AI (SHAP)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Feature importance breakdown for tomorrow's 28°C temperature prediction in Tokyo.</p>
          
          <div className="space-y-5">
            {[
              { name: 'Day of Year (Seasonality)', value: 85, color: 'bg-purple-500' },
              { name: 'Humidity', value: -40, color: 'bg-blue-500' },
              { name: 'Wind Speed', value: -20, color: 'bg-cyan-500' },
              { name: 'Pressure', value: 10, color: 'bg-gray-500' }
            ].map((feature, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{feature.name}</span>
                  <span className={feature.value > 0 ? "text-green-400" : "text-red-400"}>
                    {feature.value > 0 ? '+' : ''}{feature.value}% Impact
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 flex justify-center">
                  <div className={`h-full rounded-full ${feature.color}`} style={{ width: `${Math.abs(feature.value)}%`, alignSelf: feature.value > 0 ? 'flex-end' : 'flex-start', marginLeft: feature.value > 0 ? '50%' : '0', marginRight: feature.value < 0 ? '50%' : '0' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy Comparison */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-blue-400" />
            <h3 className="font-bold text-xl">Model Performance (RMSE) 📊</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Lower RMSE indicates higher prediction accuracy.</p>
          
          <div className="space-y-4">
            <div className="p-4 border border-blue-500/30 bg-blue-500/10 rounded-xl relative overflow-hidden">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
                <Cpu size={48} />
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg text-gray-900">XGBoost Regressor</span>
                <span className="font-bold text-green-600 text-xl">0.82</span>
              </div>
              <span className="text-xs text-blue-700 font-medium px-2 py-1 bg-blue-500/20 rounded-md">Primary Active Model</span>
            </div>
            
            <div className="p-4 border border-border rounded-xl flex justify-between items-center">
              <span className="font-medium text-gray-700">Random Forest</span>
              <span className="font-bold text-gray-900">1.15</span>
            </div>

            <div className="p-4 border border-border rounded-xl flex justify-between items-center">
              <span className="font-medium text-gray-700">Facebook Prophet</span>
              <span className="font-bold text-gray-900">1.43</span>
            </div>
          </div>
        </div>

        {/* AI Climate Story Generator */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Activity size={100} className="text-indigo-900" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Activity className="text-indigo-600" />
              <h3 className="font-bold text-xl text-gray-900">AI Climate Story Generator 🎙️</h3>
            </div>
            <p className="text-indigo-900 leading-relaxed relative z-10 min-h-[100px] italic">
              "{stories[activeStory]}"
            </p>
          </div>
          
          <div className="flex gap-3 mt-6 relative z-10">
            <button 
              onClick={() => {
                setActiveStory((s) => (s + 1) % stories.length);
                setIsSpeaking(false);
                window.speechSynthesis.cancel();
              }}
              className="flex-1 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 rounded-lg text-sm font-medium transition-colors"
            >
              Generate New Story 🔄
            </button>
            <button 
              onClick={playStoryAudio}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                isSpeaking 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
              }`}
            >
              <Volume2 size={16} />
              {isSpeaking ? 'Stop Reading' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Renewable Energy Intelligence */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-yellow-400" />
              <h3 className="font-bold text-xl">Smart City Energy Intelligence ⚡</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Predicting renewable energy potential based on 7-day meteorological forecast.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                <span className="block text-yellow-600 text-sm font-bold mb-1">Solar Potential ☀️</span>
                <span className="text-2xl font-bold text-gray-900">5.2</span>
                <span className="text-xs text-gray-600 block mt-1">kWh/m²/day</span>
              </div>
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center">
                <span className="block text-cyan-600 text-sm font-bold mb-1">Wind Potential 🌬️</span>
                <span className="text-2xl font-bold text-gray-900">6.8</span>
                <span className="text-xs text-gray-600 block mt-1">m/s avg</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-black/5 rounded-lg border border-black/10 text-sm text-center">
            <span className="text-green-600 font-bold">Recommendation: </span>
            <span className="text-gray-800">Optimal conditions for solar installation planning this week.</span>
          </div>
        </div>

        {/* Crop Yield Analyzer */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Sprout className="text-emerald-500" size={28} />
            <h3 className="font-bold text-xl">Crop Yield Impact Analyzer 🌱</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">AI projections of expected agricultural yield vs optimal baseline based on current rainfall anomalies and extreme heat indices.</p>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 120]} stroke="#6b7280" />
                <YAxis dataKey="crop" type="category" stroke="#374151" fontWeight="bold" width={120} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="optimal" name="Optimal Yield (%)" fill="#d1d5db" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="projected" name="Projected Yield (%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MLInsights;
