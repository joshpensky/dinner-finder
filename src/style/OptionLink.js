import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { blue, borderRadius, clearBlue, clearRed, red, systemFont } from 'style/constants';

const Content = styled.p`
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.destructive ? red : blue};
  cursor: pointer;
  padding: 6px 12px;
  background-color: ${props => props.destructive ? clearRed : clearBlue};
  border-radius: ${borderRadius};
  margin-bottom: 6px;
`;

class OptionLink extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { onClick, to }  = this.props;
    if (onClick) {
      onClick()
        .then(dest => {
          this.props.history.push(dest || to);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.props.history.push(to);
    }
  }

  render() {
    return (
      <Content onClick={this.handlePress} destructive={this.props.destructive}>
        {this.props.children}
      </Content>
    );
  }
}

export default withRouter(OptionLink);