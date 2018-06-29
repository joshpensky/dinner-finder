import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { blue, borderRadius, red, systemFont, white } from 'style/constants';

const Content = styled.div`
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 600;
  color: ${white};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 6px 12px;
  background-color: ${props => props.destructive ? red : blue};
  border-radius: ${borderRadius};
  margin-bottom: 6px;
  opacity: ${props => props.disabled ? 0.4 : 1};
  flex-shrink: 0;
`;

class OptionLink extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    if (!this.props.disabled) {
      const { onClick, to }  = this.props;
      if (onClick) {
        onClick()
          .then(dest => {
            this.props.history.push(dest || to);
          })
          .catch(err => {
            if (err) console.log(err);
          });
      } else {
        this.props.history.push(to);
      }
    }
  }

  render() {
    return (
      <Content onClick={this.handlePress} destructive={this.props.destructive} disabled={this.props.disabled}>
        {this.props.children}
      </Content>
    );
  }
}

export default withRouter(OptionLink);