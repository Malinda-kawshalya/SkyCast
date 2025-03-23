// src/utils/Helpers.js

// Format date to readable format
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
  });
};

// Get time from timestamp
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
  });
};

// Group forecast data by day
export const groupForecastByDay = (forecastList) => {
  const groupedData = {};
  
  forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!groupedData[date]) {
          groupedData[date] = [];
      }
      
      groupedData[date].push(item);
  });
  
  return Object.keys(groupedData).map(date => {
      const dayData = groupedData[date];
      const middayForecast = dayData.find(item => {
          const hour = new Date(item.dt * 1000).getHours();
          return hour >= 12 && hour <= 14;
      }) || dayData[Math.floor(dayData.length / 2)];
      
      return middayForecast;
  }).slice(0, 5);
};

// Convert between temperature units
export const convertTemp = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'metric' && toUnit === 'imperial') {
      return (temp * 9/5) + 32;
  }
  
  if (fromUnit === 'imperial' && toUnit === 'metric') {
      return (temp - 32) * 5/9;
  }
  
  return temp;
};

// Enhanced weather background with simplified gradient backgrounds
export const getWeatherBackground = (weatherData) => {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return {
          background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 1s ease-in-out'
      };
  }
  
  const main = weatherData.weather[0].main.toLowerCase();
  const id = weatherData.weather[0].id;
  let backgroundGradient;
  
  if (main.includes('rain') || main.includes('drizzle')) {
      // Darker blue gradient for rainy conditions
      backgroundGradient = 'linear-gradient(135deg, #1c3a5e 0%, #0c1824 100%)';
  } else if (main.includes('thunderstorm')) {
      // Dark stormy gradient with purple tones
      backgroundGradient = 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)';
  } else if (main.includes('snow')) {
      // Light blue/white gradient for snow
      backgroundGradient = 'linear-gradient(135deg, #e0e0e0 0%, #b8d0e5 100%)';
  } else if (main.includes('clear')) {
      // Bright blue gradient for clear days
      const hour = new Date().getHours();
      // Night time (between 7 PM and 6 AM)
      if (hour >= 19 || hour <= 6) {
          backgroundGradient = 'linear-gradient(135deg, #090979 0%, #020024 100%)';
      } else {
          // Day time
          backgroundGradient = 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)';
      }
  } else if (main.includes('cloud')) {
      // Gray-blue gradient for cloudy days
      backgroundGradient = 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
  } else if (main.includes('fog') || main.includes('mist')) {
      // Misty gradient
      backgroundGradient = 'linear-gradient(135deg, #d7d2cc 0%, #304352 100%)';
  } else {
      // Default gradient
      backgroundGradient = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
  }
  
  return {
      background: backgroundGradient,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 1s ease-in-out'
  };
};

// Weather display component
export const WeatherDisplay = ({ weatherData }) => {
  const backgroundStyle = getWeatherBackground(weatherData);
  
  return (
      <div style={{
          ...backgroundStyle,
          minHeight: '100vh',
          padding: '20px',
          color: '#fff',
          position: 'relative'
      }}>
          <div style={{ zIndex: 1, position: 'relative' }}>
              <h1>{weatherData?.name}</h1>
              <p>{formatDate(weatherData?.dt)}</p>
              <p>{Math.round(convertTemp(weatherData?.main.temp, 'metric', 'imperial'))}°F</p>
              <p>{weatherData?.weather[0].description}</p>
          </div>
      </div>
  );
};

// Get weather icon with animations
export const getWeatherIcon = (condition) => {
  const weatherCode = condition?.id;
  
  const iconStyles = {
      animated: {
          transition: 'all 0.3s ease',
          '&:hover': {
              transform: 'scale(1.1)',
              filter: 'brightness(1.2)'
          }
      }
  };

  if (weatherCode >= 200 && weatherCode < 300) {
      return { icon: '⚡', style: { ...iconStyles.animated, color: '#fff44f' } };
  }
  if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
      return { icon: '🌧️', style: { ...iconStyles.animated, color: '#3498db' } };
  }
  if (weatherCode >= 600 && weatherCode < 700) {
      return { icon: '❄️', style: { ...iconStyles.animated, color: '#ecf0f1' } };
  }
  if (weatherCode >= 700 && weatherCode < 800) {
      return { icon: '🌫️', style: { ...iconStyles.animated, color: '#95a5a6' } };
  }
  if (weatherCode === 800) {
      return { 
          icon: new Date().getHours() >= 6 && new Date().getHours() <= 18 ? '☀️' : '🌙',
          style: { ...iconStyles.animated, color: '#f1c40f' }
      };
  }
  if (weatherCode > 800) {
      return { icon: '☁️', style: { ...iconStyles.animated, color: '#bdc3c7' } };
  }
  
  return { icon: '🌤️', style: iconStyles.animated };
};