import React, { Component } from 'react';
import styled from 'styled-components';
import Image from './Image';
import { borderRadius, grayBg, screenSm, screenMd } from 'style/constants';

const Container = styled.div`
  width: 100%;
  height: 0;
  padding-top: calc(100% / 3);
  background-color: ${grayBg};
  margin-bottom: 15px;
  border-radius: ${borderRadius};
  overflow: hidden;
  position: relative;

  @media (max-width: ${screenMd}) {
    padding-top: calc(100% / 2);
  }

  @media (max-width: ${screenSm}) {
    padding-top: calc(200% / 3);
  }
`;

const HeroImage = props => (
  <Container>
    <Image {...props} />
  </Container>
);

export default HeroImage;