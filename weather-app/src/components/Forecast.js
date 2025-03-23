import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { formatDate, getWeatherIcon } from '../utils/Helpers';

const Forecast = ({ data, units }) => {
  if (!data || data.length === 0) return null;

  const tempUnit = units === 'metric' ? '°C' : '°F';

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="forecast-container"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        margin: '20px auto',
        maxWidth: '850px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        fontFamily: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          marginBottom: '25px',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textFillColor: 'transparent'
        }}
      >
        5-Day Forecast
      </motion.h3>
      
      <motion.div 
        className="forecast-items"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          justifyContent: 'space-between',
        }}
      >
        {data.map((item, index) => {
          // Get enhanced weather icon
          const { icon, style: iconStyle } = getWeatherIcon(item.weather[0]);
          
          return (
            <motion.div 
              key={index} 
              className="forecast-item"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                background: 'rgba(255, 255, 255, 0.12)'
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                borderRadius: '14px',
                padding: '20px 15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <motion.p 
                className="forecast-date"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                  marginTop: '0',
                  opacity: 0.9,
                }}
              >
                {formatDate(item.dt)}
              </motion.p>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.1 + (index * 0.05), 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                style={{
                  marginBottom: '10px',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
              >
                <span style={{ 
                  ...iconStyle, 
                  fontSize: '50px'
                }}>
                  {icon}
                </span>
              </motion.div>
              
              <motion.p 
                className="forecast-temp"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  margin: '5px 0',
                  letterSpacing: '-0.5px',
                }}
              >
                {Math.round(item.main.temp)}{tempUnit}
              </motion.p>
              
              <motion.p 
                className="forecast-desc"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  margin: '5px 0 0 0',
                  opacity: 0.8,
                  textTransform: 'capitalize',
                }}
              >
                {item.weather[0].description}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Forecast;