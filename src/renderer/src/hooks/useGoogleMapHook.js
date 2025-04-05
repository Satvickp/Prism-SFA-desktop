import { useState, useEffect, useCallback, useRef } from "react";

export function useGeocodeWithAutocomplete(apiKey) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const autocompleteService = useRef(null);
  const geocoder = useRef(null);

  // console.log(latitude, "latitude");

  // useEffect(() => {
  //   // Load Google Maps API
  //   if (!window.google || !window.google.maps) {
  //     const script = document.createElement("script");
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  //     script.async = true;
  //     script.onload = initializeServices;
  //     document.body.appendChild(script);
  //   } else {
  //     initializeServices();
  //   }
  // }, [apiKey]);

  const initializeServices = () => {
    if (!autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!geocoder.current) {
      geocoder.current = new window.google.maps.Geocoder();
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch address suggestions using Google Places API
  const fetchSuggestions = useCallback(
    debounce((input) => {
      if (!autocompleteService.current || !input.trim()) return;

      autocompleteService.current.getPlacePredictions(
        { input, types: ["geocode"] },
        (results, status) => {
          if (status === "OK") {
            setSuggestions(results.map((place) => place.description));
          } else {
            setSuggestions([]);
          }
        }
      );
    }, 500),
    []
  );

  // Fetch coordinates when an address is selected
  const fetchCoordinates = (address) => {
    setQuery(address);
    setSuggestions([]);
    setIsLoading(true);

    if (!geocoder.current) return;

    geocoder.current.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;

        if (location) {
          const lat = location.lat();
          const lng = location.lng();
          if (latitude !== lat || longitude !== lng) {
            setLatitude(lat);
            setLongitude(lng);
          }
        } else {
          setError("Location is unavailable");
          if (latitude !== null || longitude !== null) {
            setLatitude(null);
            setLongitude(null);
          }
        }
      } else {
        setError("Failed to get coordinates");
        if (latitude !== null || longitude !== null) {
          setLatitude(null);
          setLongitude(null);
        }
      }
      setIsLoading(false);
    });
  };

  const reverseGeocode = (lat, lng) => {
    setIsLoading(true);
    setError(null);

    if (!geocoder.current) return;

    const latLng = new window.google.maps.LatLng(lat, lng);
    geocoder.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setQuery(results[0].formatted_address);
        setLatitude(lat);
        setLongitude(lng);
      } else {
        setError("Failed to reverse geocode");
      }
      setIsLoading(false);
    });
  };

  return {
    query,
    setQuery,
    suggestions,
    fetchCoordinates,
    latitude,
    longitude,
    isLoading,
    error,
    fetchSuggestions,
    reverseGeocode,
  };
}
