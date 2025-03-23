import { useState, useEffect } from 'react';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecast } from '../utils/api';
import { groupForecastByDay } from '../utils/Helpers';

const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState(() => {
    return localStorage.getItem('weatherUnits') || 'metric';
  });
  const [lastCity, setLastCity] = useState(() => {
    return localStorage.getItem('lastCity') || '';
  });

  // Toggle temperature units
  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    localStorage.setItem('weatherUnits', newUnits);
    
    // Reload weather with new units if we have data
    if (lastCity) {
      getWeatherByCity(lastCity, newUnits);
    } else if (currentWeather) {
      getWeatherByCoords(
        currentWeather.coord.lat,
        currentWeather.coord.lon,
        newUnits
      );
    }
  };

  // Get weather by city name
  const getWeatherByCity = async (city, unitSystem = units) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCity(city, unitSystem);
      setCurrentWeather(weatherData);
      
      // Save last searched city
      localStorage.setItem('lastCity', city);
      setLastCity(city);
      
      // Get forecast using coordinates
      const forecastData = await fetchForecast(
        weatherData.coord.lat,
        weatherData.coord.lon,
        unitSystem
      );
      
      const dailyForecast = groupForecastByDay(forecastData.list);
      setForecast(dailyForecast);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get weather by coordinates
  const getWeatherByCoords = async (lat, lon, unitSystem = units) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCoords(lat, lon, unitSystem);
      setCurrentWeather(weatherData);
      
      // Save city name
      localStorage.setItem('lastCity', weatherData.name);
      setLastCity(weatherData.name);
      
      // Get forecast
      const forecastData = await fetchForecast(lat, lon, unitSystem);
      const dailyForecast = groupForecastByDay(forecastData.list);
      setForecast(dailyForecast);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (err) => {
          setError('Location access denied. Please search for a city.');
          setLoading(false);
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  // Load last city on initial render
  useEffect(() => {
    if (lastCity) {
      getWeatherByCity(lastCity);
    }
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    units,
    lastCity,
    getWeatherByCity,
    getWeatherByCoords,
    getUserLocation,
    toggleUnits
  };
};

export default useWeather;