// src/contexts/ApiKeyContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export const ApiKeyContext = createContext('');

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Fetch the API key from GAS
    google.script.run
      .withSuccessHandler((key) => {
        if (key) {
          setApiKey(key);
        } else {
          toast.error("Failed to load Google Maps API key.");
        }
      })
      .withFailureHandler((error) => {
        toast.error("An error occurred while fetching the API key.");
        console.error(error);
      })
      .getMapsApiKey();
  }, []);

  return (
    <ApiKeyContext.Provider value={apiKey}>
      {children}
    </ApiKeyContext.Provider>
  );
};
