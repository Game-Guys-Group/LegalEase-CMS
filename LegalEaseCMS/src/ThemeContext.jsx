import React, { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('manual'); // 'manual' or 'system'

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'manual' ? 'system' : 'manual'));
  };

  const themeVariables = theme === 'light' ? lightTheme : darkTheme;

  // Update themeVariables based on the mode
  if (mode === 'system') {
    // Implement logic to determine system-preferred mode
    // For example, use matchMedia API
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeVariables }}>
      <div>
        <label>
          <input type="checkbox" checked={mode === 'system'} onChange={toggleMode} />
          System Mode
        </label>
      </div>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

const darkTheme = {
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
};
