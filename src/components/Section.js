import React from 'react';
import styled from 'styled-components';
import { H3 } from 'style';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;

  h3 {
    margin-bottom: 10px;
  }
`;

const Section = props => (
  <Container>
    <H3>{props.title}</H3>
    {props.children}
  </Container>
);

export default Section;