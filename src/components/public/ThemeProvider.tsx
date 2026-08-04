'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeConfig {
  primaryBgColor: string;
  secondaryBgColor: string;
  accentColor: string;
  themePreset: string;
}

interface ThemeContextType extends ThemeConfig {
  setTheme: (config: Partial<ThemeConfig>) => void;
}

const defaultTheme: ThemeConfig = {
  primaryBgColor: '#FFFFFF',
  secondaryBgColor: '#F5F0E6',
  accentColor: '#b8934b',
  themePreset: 'classic-ivory',
};

const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme?: Partial<ThemeConfig>;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
  });

  const applyCSSVariables = (config: ThemeConfig) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-bg-primary', config.primaryBgColor);
      root.style.setProperty('--color-bg-secondary', config.secondaryBgColor);
      root.style.setProperty('--color-accent', config.accentColor);
    }
  };

  useEffect(() => {
    applyCSSVariables(theme);
  }, [theme]);

  const setTheme = (newConfig: Partial<ThemeConfig>) => {
    setThemeState((prev) => {
      const updated = { ...prev, ...newConfig };
      applyCSSVariables(updated);
      return updated;
    });
  };

  return (
    <ThemeContext.Provider value={{ ...theme, setTheme }}>
      {/* Inline style tag to prevent FOUC during server render / page hydration */}
      <style>{`
        :root {
          --color-bg-primary: ${theme.primaryBgColor};
          --color-bg-secondary: ${theme.secondaryBgColor};
          --color-accent: ${theme.accentColor};
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
