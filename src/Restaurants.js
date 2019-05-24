import React, { Component } from "react";
import Search from "./Search.js";
import Cville from "./Cville.js";
import RestaurantsList from "./RestaurantsList.js";
import { Row, Col, PageHeader, Layout, Affix } from "antd";
import "./App.css";

const { Content, Footer } = Layout;

class Restaurants extends Component {
  constructor() {
    super();
    this.state = {
      allinfo: [],
      lat: 38.0293,
      lng: -78.4767,
      place: "",
      keyword: ""
    };
  }

  handleSearch = data => {
    this.setState({
      allinfo: data
    });
    this.updateMapPosition(
      this.state.allinfo[0].info.locationlat,
      this.state.allinfo[0].info.locationlng,
      this.state.allinfo[0].info.place,
      this.state.allinfo[0].info.keyword
    );
  };

  updateMapPosition = (lat, lng, place, keyword) => {
    this.setState({
      lat: lat,
      lng: lng,
      place: place,
      keyword: keyword
    });
  };

  render() {
    return (
      <div>
        <Layout className="layout">
          <Content>
            <div style={{ background: "#fde3cf", padding: 50, minHeight: 320 }}>
              <Row>
                <Col span={6} />
                <Col span={12}>
                  <PageHeader
                    style={{ background: "#fde3cf", textAlign: "center" }}
                    title={
                      this.state.keyword + " restaurants in " + this.state.place
                    }
                  />
                </Col>
                <Col span={6} />
              </Row>
              <Row>
                <Col span={6}>
                  <RestaurantsList restaurants={this.state.allinfo} />
                </Col>
                <Col span={12}>
                  <Affix offsetTop={this.state.top}>
                    <Cville
                      restaurants={this.state.allinfo}
                      lat={this.state.lat}
                      lng={this.state.lng}
                    />
                  </Affix>
                </Col>
                <Col span={6}>
                  <Affix offsetTop={this.state.top}>
                    <Search searchFill={this.handleSearch} />
                  </Affix>
                </Col>
              </Row>
              <Footer style={{ background: "#fde3cf" }} />
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Restaurants;
