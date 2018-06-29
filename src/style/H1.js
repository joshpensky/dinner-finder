import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { loadAnim } from 'style/animations';
import { black, borderRadius, grayBg, screenSm, systemFont } from 'style/constants';

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${props => props.loading && css`
    width: 100%;
  `}
`;

const Header1 = styled.h1`
  font-family: ${systemFont};
  font-size: 42px;
  line-height: 44px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease-out;

  @media (max-width: ${screenSm}) {
    font-size: 38px;
    line-height: 40px;
  }
`;

const Loading = styled.div`
  width: ${props => props.width}px;
  height: 38px;
  margin-bottom: 6px;
  background-color: ${grayBg};
  border-radius: ${borderRadius};
  ${props => props.loading ? css`
    position: relative;
  ` : css`
    position: absolute;
    left: 0;
    bottom: 0;
  `}
  overflow: hidden;
  opacity: ${props => props.loading ? 1 : 0};
  transition: width 0.3s ease-out${props => props.contentLoaded ? ', opacity 0.3s ease-out 0.3s' : ''};

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
      maxWidth: 150,
      headerWidth: 0,
      showLoader: this.props.loading !== undefined,
      headerVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children.length === 0) {
      this.setState({
        headerWidth: 0,
        headerVisible: false,
      });
    }
  }

  render() {
    const { loading } = this.props;
    const { headerVisible, headerWidth, maxWidth, showLoader } = this.state;
    return (
      <Wrapper loading={loading} innerRef={ref => this.wrapper = ref}>
        <Header1
          visible={!showLoader || (!loading && headerVisible)}
          innerRef={ref => this.header = ref}>
          {this.props.children}
          </Header1>
        {showLoader && <Loading contentLoaded={this.props.children.length > 0} loading={loading} width={headerWidth > 0 ? headerWidth : maxWidth} />}
      </Wrapper>
    );
  }

  componentDidUpdate() {
    if (this.state.headerWidth !== this.header.offsetWidth) {
      this.setState({
        headerWidth: this.header.offsetWidth,
      }, () => {
        setTimeout(() => {
          this.setState({ headerVisible: true })
        }, 300);
      });
    }
  }
}

export default H1;