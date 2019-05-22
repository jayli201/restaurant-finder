import React, { Component } from "react";
import axios from "axios";
import Cville from "./Cville.js";
import "./App.css";

const API_KEY = process.env.REACT_APP_API_KEY;

class Restaurants extends Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      prices: [],
      ratings: [],
      open: [],
      lat: [],
      long: [],
      allinfo: [],
      allopen: []
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.0293,-78.4767&radius=12000&type=restaurant&key=" +
          API_KEY
      )
      .then(response => {
        const data = response.data.results;
        const restaurants = data.map(restaurant => restaurant.name);
        const prices = data.map(restaurant => restaurant.price_level);
        const ratings = data.map(restaurant => restaurant.rating);
        const opening = data.map(
          restaurant => restaurant.opening_hours.open_now
        );
        const lat = data.map(restaurant => restaurant.geometry.location.lat);
        const long = data.map(restaurant => restaurant.geometry.location.lng);

        this.setState({
          restaurants: restaurants,
          prices: prices,
          ratings: ratings,
          open: opening,
          lat: lat,
          long: long
        });

        const allinfo = [];
        for (let i = 0; i < this.state.restaurants.length; i++) {
          allinfo.push({
            name: this.state.restaurants[i],
            info: {
              price: prices[i],
              rating: ratings[i],
              open: opening[i],
              latitude: lat[i],
              longitude: long[i]
            }
          });
        }

        this.setState({
          allinfo: allinfo
        });

        const allopen = [];
        for (let i = 0; i < this.state.allinfo.length; i++) {
          if (allinfo[i].info.open == true) {
            allopen.push(allinfo[i]);
          }
        }

        this.setState({
          allopen: allopen
        });
      });
  }

  render() {
    return (
      <div>
        {/* <div>
          {this.state.allopen.map(restaurant => (
            <li>
              Name: {restaurant.name}, Rating: {restaurant.info.rating}, Price
              level: {restaurant.info.price}
            </li>
          ))}
        </div> */}
        <Cville restaurants={this.state.allopen} />
      </div>
    );
  }
}

export default Restaurants;
