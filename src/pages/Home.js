import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import { H1 } from 'style';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <H1>Home</H1>
      </Fragment>
    );
  }
}

export default Home;
