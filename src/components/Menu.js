import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { borderRadius, clearRed, red, darkGrayBg, grayText, screenMd, systemFont, white } from 'style/constants';

const Container = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  width: 100%;
  margin-bottom: -5px;
`

const Wrapper = styled.li`
  display: flex;
  flex-direction: row;
  margin: 0 5px 10px;

  @media (min-width: ${screenMd}) {
    width: calc(50% - 5px);

    &:nth-child(2n + 1) {
      margin-left: 0;
    }

    &:nth-child(2n + 2) {
      margin-right: 0;
    }
  }

  @media (max-width: ${screenMd}) {
    width: 100%;
    margin: 0;
    margin-bottom: 10px;
  }
`

const MenuItem = styled.div`
  font-family: ${systemFont};
  font-size: 18px;
  font-weight: 400;
  padding: 14px 18px;
  padding-right: 44px;
  box-sizing: border-box;
  color: ${grayText};
  border-radius: ${borderRadius};
  ${props => props.removable && css`
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  `}
  background-color: #f3f3f3;
  position: relative;
  flex: 1;
`;

const RemoveButton = styled.div`
  position: relative;
  width: 44px;
  height: 100%;
  top: 0;
  right: 0;
  cursor: pointer;
  background-color: ${clearRed};
  border-radius: ${borderRadius};
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 12px;
    background-color: ${red};
    width: 20px;
    height: 4px;
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    background-color: ${red};
    width: 4px;
    height: 20px;
    transform: translateY(-50%) rotate(45deg);
  }
`

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removable: this.props.onRemove !== undefined
    };

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(index) {
    this.props.onRemove({
      target: { index }
    });
  }

  render() {
    const { removable } = this.state;
    return (
      <Container>
        {this.props.items.map((item, i) => (
          <Wrapper key={i}>
            <MenuItem removable={removable}>{item}</MenuItem>
            {removable && <RemoveButton onClick={() => this.onRemove(i)} />}
          </Wrapper>
        ))}
      </Container>
    )
  }
};

export default Menu;