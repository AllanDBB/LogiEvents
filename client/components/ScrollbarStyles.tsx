import React, { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Component that handles scrollbar styles for web
 * Should be placed once in top-level components
 */
const ScrollbarStyles = () => {
  useEffect(() => {
    // Only run in web environment
    if (Platform.OS === 'web') {
      const styleEl = document.createElement('style');
      
      styleEl.innerHTML = `
        ::-webkit-scrollbar {
          width: 8px;
          background-color: transparent;
        }
        ::-webkit-scrollbar-track {
          background-color: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #D9D9D9;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #c1c1c1;
        }
      `;
      
      document.head.appendChild(styleEl);
      
      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, []);

  // Component doesn't render anything visible
  return null;
};

export default ScrollbarStyles;