import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { H1, H3, Link, P } from 'style';
import { blue, grayText, screenSm, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  padding-top: 100px;
`;

const Title = styled.h1`
  text-align: center;
  font-family: ${systemFont};
  font-size: 144px;
  line-height: 1;
  margin-bottom: 5px;
  font-weight: 800;

  @media (max-width: ${screenSm}) {
    font-size: 112px;
  }
`;

const Description = styled(H3)`
  text-align: center;
  opacity: 0.8;
  margin-bottom: 50px;
`;

const Body = styled(P)`
  text-align: center;
  color: ${grayText};

  span {
    color: ${blue};
    cursor: pointer;
  }
`;

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Not Found</title>
        </Helmet>
        <Container>
          <Title>404</Title>
          <Description>Page not found</Description>
          <Body>Click <span onClick={this.goBack}>here</span> to go back to where you came from.</Body>
        </Container>
      </Fragment>
    );
  }
}

export default withRouter(NotFound);