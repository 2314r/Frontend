import { useState, useEffect } from 'react';

interface GeolocationData {
  country: string;
  city: string;
  timezone: string;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): GeolocationData => {
  const [data, setData] = useState<GeolocationData>({
    country: '',
    city: '',
    timezone: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Get user's position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });

        const { latitude, longitude } = position.coords;

        // Use a free geocoding service to get location details
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (!response.ok) throw new Error('Failed to fetch location data');
        
        const locationData = await response.json();
        
        setData({
          country: locationData.countryName || 'United States',
          city: locationData.city || locationData.locality || 'New York',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Fallback to default location if geolocation fails
        setData({
          country: 'United States',
          city: 'New York',
          timezone: 'America/New_York',
          loading: false,
          error: 'Unable to detect location. Using default location.',
        });
      }
    };

    getLocation();
  }, []);

  return data;
};