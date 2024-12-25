"use client";

import { useEffect, useRef, useState } from "react";

interface LocationData {
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
}

interface GeolocationState {
  loading: boolean;
  error?: GeolocationPositionError;
}

interface MyLocationProps {
  onLocationUpdate: (lat: number | null, lng: number | null) => void;
}

export default function MyLocation({ onLocationUpdate }: MyLocationProps) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [geoState, setGeoState] = useState<GeolocationState>({
    loading: false,
  });
  const watchId = useRef<number | null>(null);

  const startTracking = () => {
    if (!("geolocation" in navigator)) {
      setGeoState((prev) => ({
        ...prev,
        error: {
          code: 0,
          message: "Geolocation not supported",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        },
      }));
      return;
    }

    setGeoState((prev) => ({ ...prev, loading: true }));

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocationData({
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
        setGeoState((prev) => ({ ...prev, loading: false }));
      },
      (error) => {
        setGeoState((prev) => ({ ...prev, loading: false, error }));
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 12000,
      }
    );
  };

  useEffect(() => {
    console.log("Location data updated:", locationData);
    if (locationData)
      onLocationUpdate(locationData.longitude, locationData.latitude);
  }, [locationData]);

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setLocationData(null);
    onLocationUpdate(null, null);

    setGeoState((prev) => ({
      ...prev,
      loading: false,
      error: undefined,
    }));
  };

  const handleToggle = () => {
    if (!isTracking) {
      startTracking();
    } else {
      stopTracking();
    }
    setIsTracking(!isTracking);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);
  return (
    <div className=" bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Location Tracker</h2>

        {/* Custom Toggle Switch */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {isTracking ? "Tracking On" : "Tracking Off"}
          </span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isTracking ? "bg-blue-600" : "bg-gray-200"
            }`}
            aria-label="Toggle location tracking"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isTracking ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {geoState.error && (
          <div className="p-4 mb-4 text-red-500 bg-red-50 rounded">
            Error: {geoState.error.message}
          </div>
        )}

        {isTracking && geoState.loading && (
          <div className="p-4 text-gray-500">Fetching location data...</div>
        )}

        {locationData && !geoState.loading && (
          <div className="p-4 rounded font-mono text-sm text-gray-500 overflow-auto">
            {locationData.latitude} , {locationData.longitude}
          </div>
        )}

        {!isTracking && (
          <div className="p-2 text-gray-500 text-center">
            Toggle the switch to start tracking your location
          </div>
        )}
      </div>
    </div>
  );
}

// User sees the component with tracking OFF
// User clicks toggle → handleToggle() is called → startTracking() runs
// Browser shows permission prompt
// If allowed, location updates start flowing through the watcher
// Data is formatted and displayed
// When toggle is clicked again, everything is cleaned up
