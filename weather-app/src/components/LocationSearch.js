import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSearch = ({ onCitySearch, onLocationRequest, lastCity }) => {
  const [city, setCity] = useState(lastCity || '');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setIsAnimating(true);
      onCitySearch(city);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleLocationClick = () => {
    setIsAnimating(true);
    onLocationRequest();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="search-container"
      style={{
        padding: '25px',
        maxWidth: '550px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))',
        borderRadius: '20px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        fontFamily: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <motion.div
          style={{
            flex: 1,
            position: 'relative'
          }}
          animate={{ 
            boxShadow: isFocused 
              ? '0 0 0 2px rgba(62, 130, 247, 0.6), 0 4px 10px rgba(0, 0, 0, 0.1)' 
              : '0 4px 10px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2rem',
              opacity: 0.7,
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            🔍
          </motion.span>
          <motion.input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter city name..."
            whileFocus={{ scale: 1.01 }}
            style={{
              width: '100%',
              padding: '15px 15px 15px 45px',
              border: 'none',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: '500',
              letterSpacing: '0.3px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
          />
        </motion.div>
        
        <motion.button 
          type="submit" 
          disabled={isAnimating}
          whileHover={{ scale: 1.05, background: 'linear-gradient(45deg, #1a73e8, #3e82f7)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '15px 25px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(45deg, #3e82f7, #5c9df5)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(62, 130, 247, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          Search
        </motion.button>
      </motion.form>
      
      <motion.button 
        onClick={handleLocationClick}
        disabled={isAnimating}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: '0 8px 20px rgba(33, 150, 83, 0.4)'
        }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '16px 20px 16px 50px',
          border: 'none',
          borderRadius: '12px',
          background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
          color: '#fff',
          fontSize: '1.05rem',
          fontWeight: '600',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 6px 15px rgba(46, 204, 113, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.span
          initial={{ x: -5, opacity: 0.7 }}
          animate={{ 
            x: [-5, 2, -5], 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.3rem',
          }}
        >
          📍
        </motion.span>
        Use My Location
      </motion.button>
      
      <AnimatePresence>
        {lastCity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              marginTop: '15px', 
              fontSize: '0.9rem',
              opacity: 0.8,
              overflow: 'hidden',
              textAlign: 'center'
            }}
          >
            <span>Last searched: </span>
            <motion.span
              whileHover={{ 
                color: '#3e82f7',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCity(lastCity);
                onCitySearch(lastCity);
              }}
              style={{ 
                fontWeight: '600',
                textDecoration: 'underline',
              }}
            >
              {lastCity}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LocationSearch;