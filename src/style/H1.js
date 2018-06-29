import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { loadAnim } from 'style/animations';
import { black, borderRadius, grayBg, screenSm, systemFont } from 'style/constants';

const Header1 = styled.h1`
  font-family: ${systemFont};
  font-size: 42px;
  line-height: 44px;

  @media (max-width: ${screenSm}) {
    font-size: 38px;
    line-height: 40px;
  }
`;

const Loading = styled.div`
  width: 100%;
  max-width: 200px;
  height: 38px;
  margin-bottom: 6px;
  background-color: ${grayBg};
  border-radius: ${borderRadius};
  position: relative;
  overflow: hidden;

  @media (max-width: ${screenSm}) {
    height: 34px;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 50px;
    height: 150%;
    transform-origin: center;
    transform: translate(0px, -50%) rotate(15deg);
    opacity: 0.25;
    animation: ${loadAnim} 4s ease-in-out infinite forwards;
  }

  &::after {
    left: -170px;
    background: linear-gradient(to left, #fff 20%, rgba(255, 255, 255, 0));
  }

  &:before {
    left: -120px;
    background: linear-gradient(to right, #fff 20%, rgba(255, 255, 255, 0));
  }
`;

class H1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: this.props.loading !== undefined,
    };
  }

  render() {
    const { loading } = this.props;
    const { showLoader } = this.state;
    return (
      <Fragment>
        {(!showLoader || !loading) && <Header1>{this.props.children}</Header1>}
        {(showLoader && loading) &&  <Loading />}
      </Fragment>
    );
  }
}

export default H1;