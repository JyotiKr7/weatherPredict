import React from 'react';
import { motion } from 'framer-motion';

interface WeatherOverlayProps {
  condition: string;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ condition }) => {
  const isRain = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower') || condition.toLowerCase().includes('thunderstorm') || condition.toLowerCase().includes('drizzle');
  const isSnow = condition.toLowerCase().includes('snow');
  const isCloudy = condition.toLowerCase().includes('cloud') || condition.toLowerCase().includes('fog') || condition.toLowerCase().includes('overcast');
  const isSunny = condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sun');

  if (isRain) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-60">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-300 w-[2px] h-10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 1,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
      </div>
    );
  }

  if (isSnow) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-80">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: ['0vw', `${Math.random() * 10 - 5}vw`],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (isCloudy) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-40">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/40 blur-3xl rounded-full"
            style={{
              width: '60%',
              height: '40%',
              top: `${Math.random() * 30}%`,
              left: '-50%',
            }}
            animate={{
              x: ['0vw', '150vw'],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * -20, // Start midway
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gray-500/20 mix-blend-multiply" />
      </div>
    );
  }

  if (isSunny) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-30 mix-blend-overlay">
        <motion.div
          className="absolute bg-orange-300 blur-[100px] rounded-full w-full h-full"
          style={{ top: '-50%', right: '-50%' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return null;
};

export default WeatherOverlay;
