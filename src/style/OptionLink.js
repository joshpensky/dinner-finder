import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { blue, borderRadius, clearBlue, systemFont } from 'style/constants';

const Content = styled.p`
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 600;
  color: ${blue};
  cursor: pointer;
  padding: 6px 12px;
  background-color: ${clearBlue};
  border-radius: ${borderRadius};
`;

class OptionLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overrideTo: undefined,
      redirect: false,
    };

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.props.onClick()
      .then(dest => {
        this.setState({
          overrideTo: dest,
          redirect: true,
        })
      })
      .catch(err => {
        console.log(err);
        if (this.state.redirect) {
          this.setState({
            redirect: false,
          });
        }
      });
  }

  render() {
    const { overrideTo } = this.state;
    const { to } = this.props;
    if (to && this.state.redirect) {
      return <Redirect to={overrideTo || to} />
    }
    return (
      <Content onClick={this.handlePress}>
        {this.props.children}
      </Content>
    );
  }
}

export default OptionLink;