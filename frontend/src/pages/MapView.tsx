import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { Calendar, Droplets, Wind, Thermometer, MapPin, X, Loader2, Globe, Map } from 'lucide-react';
import { fetchAllCitiesAQI } from '../utils/weatherApi';
import GlobeView from '../components/GlobeView';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red icon for selected state
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon.Default();

// Mock data generation for 5-day forecast
const generateForecast = (baseTemp: number, condition: string) => {
  const days = ['Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
  const conditions = [
    { text: 'Sunny', emoji: '☀️' },
    { text: 'Cloudy', emoji: '☁️' },
    { text: 'Rain', emoji: '🌧️' },
    { text: 'Thunderstorms', emoji: '⛈️' }
  ];
  
  return days.map((day, i) => {
    const tempOffset = Math.floor(Math.random() * 5) - 2; // -2 to +2
    // If it's monsoon in Mumbai, make it rainy mostly
    const condIndex = condition === 'Thunderstorms' ? (Math.random() > 0.5 ? 2 : 3) : Math.floor(Math.random() * 2); 
    
    return {
      day,
      temp: `${(baseTemp + tempOffset).toFixed(1)}°C`,
      condition: conditions[condIndex].text,
      emoji: conditions[condIndex].emoji
    };
  });
};

const cities = [
  { id: 'delhi', name: 'New Delhi', position: [28.6139, 77.2090], temp: 38.2, humidity: '35%', wind: '8 km/h', condition: 'Heatwave', emoji: '🔥' },
  { id: 'mumbai', name: 'Mumbai', position: [19.0760, 72.8777], temp: 32.4, humidity: '88%', wind: '14 km/h', condition: 'Thunderstorms', emoji: '⛈️' },
  { id: 'bangalore', name: 'Bangalore', position: [12.9716, 77.5946], temp: 25.6, humidity: '65%', wind: '12 km/h', condition: 'Pleasant', emoji: '⛅' },
  { id: 'chennai', name: 'Chennai', position: [13.0827, 80.2707], temp: 34.5, humidity: '78%', wind: '16 km/h', condition: 'Humid', emoji: '🌤️' },
  { id: 'kolkata', name: 'Kolkata', position: [22.5726, 88.3639], temp: 35.1, humidity: '82%', wind: '10 km/h', condition: 'Cloudy', emoji: '☁️' },
  { id: 'hyderabad', name: 'Hyderabad', position: [17.3850, 78.4867], temp: 31.0, humidity: '55%', wind: '15 km/h', condition: 'Sunny', emoji: '☀️' },
  { id: 'ahmedabad', name: 'Ahmedabad', position: [23.0225, 72.5714], temp: 39.5, humidity: '28%', wind: '9 km/h', condition: 'Sunny', emoji: '☀️' },
  { id: 'pune', name: 'Pune', position: [18.5204, 73.8567], temp: 29.2, humidity: '60%', wind: '11 km/h', condition: 'Partly Cloudy', emoji: '⛅' },
  { id: 'jaipur', name: 'Jaipur', position: [26.9124, 75.7873], temp: 40.1, humidity: '20%', wind: '18 km/h', condition: 'Dusty', emoji: '💨' }
].map(city => ({
  ...city,
  forecast: generateForecast(city.temp, city.condition)
}));

const MapView = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [aqiData, setAqiData] = useState<Record<string, number>>({});
  const [loadingAqi, setLoadingAqi] = useState(true);
  const [is3DMode, setIs3DMode] = useState(false);
  const selectedCity = cities.find(c => c.id === selectedCityId);

  useEffect(() => {
    const loadAQI = async () => {
      const data = await fetchAllCitiesAQI();
      if (data) {
        // Map data keys back to city ids. weatherApi uses capitalized names, MapView uses lowercase IDs.
        const mappedData: Record<string, number> = {};
        Object.keys(data).forEach(key => {
          mappedData[key.toLowerCase()] = data[key];
        });
        setAqiData(mappedData);
      }
      setLoadingAqi(false);
    };
    loadAQI();
  }, []);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // Green
    if (aqi <= 100) return '#eab308'; // Yellow
    if (aqi <= 150) return '#f97316'; // Orange
    if (aqi <= 200) return '#ef4444'; // Red
    return '#a855f7'; // Purple
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10 h-full flex flex-col"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
            Indian Climate Intelligence Map 🇮🇳
            {loadingAqi && <Loader2 className="animate-spin text-blue-500" size={24} />}
          </h2>
          <p className="text-gray-700 mt-1 font-medium">Select any region on the map to view real-time conditions and AI-powered 5-day forecasts. Colored radii indicate real-time Air Quality Index (AQI).</p>
        </div>
        <button 
          onClick={() => setIs3DMode(!is3DMode)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all shrink-0"
        >
          {is3DMode ? <><Map size={18} /> Switch to 2D Map</> : <><Globe size={18} /> Switch to 3D Globe</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Interactive Map Section */}
        <div className={`h-full transition-all duration-500 ease-in-out ${selectedCity ? 'lg:w-2/3' : 'w-full'} rounded-3xl overflow-hidden border border-border shadow-2xl relative z-0`}>
          {is3DMode ? (
            <GlobeView 
              cities={cities} 
              aqiData={aqiData} 
              selectedCityId={selectedCityId}
              onSelectCity={setSelectedCityId}
            />
          ) : (
            <MapContainer 
              center={[22.5937, 78.9629]} // Center of India
              zoom={5} 
              className="h-full w-full bg-blue-50"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {cities.map((city) => (
                <div key={`container-${city.id}`}>
                  {aqiData[city.id] && (
                    <Circle 
                      center={city.position as [number, number]}
                      radius={50000} // 50km radius
                      pathOptions={{ 
                        color: getAqiColor(aqiData[city.id]),
                        fillColor: getAqiColor(aqiData[city.id]),
                        fillOpacity: 0.3,
                        weight: 0
                      }}
                    />
                  )}
                  <Marker 
                    position={city.position as [number, number]}
                    icon={selectedCityId === city.id ? selectedIcon : defaultIcon}
                    eventHandlers={{
                      click: () => setSelectedCityId(city.id),
                    }}
                  />
                </div>
              ))}
            </MapContainer>
          )}

          {/* Map Overlay Instructions */}
          {!selectedCity && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg pointer-events-none z-[1000] flex items-center gap-2 text-white animate-pulse">
              <MapPin size={18} className="text-orange-400" />
              <span>Tap on any city marker to analyze weather patterns.</span>
            </div>
          )}
        </div>

        {/* Side Panel: Forecast & Today's Weather */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div 
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="lg:w-1/3 flex flex-col gap-4 overflow-hidden"
            >
              {/* Today's Weather Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden shrink-0">
                <button 
                  onClick={() => setSelectedCityId(null)}
                  className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedCity.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCity.name}</h3>
                    <p className="text-sm text-gray-700">Current Conditions</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-6xl font-black text-gray-900 drop-shadow-sm">
                    {selectedCity.temp}°
                  </span>
                  <span className="text-xl text-gray-600 ml-2 font-medium">{selectedCity.condition}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                    <Droplets className="text-blue-400" size={20} />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="font-bold text-sm">{selectedCity.humidity}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-2xl flex items-center gap-3">
                    <Wind className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="font-bold text-sm">{selectedCity.wind}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="text-orange-500" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">5-Day AI Forecast</h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {selectedCity.forecast.map((dayData, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-4 bg-gray-500/5 hover:bg-gray-500/10 transition-colors border border-border rounded-2xl"
                    >
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-2xl">{dayData.emoji}</span>
                        <span className="font-medium text-sm text-gray-700">{dayData.day}</span>
                      </div>
                      
                      <div className="flex-1 text-center px-2">
                        <span className="text-sm font-bold text-gray-900">{dayData.temp}</span>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">{dayData.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MapView;
