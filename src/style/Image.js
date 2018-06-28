import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { borderRadius, grayBg, screenSm, screenMd } from 'style/constants';

const Loader = styled.img`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.4s ease-out;
`;

class Image extends Component {
  constructor(props) {
    super(props);
    const { source } = props;
    this.state = {
      source,
      backgroundVisible: false,
      loadElement: source && source.length > 0,
    };

    this.loaded = this.loaded.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { source } = nextProps;
    if (source && source.length > 0 && source !== this.state.source) {
      this.setState({
        source,
        loadElement: true,
        backgroundVisible: false,
      });
    }
  }

  loaded(e) {
    this.setState({
      loadElement: false,
      backgroundVisible: true,
    });
  }
  
  render() {
    const { source, backgroundVisible } = this.state;
    return (
      <Fragment>
        {this.state.loadElement && <Loader src={source} onLoad={this.loaded} />}
        <Background source={source} visible={backgroundVisible} />
      </Fragment>
    )
  }
}

export default Image;