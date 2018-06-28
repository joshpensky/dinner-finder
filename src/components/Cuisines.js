import React from 'react';
import styled from 'styled-components';
import { borderRadius, grayBg, grayText, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: -${props => props.large ? 7 : 5}px;
`;

const Cuisine = styled.div`
  padding: ${props => props.large ? 7 : 6}px ${props => props.large ? 14 : 10}px;
  border-radius: ${borderRadius};
  font-family: ${systemFont};
  font-size: ${props => props.large ? 16 : 14}px;
  font-weight: 500;
  line-height: 1;
  background-color: ${grayBg};
  color: ${grayText};
  margin-right: ${props => props.large ? 7 : 5}px;
  margin-bottom: ${props => props.large ? 7 : 5}px;

  &:last-child {
    margin-right: 0;
  }
`;

const Cuisines = props => {
  const items = props.items || [];
  return (
    <Container large={props.large}>
      {items.map((item, i) => (
        <Cuisine key={i} large={props.large}>{item}</Cuisine>
      ))}
    </Container>
  );
};

export default Cuisines;