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

  organizeInfo = () => {
    // sort ratings in descending order
    this.state.ratings.sort(function(a, b) {
      return b - a;
    });
    // organize the info into a large array
    const allinfo = [];
    for (let i = 0; i < this.state.restaurants.length; i++) {
      allinfo.push({
        name: this.state.restaurants[i],
        info: {
          keyword: this.state.keyword,
          place: this.state.place,
          price: this.state.prices[i],
          rating: this.state.ratings[i],
          latitude: this.state.lat[i],
          longitude: this.state.long[i],
          address: this.state.address[i],
          locationlat: this.state.locationlat,
          locationlng: this.state.locationlng
        }
      });
    }
    console.log(allinfo);
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
    // to pass data from child to parent (Restaurants)
    this.props.searchFill(this.state.allinfo);
  };

  componentDidMount() {
    // first get lat and lng from inputted place
    axios
      .get("/geocode?address=" + this.state.place)
      .then(response => {
        const lat = JSON.stringify(response.data.location.lat);
        const lng = JSON.stringify(response.data.location.lng);
        this.setState({
          locationlat: lat,
          locationlng: lng
        });
        // then using the location's lat and lng, use the inputted keyword to get restaurant list
        return axios.get(
          "/restaurants?location=" +
            this.state.locationlat +
            "," +
            this.state.locationlng +
            "&name=" +
            this.state.keyword
        );
      })
      .then(response => {
        const restaurants = response.data.restaurants;
        const prices = response.data.prices;
        const ratings = response.data.ratings;
        const lat = response.data.lat;
        const long = response.data.long;
        const addresses = response.data.addresses;
        this.setState({
          restaurants: restaurants,
          prices: prices,
          ratings: ratings,
          lat: lat,
          long: long,
          address: addresses
        });
        console.log(this.state.restaurants);
        this.organizeInfo();
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
          <Button onClick={this.handleSubmit} type="submit">
            Filled out both place and keyword!
          </Button>
        </Footer>
      </div>
    );
  }
}

export default Search;
