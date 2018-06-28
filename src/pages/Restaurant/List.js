import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { RestaurantGrid } from 'components';
import { bottomPagePadding } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${bottomPagePadding};
`

class RestaurantList extends Component {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Restaurants</title>
        </Helmet>
        <Container>
          <RestaurantGrid />
        </Container>
      </Fragment>
    )
  }
}

export default RestaurantList;