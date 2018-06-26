import React from 'react';
import styled, { css } from 'styled-components';
import { red, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  width: 100%;
  margin-bottom: ${props => props.large ? 30 : 20}px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const Label = styled.label`
  font-family: ${systemFont};
  font-size: ${props => props.large ? 24 : 18}px;
  font-weight: 600;
  opacity: 0.8;
  margin-bottom: ${props => props.large ? 8 : 10}px;

  ${props => props.required && css`
    &::after {
      content: '*';
      color: ${red};
    }
  `}
`;

const InputGroup = props => (
  <Container large={props.large}>
    <Label htmlFor={props.htmlFor} required={props.required} large={props.large}>
      {props.title}
    </Label>
    {props.children}
  </Container>
);

export default InputGroup;