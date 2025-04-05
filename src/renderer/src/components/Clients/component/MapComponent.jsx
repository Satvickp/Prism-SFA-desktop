import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { constants } from "../../../constants/constants";

const MapComponent = ({
  center = { lat: 20.593684, lng: 78.96288 },
  latitude,
  longitude,
  address,
  onLatitudeChange,
  onLongitudeChange,
  onAddressChange,
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: constants.google_map_api_key,
    libraries: ["places"],
  });

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      onLatitudeChange(lat);
      onLongitudeChange(lng);

      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results &&
          results[0]
        ) {
          onAddressChange(results[0].formatted_address);
        }
      });
    },
    [onLatitudeChange, onLongitudeChange, onAddressChange]
  );

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    onAddressChange(newAddress);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: newAddress }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results &&
        results[0]
      ) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setMapCenter({ lat, lng });
        onLatitudeChange(lat);
        onLongitudeChange(lng);
      }
    });
  };

  return isLoaded ? (
    <>
      <div className="row mb-3">
        <label className="form-label" htmlFor="addressInput">
          Address
        </label>
        <input
          type="text"
          className="form-control"
          id="addressInput"
          value={address}
          placeholder="Enter address"
          onChange={handleAddressChange}
        />
      </div>
      {isMapVisible && (
        <GoogleMap
          mapContainerStyle={{ height: "300px", width: "100%" }}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
        >
          {latitude && longitude && (
            <Marker position={{ lat: latitude, lng: longitude }} />
          )}
        </GoogleMap>
      )}
    </>
  ) : (
    <p>Loading map...</p>
  );
};

export default MapComponent;
{
  /* <div className="my-3">
  <LoadScript googleMapsApiKey={constants.google_map_api_key}>
    <MapComponent
      latitude={latitude}
      longitude={longitude}
      address={address}
      onLatitudeChange={setLatitude}
      onLongitudeChange={setLongitude}
      onAddressChange={setAddress}
    />
  </LoadScript>
</div>; */
}
