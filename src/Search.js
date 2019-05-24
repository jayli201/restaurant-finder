import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

class Search extends Component {
  constructor() {
    super();
    this.state = {
      keyword: "chinese",
      place: "charlottesville",
      locationlat: 38.0293,
      locationlng: -78.4767,
      data: [],
      restaurants: [],
      prices: [],
      ratings: [],
      lat: [],
      long: [],
      address: [],
      allinfo: []
    };

    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLocationChange = event => {
    this.setState({ place: event.target.value });
  };

  handleKeyWordChange = event => {
    this.setState({ keyword: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.componentDidMount();
  }

  componentDidMount() {
    axios
      .get(
        "https://cors-anywhere-hclaunch.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" +
          this.state.place +
          "&key=" +
          API_KEY
      )
      .then(response => {
        const data = response.data.results;
        const locationlat = data[0].geometry.location.lat;
        const locationlng = data[0].geometry.location.lng;
        this.setState({
          locationlat: locationlat,
          locationlng: locationlng
        });
        return axios.get(
          "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
            this.state.locationlat +
            "," +
            this.state.locationlng +
            "&opennow&type=restaurant&radius=12000&name=" +
            this.state.keyword +
            "&key=" +
            API_KEY
        );
      })
      .then(response => {
        const data = response.data.results;
        const restaurants = data.map(restaurant => restaurant.name);
        const prices = data.map(restaurant => restaurant.price_level);
        const ratings = data.map(restaurant => restaurant.rating);
        const lat = data.map(restaurant => restaurant.geometry.location.lat);
        const long = data.map(restaurant => restaurant.geometry.location.lng);
        const addresses = data.map(restaurant => restaurant.vicinity);
        this.setState({
          restaurants: restaurants,
          prices: prices,
          ratings: ratings,
          lat: lat,
          long: long,
          address: addresses
        });
        const allinfo = [];
        for (let i = 0; i < this.state.restaurants.length; i++) {
          allinfo.push({
            name: restaurants[i],
            info: {
              keyword: this.state.keyword,
              place: this.state.place,
              price: prices[i],
              rating: ratings[i],
              latitude: lat[i],
              longitude: long[i],
              address: addresses[i],
              locationlat: this.state.locationlat,
              locationlng: this.state.locationlng
            }
          });
        }
        for (let i = 0; i < allinfo.length; i++) {
          if (allinfo[i].info.price === undefined) {
            allinfo[i].info.price = "undefined";
          } else {
            if (allinfo[i].info.price == 1) {
              allinfo[i].info.price = "$";
            } else if (allinfo[i].info.price == 2) {
              allinfo[i].info.price = "$$";
            } else if (allinfo[i].info.price == 3) {
              allinfo[i].info.price = "$$$";
            } else if (allinfo[i].info.price == 4) {
              allinfo[i].info.price = "$$$$";
            } else {
              allinfo[i].info.price = "$$$$$";
            }
          }
        }
        this.setState({
          allinfo: allinfo
        });
        // to pass data from child to parent
        this.props.searchFill(this.state.allinfo);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter a place:{" "}
            <input
              type="text"
              value={this.state.place}
              onChange={this.handleLocationChange}
            />
          </label>
          <div>
            <label>
              Enter a keyword:{" "}
              <input
                type="text"
                value={this.state.keyword}
                onChange={this.handleKeyWordChange}
              />
            </label>
          </div>
          <div>
            <input type="submit" value="Filled out both place and keyword!" />
          </div>
        </form>
      </div>
    );
  }
}

export default Search;
