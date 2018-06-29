import React from 'react';
import styled from 'styled-components';
import { black, blue, borderRadius, grayBg, systemFont, white } from 'style/constants';

const Wrapper = styled.div`
  margin-right: ${props => props.large ? 7: 5}px;
  margin-bottom: ${props => props.large ? 7: 5}px;

  &:last-child {
    margin-right: 0;
  }
`;

const Checkbox = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
`;

const Label = styled.label`
  display: block;
  padding: ${props => props.large ? 7: 6}px ${props => props.large ? 14: 10}px;
  border-radius: ${borderRadius};
  box-sizing: border-box;
  font-family: ${systemFont};
  font-size: ${props => props.large ? 16: 14}px;
  font-weight: 500;
  line-height: 1;
  background-color: ${props => props.light ? white : grayBg};
  color: #6a6a6a;
  cursor: pointer;
  user-select: none;
  transition: 0.1s ease-out;

  /*&:active {
    transform: scale(0.97);
  }*/

  ${Checkbox}:checked + & {
    background-color: ${blue};
    color: ${white};
  }
`;

const AndFilter = props => {
  let { checked, light, value, onChange, large } = props;
  return (
    <Wrapper large={large}>
      <Checkbox id={value} value={value} checked={checked} onChange={onChange} />
      <Label htmlFor={value} light={light} large={large}>{value}</Label>
    </Wrapper>
  );
};

export default AndFilter;