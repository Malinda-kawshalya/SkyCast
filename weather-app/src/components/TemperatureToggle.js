import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="loading-container">
      <ClipLoader 
        size={50} 
        color={"#ffffff"} 
        loading={loading} 
      />
      <p>Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;