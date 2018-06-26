import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { RestaurantGrid } from 'components';

class RestaurantList extends Component {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Restaurants</title>
        </Helmet>
        <RestaurantGrid />
      </Fragment>
    )
  }
}

export default RestaurantList;