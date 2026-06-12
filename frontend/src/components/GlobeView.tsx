import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface GlobeViewProps {
  cities: any[];
  aqiData: Record<string, number>;
  selectedCityId: string | null;
  onSelectCity: (id: string) => void;
}

const GlobeView = ({ cities, aqiData, selectedCityId, onSelectCity }: GlobeViewProps) => {
  const globeEl = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', updateSize);
    // Initial size
    setTimeout(updateSize, 100);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    // Focus on India initially
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 80, altitude: 1.5 }, 2000);
    }
  }, []);

  useEffect(() => {
    if (selectedCityId && globeEl.current) {
      const city = cities.find(c => c.id === selectedCityId);
      if (city) {
        globeEl.current.pointOfView({ lat: city.position[0], lng: city.position[1], altitude: 0.8 }, 1000);
      }
    }
  }, [selectedCityId, cities]);

  const getAqiColor = (aqi: number) => {
    if (!aqi) return '#ffffff';
    if (aqi <= 50) return '#22c55e';
    if (aqi <= 100) return '#eab308';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    return '#a855f7';
  };

  const pointsData = cities.map(city => ({
    lat: city.position[0],
    lng: city.position[1],
    size: selectedCityId === city.id ? 1.5 : 0.5,
    color: getAqiColor(aqiData[city.id]),
    name: city.name,
    id: city.id
  }));

  // Create subtle glowing rings for AQI
  const ringsData = cities.map(city => ({
    lat: city.position[0],
    lng: city.position[1],
    color: getAqiColor(aqiData[city.id]),
    maxR: (aqiData[city.id] || 50) / 10,
    propagationSpeed: 1,
    repeatPeriod: 1000
  }));

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 rounded-3xl overflow-hidden relative">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={pointsData}
        pointAltitude="size"
        pointColor="color"
        pointLabel="name"
        onPointClick={(point: any) => onSelectCity(point.id)}
        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />
    </div>
  );
};

export default GlobeView;
