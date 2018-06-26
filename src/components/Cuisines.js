import React, { Component } from 'react';
import styled from 'styled-components';
import { borderRadius, grayBg, grayText, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Cuisine = styled.div`
  padding: 6px 10px;
  border-radius: ${borderRadius};
  font-family: ${systemFont};
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  background-color: ${grayBg};
  color: ${grayText};
  margin-right: 5px;
  margin-bottom: 5px;

  &:last-child {
    margin-right: 0;
  }
`;

const Cuisines = props => {
  const items = props.items || [];
  return (
    <Container>
      {items.map((item, i) => (
        <Cuisine key={i}>{item}</Cuisine>
      ))}
    </Container>
  );
};

export default Cuisines;