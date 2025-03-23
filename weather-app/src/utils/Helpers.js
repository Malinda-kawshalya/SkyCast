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
    
    // Get the average or mid-day forecast for each day
    return Object.keys(groupedData).map(date => {
      const dayData = groupedData[date];
      // Find noon forecast or use the middle one
      const middayForecast = dayData.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 14;
      }) || dayData[Math.floor(dayData.length / 2)];
      
      return middayForecast;
    }).slice(0, 5); // Limit to 5 days
  };
  
  // Get background based on weather condition
  export const getWeatherBackground = (condition) => {
    const weatherCode = condition?.id;
    
    if (!weatherCode) return 'linear-gradient(to bottom, #4b6cb7, #182848)';
    
    // Thunderstorm
    if (weatherCode >= 200 && weatherCode < 300) {
      return 'linear-gradient(to bottom, #373B44, #4286f4)';
    }
    // Drizzle or Rain
    if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
      return 'linear-gradient(to bottom, #616161, #9bc5c3)';
    }
    // Snow
    if (weatherCode >= 600 && weatherCode < 700) {
      return 'linear-gradient(to bottom, #E6DADA, #274046)';
    }
    // Atmosphere (fog, mist, etc)
    if (weatherCode >= 700 && weatherCode < 800) {
      return 'linear-gradient(to bottom, #757F9A, #D7DDE8)';
    }
    // Clear
    if (weatherCode === 800) {
      return 'linear-gradient(to bottom, #2193b0, #6dd5ed)';
    }
    // Clouds
    if (weatherCode > 800) {
      return 'linear-gradient(to bottom, #bdc3c7, #2c3e50)';
    }
    
    return 'linear-gradient(to bottom, #4b6cb7, #182848)';
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