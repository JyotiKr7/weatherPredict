import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CloudRain, Wind, Thermometer, Sun, Volume2, Cloud, Snowflake, Loader2 } from 'lucide-react';
import { fetchLiveWeather } from '../utils/weatherApi';
import WeatherOverlay from '../components/WeatherOverlay';

const cityData: Record<string, any> = {
  "Mumbai": { temp: "32.4°C", tempNum: 32.4, humidity: "88%", wind: "14 km/h", uv: "Extreme (11)", emoji: "⛈️", condition: "Thunderstorms", color: "yellow", image: "/mumbai.png", alert: { type: 'rain', title: 'Monsoon Alert', text: 'Heavy showers expected.' }, chart: [{ time: '00:00', temp: 29 }, { time: '04:00', temp: 28 }, { time: '08:00', temp: 30 }, { time: '12:00', temp: 33 }, { time: '16:00', temp: 32 }, { time: '20:00', temp: 30 }] },
  "Delhi": { temp: "38.2°C", tempNum: 38.2, humidity: "35%", wind: "8 km/h", uv: "Extreme (12)", emoji: "🔥", condition: "Heatwave", color: "orange", image: "/delhi.png", alert: { type: 'heat', title: 'Heatwave Alert', text: 'Avoid outdoor activities.' }, chart: [{ time: '00:00', temp: 31 }, { time: '04:00', temp: 29 }, { time: '08:00', temp: 34 }, { time: '12:00', temp: 38 }, { time: '16:00', temp: 37 }, { time: '20:00', temp: 33 }] },
  "Bangalore": { temp: "25.6°C", tempNum: 25.6, humidity: "65%", wind: "12 km/h", uv: "Moderate (5)", emoji: "⛅", condition: "Pleasant", color: "blue", image: "/bangalore.png", alert: { type: 'wind', title: 'Pleasant Evening', text: 'Perfect for an evening walk.' }, chart: [{ time: '00:00', temp: 22 }, { time: '04:00', temp: 21 }, { time: '08:00', temp: 24 }, { time: '12:00', temp: 26 }, { time: '16:00', temp: 24 }, { time: '20:00', temp: 23 }] },
  "Chennai": { temp: "34.5°C", tempNum: 34.5, humidity: "78%", wind: "16 km/h", uv: "High (9)", emoji: "🌤️", condition: "Humid", color: "orange", image: "/chennai.png", alert: { type: 'heat', title: 'High Humidity', text: 'Heat index is very high.' }, chart: [{ time: '00:00', temp: 30 }, { time: '04:00', temp: 29 }, { time: '08:00', temp: 32 }, { time: '12:00', temp: 35 }, { time: '16:00', temp: 33 }, { time: '20:00', temp: 31 }] },
  "Kolkata": { temp: "31.2°C", tempNum: 31.2, humidity: "82%", wind: "10 km/h", uv: "High (8)", emoji: "🌧️", condition: "Rainy", color: "blue", image: "/kolkata.png", alert: { type: 'rain', title: 'Scattered Showers', text: 'Carry an umbrella today.' }, chart: [{ time: '00:00', temp: 27 }, { time: '04:00', temp: 26 }, { time: '08:00', temp: 28 }, { time: '12:00', temp: 31 }, { time: '16:00', temp: 30 }, { time: '20:00', temp: 28 }] },
  "Hyderabad": { temp: "33.0°C", tempNum: 33.0, humidity: "50%", wind: "11 km/h", uv: "High (8)", emoji: "☀️", condition: "Clear", color: "orange", image: "/hyderabad.png", alert: { type: 'heat', title: 'Sunny Day', text: 'Stay hydrated.' }, chart: [{ time: '00:00', temp: 26 }, { time: '04:00', temp: 25 }, { time: '08:00', temp: 29 }, { time: '12:00', temp: 33 }, { time: '16:00', temp: 32 }, { time: '20:00', temp: 28 }] },
  "Ahmedabad": { temp: "36.5°C", tempNum: 36.5, humidity: "40%", wind: "9 km/h", uv: "Extreme (10)", emoji: "🥵", condition: "Hot", color: "orange", image: "/ahmedabad.png", alert: { type: 'heat', title: 'Heat Warning', text: 'Avoid direct sunlight.' }, chart: [{ time: '00:00', temp: 29 }, { time: '04:00', temp: 28 }, { time: '08:00', temp: 32 }, { time: '12:00', temp: 36 }, { time: '16:00', temp: 35 }, { time: '20:00', temp: 31 }] },
  "Pune": { temp: "28.4°C", tempNum: 28.4, humidity: "60%", wind: "15 km/h", uv: "Moderate (6)", emoji: "🌥️", condition: "Partly Cloudy", color: "gray", image: "/pune.png", alert: { type: 'wind', title: 'Breezy', text: 'Nice weather for a drive.' }, chart: [{ time: '00:00', temp: 23 }, { time: '04:00', temp: 22 }, { time: '08:00', temp: 25 }, { time: '12:00', temp: 28 }, { time: '16:00', temp: 27 }, { time: '20:00', temp: 24 }] },
  "Surat": { temp: "33.8°C", tempNum: 33.8, humidity: "70%", wind: "13 km/h", uv: "High (9)", emoji: "🌤️", condition: "Humid", color: "orange", image: "/surat.png", alert: { type: 'heat', title: 'Coastal Heat', text: 'High humidity expected.' }, chart: [{ time: '00:00', temp: 28 }, { time: '04:00', temp: 27 }, { time: '08:00', temp: 30 }, { time: '12:00', temp: 33 }, { time: '16:00', temp: 32 }, { time: '20:00', temp: 29 }] },
  "Jaipur": { temp: "37.1°C", tempNum: 37.1, humidity: "25%", wind: "10 km/h", uv: "Extreme (11)", emoji: "🐪", condition: "Dry & Hot", color: "orange", image: "/jaipur.png", alert: { type: 'heat', title: 'Dry Heat', text: 'Drink plenty of water.' }, chart: [{ time: '00:00', temp: 28 }, { time: '04:00', temp: 26 }, { time: '08:00', temp: 31 }, { time: '12:00', temp: 37 }, { time: '16:00', temp: 36 }, { time: '20:00', temp: 32 }] },
  "Lucknow": { temp: "35.5°C", tempNum: 35.5, humidity: "55%", wind: "8 km/h", uv: "High (9)", emoji: "☀️", condition: "Sunny", color: "orange", image: "/lucknow.png", alert: { type: 'heat', title: 'Warm Day', text: 'Typical summer day.' }, chart: [{ time: '00:00', temp: 27 }, { time: '04:00', temp: 26 }, { time: '08:00', temp: 30 }, { time: '12:00', temp: 35 }, { time: '16:00', temp: 34 }, { time: '20:00', temp: 30 }] },
  "Kanpur": { temp: "36.0°C", tempNum: 36.0, humidity: "50%", wind: "7 km/h", uv: "High (9)", emoji: "🌤️", condition: "Partly Sunny", color: "orange", image: "/kanpur.png", alert: { type: 'heat', title: 'Warm Day', text: 'Stay in the shade.' }, chart: [{ time: '00:00', temp: 28 }, { time: '04:00', temp: 27 }, { time: '08:00', temp: 31 }, { time: '12:00', temp: 36 }, { time: '16:00', temp: 35 }, { time: '20:00', temp: 31 }] },
  "Nagpur": { temp: "39.5°C", tempNum: 39.5, humidity: "30%", wind: "6 km/h", uv: "Extreme (12)", emoji: "🌋", condition: "Scorching", color: "orange", image: "/nagpur.png", alert: { type: 'heat', title: 'Extreme Heat', text: 'Do not go outside.' }, chart: [{ time: '00:00', temp: 32 }, { time: '04:00', temp: 30 }, { time: '08:00', temp: 35 }, { time: '12:00', temp: 39 }, { time: '16:00', temp: 38 }, { time: '20:00', temp: 34 }] },
  "Indore": { temp: "31.0°C", tempNum: 31.0, humidity: "45%", wind: "12 km/h", uv: "High (8)", emoji: "⛅", condition: "Pleasant", color: "blue", image: "/indore.png", alert: { type: 'wind', title: 'Clear Skies', text: 'Great weather today.' }, chart: [{ time: '00:00', temp: 24 }, { time: '04:00', temp: 23 }, { time: '08:00', temp: 27 }, { time: '12:00', temp: 31 }, { time: '16:00', temp: 30 }, { time: '20:00', temp: 26 }] },
  "Patna": { temp: "34.2°C", tempNum: 34.2, humidity: "65%", wind: "9 km/h", uv: "High (9)", emoji: "🌧️", condition: "Light Rain", color: "blue", image: "/patna.png", alert: { type: 'rain', title: 'Drizzle', text: 'Light rain expected in evening.' }, chart: [{ time: '00:00', temp: 27 }, { time: '04:00', temp: 26 }, { time: '08:00', temp: 29 }, { time: '12:00', temp: 34 }, { time: '16:00', temp: 33 }, { time: '20:00', temp: 29 }] }
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-start justify-between relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
    <div>
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveData, setLiveData] = useState(cityData["Mumbai"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLiveWeather = async () => {
      setIsLoading(true);
      const data = await fetchLiveWeather(selectedCity);
      if (data) {
        setLiveData({ ...cityData[selectedCity], ...data });
      }
      setIsLoading(false);
    };
    loadLiveWeather();
  }, [selectedCity]);

  const data = liveData;

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const playAIAssistant = () => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text to speech!");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const script = `Hello! Here is your ClimateSense AI update for ${selectedCity}. The current temperature is ${data.tempNum} degrees Celsius, and the condition is ${data.condition}. Humidity is at ${data.humidity}. Alert: ${data.alert.title}. ${data.alert.text}`;
    
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
            {selectedCity} {data.emoji}
            {isLoading && <Loader2 className="animate-spin text-blue-500" size={24} />}
          </h2>
          <p className="text-gray-700 mt-1 font-medium">Real-time telemetry and atmospheric monitoring.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select 
            className="bg-card border border-border text-gray-900 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }}
          >
            {Object.keys(cityData).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <button 
            onClick={playAIAssistant}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-lg ${
              isSpeaking 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
            }`}
          >
            <Volume2 size={18} />
            {isSpeaking ? 'Stop AI Voice' : 'AI English Briefing'}
          </button>
        </div>
      </div>

      {data.image && (
        <motion.div 
          key={data.image}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-64 rounded-3xl overflow-hidden relative border border-border shadow-2xl"
        >
          <img src={data.image} alt={selectedCity} className="w-full h-full object-cover" />
          <WeatherOverlay condition={data.condition} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 z-20">
            <h3 className="text-4xl font-bold text-white drop-shadow-lg">{selectedCity} {data.emoji}</h3>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Temperature" value={data.temp} icon={Thermometer} color="orange" />
        <StatCard title="Humidity" value={data.humidity} icon={CloudRain} color="blue" />
        <StatCard title="Wind Speed" value={data.wind} icon={Wind} color="gray" />
        <StatCard title="UV Index" value={data.uv} icon={Sun} color="yellow" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">24-Hour Temperature Forecast</h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Live</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#888" tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#888" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-4">Weather Alerts</h3>
          <div className="flex-1 space-y-4">
            <div className={`p-4 rounded-xl border relative overflow-hidden ${
              data.alert.type === 'heat' ? 'border-orange-500/30 bg-orange-500/10' :
              data.alert.type === 'rain' ? 'border-blue-500/30 bg-blue-500/10' :
              'border-blue-500/30 bg-blue-500/10'
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                data.alert.type === 'heat' ? 'bg-orange-500' :
                'bg-blue-500'
              }`} />
              <h4 className={`font-bold flex items-center gap-2 ${
                data.alert.type === 'heat' ? 'text-orange-400' :
                'text-blue-400'
              }`}>
                {data.alert.type === 'heat' ? <Sun size={16} /> :
                 data.alert.type === 'rain' ? <CloudRain size={16} /> :
                 <Wind size={16} />} 
                {data.alert.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{data.alert.text}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-bold">Eco-Score Leaderboard</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { city: "Bangalore", score: 92, status: "🏆 Greenest", color: "text-green-500" },
              { city: "Pune", score: 85, status: "Excellent", color: "text-green-400" },
              { city: "Indore", score: 81, status: "Good", color: "text-blue-500" },
              { city: "Hyderabad", score: 76, status: "Fair", color: "text-yellow-500" },
              { city: "Delhi", score: 32, status: "Critical", color: "text-red-500" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">{item.city}</p>
                  <p className={`text-xs font-bold ${item.color}`}>{item.status}</p>
                </div>
                <div className="text-xl font-black text-gray-900">
                  {item.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 drop-shadow-sm flex items-center gap-2">
          📅 7-Day Smart Forecast Calendar
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { day: 'Mon', date: '12', temp: '34°', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { day: 'Tue', date: '13', temp: '33°', icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-500/10' },
            { day: 'Wed', date: '14', temp: '29°', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { day: 'Thu', date: '15', temp: '28°', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { day: 'Fri', date: '16', temp: '30°', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { day: 'Sat', date: '17', temp: '32°', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { day: 'Sun', date: '18', temp: '31°', icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-500/10' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform cursor-pointer relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${item.bg.replace('/10', '')}`} />
              <div className="text-center">
                <p className="text-sm font-bold text-gray-500 uppercase">{item.day}</p>
                <p className="text-2xl font-black text-gray-900">{item.date}</p>
              </div>
              <div className={`p-3 rounded-full ${item.bg}`}>
                <item.icon size={24} className={item.color} />
              </div>
              <p className="font-bold text-lg text-gray-800">{item.temp}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
