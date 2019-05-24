import React, { Component } from "react";
import { Card, PageHeader } from "antd";
import "./App.css";

class RestaurantsList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <PageHeader
          style={{ background: "#fde3cf", textAlign: "center" }}
          title="List of Restaurants:"
        />
        {this.props.restaurants.map(restaurant => (
          <Card
            title={restaurant.name}
            style={{ background: "#ffff6", width: 325 }}
          >
            <p>Price level: {restaurant.info.price}</p>
            <p>Rating: {restaurant.info.rating}</p>
            <p>Address: {restaurant.info.address}</p>
          </Card>
        ))}
      </div>
    );
  }
}

export default RestaurantsList;
