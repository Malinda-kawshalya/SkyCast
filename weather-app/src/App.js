import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LocationSearch from './components/LocationSearch';
import LoadingSpinner from './components/LoadingSpinner';
import TemperatureToggle from './components/TemperatureToggle';
import useWeather from './hooks/useWeather';
import { getWeatherBackground } from './utils/Helpers';
import { motion } from 'framer-motion';

function App() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    units,
    lastCity,
    getWeatherByCity,
    getUserLocation,
    toggleUnits
  } = useWeather();

  const canvasRef = useRef(null);
  const [weatherSoundEnabled, setWeatherSoundEnabled] = useState(false);

  // Dynamic background based on weather with enhanced gradients
  const backgroundStyle = {
    background: currentWeather 
      ? getWeatherBackground(currentWeather.weather[0])
      : 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    minHeight: '100vh',
    transition: 'background 1.5s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  // Animation for particles based on weather conditions
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    
    // Determine particle type based on weather
    const particleType = currentWeather 
      ? currentWeather.weather[0].main.toLowerCase()
      : 'default';
    
    // Determine particle count based on weather
    let particleCount = 50;
    if (particleType.includes('rain')) {
      particleCount = 200; // More particles for rain
    } else if (particleType.includes('snow')) {
      particleCount = 150; // More particles for snow
    } else if (particleType.includes('thunderstorm')) {
      particleCount = 250; // Even more for thunderstorms
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
        opacity: Math.random() * 0.5 + 0.3,
        // Add properties for lightning effect
        flash: false,
        flashDuration: 0
      });
    }
    
    // Variables for lightning effect
    let lightningTimer = 0;
    const lightningFrequency = Math.random() * 300 + 100;
    let lightning = false;
    let lightningOpacity = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Handle thunderstorm lightning effect
      if (particleType.includes('thunderstorm')) {
        lightningTimer++;
        
        if (lightningTimer > lightningFrequency && !lightning) {
          lightning = true;
          lightningOpacity = 0.8;
          lightningTimer = 0;
        }
        
        if (lightning) {
          // Create lightning flash overlay
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacity})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Fade out lightning
          lightningOpacity -= 0.05;
          if (lightningOpacity <= 0) {
            lightning = false;
            lightningTimer = 0;
          }
        }
      }
      
      particles.forEach(particle => {
        // Draw different particles based on weather
        if (particleType.includes('rain')) {
          // Create more realistic rain drops
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x, particle.y + particle.size * 3);
          ctx.strokeStyle = `rgba(176, 224, 230, ${particle.opacity + 0.2})`;
          ctx.lineWidth = particle.size / 2;
          ctx.stroke();
          
          // Create splash effect when droplets hit bottom
          if (particle.y > canvas.height - 10) {
            ctx.beginPath();
            ctx.arc(particle.x, canvas.height - 5, particle.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(176, 224, 230, ${particle.opacity * 0.7})`;
            ctx.fill();
          }
          
          // Rain falls down faster with slight angle
          particle.y += particle.speedY + 10 + Math.random() * 5;
          particle.x += particle.speedX * 0.5; // slight sideways drift
        } else if (particleType.includes('thunderstorm')) {
          // Rain with occasional flash
          // Draw rain similar to rain effect
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x, particle.y + particle.size * 3);
          ctx.strokeStyle = `rgba(176, 224, 230, ${particle.opacity + 0.2})`;
          ctx.lineWidth = particle.size / 2;
          ctx.stroke();
          
          // Create splash effect when droplets hit bottom
          if (particle.y > canvas.height - 10) {
            ctx.beginPath();
            ctx.arc(particle.x, canvas.height - 5, particle.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(176, 224, 230, ${particle.opacity * 0.7})`;
            ctx.fill();
          }
          
          // Rain falls down faster in thunderstorms
          particle.y += particle.speedY + 15 + Math.random() * 5;
          particle.x += particle.speedX + (Math.random() * 2 - 1); // more chaotic sideways movement
        } else if (particleType.includes('snow')) {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.beginPath();
          // Draw more detailed snowflake
          for (let j = 0; j < 6; j++) {
            ctx.moveTo(particle.x, particle.y);
            const angle = (Math.PI / 3) * j;
            ctx.lineTo(
              particle.x + Math.cos(angle) * particle.size,
              particle.y + Math.sin(angle) * particle.size
            );
          }
          // Add cross details
          for (let j = 0; j < 3; j++) {
            const angle = (Math.PI / 3) * j + (Math.PI / 6);
            ctx.moveTo(
              particle.x + Math.cos(angle) * particle.size * 0.5,
              particle.y + Math.sin(angle) * particle.size * 0.5
            );
            ctx.lineTo(
              particle.x - Math.cos(angle) * particle.size * 0.5,
              particle.y - Math.sin(angle) * particle.size * 0.5
            );
          }
          ctx.fill();
          
          // Snow falls slower with some drift
          particle.y += particle.speedY + 0.8;
          particle.x += Math.sin(particle.y / 30) * 0.8;
          
          // Snowflakes also rotate (simulated by varying the angle)
          particle.rotation = (particle.rotation || 0) + 0.01;
        } else if (particleType.includes('cloud')) {
          ctx.fillStyle = `rgba(220, 220, 220, ${particle.opacity * 0.7})`;
          
          // Draw cloud cluster
          const cloudSize = particle.size * 1.5;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, cloudSize, 0, Math.PI * 2);
          ctx.arc(particle.x + cloudSize * 0.5, particle.y - cloudSize * 0.2, cloudSize * 0.8, 0, Math.PI * 2);
          ctx.arc(particle.x - cloudSize * 0.4, particle.y - cloudSize * 0.15, cloudSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
          
          // Clouds drift slowly
          particle.x += particle.speedX * 0.3;
        } else if (particleType.includes('clear')) {
          // Glimmer effect for clear skies
          ctx.fillStyle = `rgba(255, 255, 190, ${particle.opacity * Math.random()})`;
          ctx.beginPath();
          
          // Draw star-like shape
          if (particle.size > 3) {
            // Occasionally draw a twinkling star
            const outerRadius = particle.size;
            const innerRadius = particle.size * 0.4;
            
            for (let i = 0; i < 5; i++) {
              const outerAngle = (Math.PI * 2 / 5) * i;
              const innerAngle = (Math.PI * 2 / 5) * i + (Math.PI / 5);
              
              ctx.lineTo(
                particle.x + Math.cos(outerAngle) * outerRadius,
                particle.y + Math.sin(outerAngle) * outerRadius
              );
              ctx.lineTo(
                particle.x + Math.cos(innerAngle) * innerRadius,
                particle.y + Math.sin(innerAngle) * innerRadius
              );
            }
            ctx.closePath();
          } else {
            // Simple circle for smaller particles
            ctx.arc(particle.x, particle.y, particle.size * 0.8, 0, Math.PI * 2);
          }
          ctx.fill();
          
          // Slight movement with occasional twinkle
          particle.x += particle.speedX * 0.1;
          particle.y += particle.speedY * 0.1;
          
          // Occasionally make stars "twinkle" by changing opacity
          if (Math.random() > 0.95) {
            particle.opacity = Math.random() * 0.5 + 0.3;
          }
        } else if (particleType.includes('fog') || particleType.includes('mist')) {
          // Fog/mist effect
          ctx.fillStyle = `rgba(240, 240, 240, ${particle.opacity * 0.3})`;
          
          // Draw larger diffuse circles for fog
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Fog moves very slowly
          particle.x += particle.speedX * 0.1;
          particle.y += particle.speedY * 0.05;
        } else {
          // Default particles
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          particle.x += particle.speedX * 0.5;
          particle.y += particle.speedY * 0.5;
        }
        
        // Reset particles when they go off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
          particle.size = Math.random() * 5 + 1;
        }
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }
        if (particle.x < 0) {
          particle.x = canvas.width;
          particle.y = Math.random() * canvas.height;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [currentWeather]);

  // Handle weather sound effects
  useEffect(() => {
    if (!currentWeather || !weatherSoundEnabled) return;
    
    const weatherType = currentWeather.weather[0].main.toLowerCase();
    let audioElement = document.getElementById('weather-audio');
    
    // Create audio element if it doesn't exist
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = 'weather-audio';
      audioElement.loop = true;
      document.body.appendChild(audioElement);
    }
    
    // Set appropriate sound based on weather
    if (weatherType.includes('rain')) {
      audioElement.src = '/sounds/rain.mp3'; // Add this file to your public folder
      audioElement.volume = 0.3;
      audioElement.play();
    } else if (weatherType.includes('thunderstorm')) {
      audioElement.src = '/sounds/thunder.mp3'; // Add this file to your public folder
      audioElement.volume = 0.4;
      audioElement.play();
    } else if (weatherType.includes('snow')) {
      audioElement.src = '/sounds/wind.mp3'; // Add this file to your public folder
      audioElement.volume = 0.2;
      audioElement.play();
    } else {
      audioElement.pause();
    }
    
    // Clean up
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [currentWeather, weatherSoundEnabled]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App" style={backgroundStyle}>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.h1 
          className="app-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          Weather Forecast
        </motion.h1>
        
        <motion.div 
          className="glass-panel controls"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LocationSearch 
            onCitySearch={getWeatherByCity}
            onLocationRequest={getUserLocation}
            lastCity={lastCity}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TemperatureToggle 
              units={units} 
              onToggle={toggleUnits} 
            />
          </div>
        </motion.div>
        
        {error && (
          <motion.div 
            className="error-message glass-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        
        <LoadingSpinner loading={loading} />
        
        {!loading && currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="glass-panel"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CurrentWeather data={currentWeather} units={units} />
            </motion.div>
            
            <motion.div
              className="glass-panel forecast-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <Forecast data={forecast} units={units} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;