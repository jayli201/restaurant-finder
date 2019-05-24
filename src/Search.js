import React, { Component } from "react";
import { PageHeader, Row, Col, Input, Button, Layout } from "antd";
import "./App.css";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const { Content, Footer } = Layout;

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
    // first get lat and lng from inputted place
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
        // get lat and lng
        this.setState({
          locationlat: locationlat,
          locationlng: locationlng
        });
        // then using the location's lat and lng, use the inputted keyword to get restaurant list
        return axios.get(
          "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
            this.state.locationlat +
            "," +
            this.state.locationlng +
            "&opennow&type=restaurant&radius=20000&name=" +
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
        // sort ratings in descending order
        this.state.ratings.sort(function(a, b) {
          return b - a;
        });
        // organize the info into a large array
        const allinfo = [];
        for (let i = 0; i < this.state.ratings.length; i++) {
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
        // change price level to $s
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
        console.log(this.state.allinfo);
        this.state.allinfo.sort((a, b) => a.info.rating - b.info.rating);
        console.log(this.state.allinfo);
      });
  }

  render() {
    return (
      <div>
        <PageHeader
          style={{ background: "#fde3cf", textAlign: "center" }}
          title="Search:"
        />
        <Content>
          <Row gutter={18}>
            <Col span={12}>
              Enter a place:
              <Input
                type="text"
                placeholder="place"
                value={this.state.place}
                onChange={this.handleLocationChange}
              />
            </Col>
            <Col span={12}>
              Enter a keyword:
              <Input
                type="text"
                placeholder="keyword"
                value={this.state.keyword}
                onChange={this.handleKeyWordChange}
              />
            </Col>
          </Row>
        </Content>
        <Footer style={{ background: "#fde3cf", textAlign: "center" }}>
          <div>
            <Button onClick={this.handleSubmit} type="submit">
              Filled out both place and keyword!
            </Button>
          </div>
        </Footer>
      </div>
    );
  }
}

export default Search;
