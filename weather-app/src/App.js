import React from 'react';
import './App.css';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LocationSearch from './components/LocationSearch';
import LoadingSpinner from './components/LoadingSpinner';
import TemperatureToggle from './components/TemperatureToggle';
import useWeather from './hooks/useWeather';
import { getWeatherBackground } from './utils/Helpers';

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

  // Dynamic background based on weather
  const backgroundStyle = {
    background: currentWeather 
      ? getWeatherBackground(currentWeather.weather[0])
      : 'linear-gradient(to bottom, #4b6cb7, #182848)',
    minHeight: '100vh',
    transition: 'background 1s ease'
  };

  return (
    <div className="App" style={backgroundStyle}>
      <div className="container">
        <h1>Weather Forecast</h1>
        
        <div className="controls">
          <LocationSearch 
            onCitySearch={getWeatherByCity}
            onLocationRequest={getUserLocation}
            lastCity={lastCity}
          />
          <TemperatureToggle 
            units={units} 
            onToggle={toggleUnits} 
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <LoadingSpinner loading={loading} />
        
        {!loading && currentWeather && (
          <>
            <CurrentWeather data={currentWeather} units={units} />
            <Forecast data={forecast} units={units} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;