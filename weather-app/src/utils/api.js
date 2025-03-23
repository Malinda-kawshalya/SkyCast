import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: units
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchForecast = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};