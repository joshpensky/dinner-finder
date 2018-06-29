import React from 'react';
import styled, { css } from 'styled-components';
import { black, red, systemFont } from 'style/constants';

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
  margin-bottom: ${props => props.hint ? 4 : props.large ? 8 : 10}px;

  ${props => props.required && css`
    &::after {
      content: '*';
      color: ${red};
    }
  `}
`;

const Hint = styled.p.attrs({
  className: 'hint',
})`
  font-family: ${systemFont};
  font-size: ${props => props.large ? 18 : 16}px;
  font-weight: 400;
  opacity: 0.8;
  margin-bottom: 12px;
  color: ${props => props.error ? red : black};

  & + .hint {
    margin-top: -4px;
  }
`

const InputGroup = props => (
  <Container large={props.large}>
    <Label htmlFor={props.htmlFor} required={props.required} large={props.large} hint={props.hint || props.errorMessage}>
      {props.title}
    </Label>
    {props.hint && <Hint>{props.hint}</Hint>}
    {props.errorMessage && props.showError && <Hint error>{props.errorMessage}</Hint>}
    {props.children}
  </Container>
);

export default InputGroup;