export const cityCoordinates: Record<string, { lat: number, lon: number }> = {
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Delhi": { lat: 28.6139, lon: 77.2090 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 },
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Surat": { lat: 21.1702, lon: 72.8311 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 },
  "Kanpur": { lat: 26.4499, lon: 80.3319 },
  "Nagpur": { lat: 21.1458, lon: 79.0882 },
  "Indore": { lat: 22.7196, lon: 75.8577 },
  "Patna": { lat: 25.5941, lon: 85.1376 }
};

export const getWeatherCondition = (code: number) => {
  if (code === 0) return { condition: 'Clear Sky', emoji: '☀️' };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', emoji: '⛅' };
  if (code === 45 || code === 48) return { condition: 'Foggy', emoji: '🌫️' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', emoji: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', emoji: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Showers', emoji: '🌦️' };
  if (code >= 95) return { condition: 'Thunderstorm', emoji: '⛈️' };
  return { condition: 'Unknown', emoji: '❓' };
};

export const fetchLiveWeather = async (cityName: string) => {
  const coords = cityCoordinates[cityName];
  if (!coords) return null;
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m&timezone=auto&daily=uv_index_max`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    const { condition, emoji } = getWeatherCondition(data.current.weather_code);
    
    // Build 24h chart from hourly data (take next 6 points spaced 4 hours apart)
    const currentHourIndex = new Date().getHours();
    const chartData = [];
    for (let i = 0; i < 6; i++) {
      const idx = currentHourIndex + (i * 4);
      if (idx < data.hourly.time.length) {
        const timeStr = new Date(data.hourly.time[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chartData.push({
          time: timeStr,
          temp: data.hourly.temperature_2m[idx]
        });
      }
    }

    let uvIndex = "Moderate (5)";
    if (data.daily && data.daily.uv_index_max && data.daily.uv_index_max.length > 0) {
      const uv = data.daily.uv_index_max[0];
      if (uv > 10) uvIndex = `Extreme (${uv.toFixed(1)})`;
      else if (uv > 7) uvIndex = `High (${uv.toFixed(1)})`;
      else uvIndex = `Moderate (${uv.toFixed(1)})`;
    }

    return {
      temp: `${data.current.temperature_2m}°C`,
      tempNum: data.current.temperature_2m,
      humidity: `${data.current.relative_humidity_2m}%`,
      wind: `${data.current.wind_speed_10m} km/h`,
      uv: uvIndex,
      emoji: emoji,
      condition: condition,
      chart: chartData,
      alert: { type: 'info', title: 'Live Update', text: `Real-time satellite data for ${cityName}.` }
    };
  } catch (err) {
    console.error("Error fetching live weather", err);
    return null;
  }
};

export const fetchAllCitiesAQI = async () => {
  const cityKeys = Object.keys(cityCoordinates);
  const lats = cityKeys.map(c => cityCoordinates[c].lat).join(',');
  const lons = cityKeys.map(c => cityCoordinates[c].lon).join(',');
  
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const aqiMap: Record<string, number> = {};
    
    // Open-meteo returns an array of responses when multiple coordinates are passed
    if (Array.isArray(data)) {
      data.forEach((d: any, i: number) => {
        aqiMap[cityKeys[i]] = d.current.us_aqi;
      });
    } else {
      aqiMap[cityKeys[0]] = data.current.us_aqi;
    }
    
    return aqiMap;
  } catch (err) {
    console.error("Error fetching AQI", err);
    return null;
  }
};
