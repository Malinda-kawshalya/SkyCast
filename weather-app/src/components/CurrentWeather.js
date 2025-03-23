import React from 'react';
import WeatherIcon from './WeatherIcon';
import { formatDate, formatTime } from '../utils/Helpers';

const CurrentWeather = ({ data, units }) => {
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

  return (
    <div className="current-weather">
      <div className="weather-header">
        <h2>{name}, {sys.country}</h2>
        <p>{formatDate(dt)} | {formatTime(dt)}</p>
      </div>
      
      <div className="weather-main">
        <div className="weather-temp">
          <h1>{Math.round(main.temp)}{tempUnit}</h1>
          <p>Feels like: {Math.round(main.feels_like)}{tempUnit}</p>
        </div>
        
        <div className="weather-condition">
          <WeatherIcon iconCode={weather[0].icon} size={80} />
          <p>{weather[0].description}</p>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span>Humidity</span>
          <span>{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span>Wind</span>
          <span>{Math.round(wind.speed)} {speedUnit}</span>
        </div>
        <div className="detail-item">
          <span>Pressure</span>
          <span>{main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span>Min/Max</span>
          <span>
            {Math.round(main.temp_min)}/{Math.round(main.temp_max)}{tempUnit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;