'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  settings: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  getSetting: (key: string, defaultValue?: string) => string;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  isLoading: true,
  error: null,
  getSetting: (key, defaultValue = '') => defaultValue,
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setSettings(data.settings);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}