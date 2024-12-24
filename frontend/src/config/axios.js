import axios from 'axios';

export const axiosi = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8000", // Add quotes around the URL
});

// Log the baseURL to the console
console.log("Axios Base URL:", axiosi.defaults.baseURL);
