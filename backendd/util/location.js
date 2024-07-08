const axios = require("axios");

const HttpError = require("../models/http-error");


// .env file
const API_KEY = "667ead3bc3d21302502609drt3f7b39";

async function getCoordsForAddress(address) {

    // .env file
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`
  );

  const data = response.data;

  if (!response.data || response.data.length == 0) {
    const error = new HttpError(
      "Couldnot find location for the specified address",
      422
    );
    throw error;
  }

  const coordinates = {
    "lat": data[0].lat,
    "lng": data[0].lon,
  };

  return coordinates;
}

module.exports = getCoordsForAddress;
