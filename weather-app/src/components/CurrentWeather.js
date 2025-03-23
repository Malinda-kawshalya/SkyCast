import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { 
  formatDate, 
  formatTime, 
  getWeatherBackground, 
  getWeatherIcon,
  convertTemp 
} from '../utils/Helpers';

const CurrentWeather = ({ data, units }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!data) return null;

  const {
    name,
    main,
    weather,
    sys,
    dt,
    wind
  } = data;

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';
  
  // Get background styles based on weather condition
  const backgroundStyle = getWeatherBackground(weather[0]);
  
  // Get enhanced weather icon
  const { icon, style: iconStyle } = getWeatherIcon(weather[0]);

  // Convert temperatures based on units
  const temp = Math.round(convertTemp(main.temp, 'metric', units));
  const feelsLike = Math.round(convertTemp(main.feels_like, 'metric', units));
  const tempMin = Math.round(convertTemp(main.temp_min, 'metric', units));
  const tempMax = Math.round(convertTemp(main.temp_max, 'metric', units));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="current-weather" 
      style={{
        borderRadius: '20px',
        padding: '30px',
        margin: '20px auto',
        maxWidth: '650px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 0 50px rgba(255, 255, 255, 0.07) inset',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        backdropFilter: 'blur(10px)',
        ...backgroundStyle
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 0
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          textAlign: 'center',
          marginBottom: '25px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          letterSpacing: '-0.5px', 
          marginBottom: '6px' 
        }}>
          {name}, {sys.country}
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          opacity: 0.85, 
          fontWeight: '500' 
        }}>
          {formatDate(dt)} | {formatTime(dt)}
        </p>
      </motion.div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        zIndex: 1,
        position: 'relative',
        flexWrap: 'wrap'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            flex: '1',
            minWidth: '200px'
          }}
        >
          <h1 style={{ 
            fontSize: '4.5rem', 
            margin: '0', 
            fontWeight: '800',
            letterSpacing: '-2px',
            lineHeight: '1'
          }}>
            {temp}{tempUnit}
          </h1>
          <p style={{ 
            marginTop: '5px', 
            fontSize: '1.1rem', 
            opacity: 0.9,
            fontWeight: '500'
          }}>
            Feels like: {feelsLike}{tempUnit}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '200px'
          }}
        >
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.6, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            style={{ 
              ...iconStyle, 
              fontSize: '90px',
              marginBottom: '15px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
            }}
          >
            {icon}
          </motion.span>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            style={{ 
              textTransform: 'capitalize', 
              fontSize: '1.3em',
              fontWeight: '600',
              marginTop: '0'
            }}
          >
            {weather[0].description}
          </motion.p>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {[
          { label: 'Humidity', value: `${main.humidity}%` },
          { label: 'Wind', value: `${Math.round(wind.speed)} ${speedUnit}` },
          { label: 'Pressure', value: `${main.pressure} hPa` },
          { label: 'Min/Max', value: `${tempMin}/${tempMax}${tempUnit}` }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.9 + (index * 0.1), 
              duration: 0.4 
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              background: 'rgba(255, 255, 255, 0.12)'
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              padding: '16px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ 
              fontSize: '0.85rem', 
              marginBottom: '8px',
              fontWeight: '500',
              opacity: 0.85
            }}>{item.label}</span>
            <span style={{ 
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>{item.value}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        style={{
          marginTop: '25px',
          textAlign: 'center',
          fontSize: '0.95em',
          opacity: 0.8,
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span role="img" aria-label="sunrise" style={{ fontSize: '1.2em' }}>🌅</span>
          <p style={{ margin: '0' }}>Sunrise: {formatTime(sys.sunrise)}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span role="img" aria-label="sunset" style={{ fontSize: '1.2em' }}>🌇</span>
          <p style={{ margin: '0' }}>Sunset: {formatTime(sys.sunset)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CurrentWeather;