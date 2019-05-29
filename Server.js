const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();
const API_KEY = process.env.REACT_APP_API_KEY;

app.get("/geocode", (req, res) => {
  axios
    .get(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        req.query.address +
        "&key=" +
        API_KEY
    )
    .then(response => {
      const results = response.data.results;
      const location = results[0].geometry.location;
      res.send({ location: location });
    });
});

app.get("/restaurants", (req, res) => {
  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        req.query.location +
        "&name=" +
        req.query.name +
        "&opennow&type=restaurant&radius=20000&name=" +
        "&key=" +
        API_KEY
    )
    .then(response => {
      const data = response.data.results;
      const restaurants = data.map(restaurant => restaurant.name);
      const prices = data.map(restaurant => restaurant.price_level);
      const ratings = data.map(restaurant => restaurant.rating);
      const lat = data.map(restaurant => restaurant.geometry.location.lat);
      const long = data.map(restaurant => restaurant.geometry.location.lng);
      const addresses = data.map(restaurant => restaurant.vicinity);
      res.send({
        restaurants: restaurants,
        prices: prices,
        ratings: ratings,
        lat: lat,
        long: long,
        addresses: addresses
      });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
