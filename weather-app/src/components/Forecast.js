import React from 'react';
import WeatherIcon from './WeatherIcon';
import { formatDate } from '../utils/Helpers';

const Forecast = ({ data, units }) => {
  if (!data || data.length === 0) return null;

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-items">
        {data.map((item, index) => (
          <div key={index} className="forecast-item">
            <p className="forecast-date">{formatDate(item.dt)}</p>
            <WeatherIcon iconCode={item.weather[0].icon} size={40} />
            <p className="forecast-temp">
              {Math.round(item.main.temp)}{tempUnit}
            </p>
            <p className="forecast-desc">{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;