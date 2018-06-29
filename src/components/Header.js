import React from 'react';
import styled from 'styled-components';
import { H1 } from 'style';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: ${props => props.smallPad ? 10 : 15}px;
  width: 100%;

  h1 {
    flex: 1;
  }
`;

const Options = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end
  margin-bottom: calc(4px - 6px);

  & * {
    margin-left: 6px;

    &:first-child {
      margin-left: 0px;
    }
  }
`;

const Header = props => (
  <Container smallPad={props.smallPad}>
    <H1 loading={props.loading}>{props.title}</H1>
    <Options>
      {props.children}
    </Options>
  </Container>
);

export default Header;