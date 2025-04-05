import React from "react";
import { GOOGLE_API_KEY } from "../../constants/google-api-key";
import axios from "axios";

export async function getCityFromCoordinates(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            for (let component of addressComponents) {
                if (component.types.includes('locality')) {
                    return component.long_name;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Example usage
// const latitude = 37.7749; // Example latitude
// const longitude = -122.4194; // Example longitude
// const apiKey = 'YOUR_API_KEY'; // Replace with your Google Maps API key

// async () => {
//     const city = await getCityFromCoordinates(latitude, longitude, apiKey);
//     console.log('City:', city);
// })
