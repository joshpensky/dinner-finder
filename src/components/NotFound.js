import React, { Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { H1, H3 } from 'style';

const NotFound = props => (
  <Fragment>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <H1>404</H1>
    <H3>Not found</H3>
  </Fragment>
);

export default NotFound;