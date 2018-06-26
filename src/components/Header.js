import React from 'react';
import styled from 'styled-components';
import { H1 } from 'style';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 15px;
  width: 100%;
`;

const Options = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 4px;

  & * {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Header = props => (
  <Container>
    <H1>{props.title}</H1>
    <Options>
      {props.children}
    </Options>
  </Container>
);

export default Header;