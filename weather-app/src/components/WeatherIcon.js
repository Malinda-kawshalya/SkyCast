import React from 'react';
import {
  WiDaySunny, WiNightClear,
  WiDayCloudy, WiNightAltCloudy,
  WiCloud, WiCloudy,
  WiRain, WiDayRain, WiNightRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';

const WeatherIcon = ({ iconCode, size = 50 }) => {
  // Map OpenWeather icon codes to react-icons
  const getIcon = (code) => {
    // Check if it's day or night
    const isDay = code.includes('d');
    
    // Map based on icon code
    switch (code.substring(0, 2)) {
      case '01': // clear sky
        return isDay ? <WiDaySunny size={size} /> : <WiNightClear size={size} />;
      case '02': // few clouds
        return isDay ? <WiDayCloudy size={size} /> : <WiNightAltCloudy size={size} />;
      case '03': // scattered clouds
        return <WiCloud size={size} />;
      case '04': // broken/overcast clouds
        return <WiCloudy size={size} />;
      case '09': // shower rain
        return <WiRain size={size} />;
      case '10': // rain
        return isDay ? <WiDayRain size={size} /> : <WiNightRain size={size} />;
      case '11': // thunderstorm
        return <WiThunderstorm size={size} />;
      case '13': // snow
        return <WiSnow size={size} />;
      case '50': // mist/fog
        return <WiFog size={size} />;
      default:
        return <WiDaySunny size={size} />;
    }
  };
  
  return (
    <div className="weather-icon">
      {getIcon(iconCode)}
    </div>
  );
};

export default WeatherIcon;