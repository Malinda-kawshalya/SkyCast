import React, { useState } from 'react';

const LocationSearch = ({ onCitySearch, onLocationRequest, lastCity }) => {
  const [city, setCity] = useState(lastCity || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onCitySearch(city);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <button 
        onClick={onLocationRequest} 
        className="location-button"
      >
        Use My Location
      </button>
    </div>
  );
};

export default LocationSearch;