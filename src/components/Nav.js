import React, { Component } from 'react';
import styled from 'styled-components';
import { H3, Link, NavLink } from 'style';
import { navHeight, paddingSm, screenXl } from 'style/constants';

const Container = styled.nav`
  width: 100%;
  height: ${navHeight};
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: ${screenXl};
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 ${paddingSm};
`;

const Logo = styled(H3)`
  font-size: 20px;
`;

const RightNav = styled.div`
  display: flex;
  flex-direction: row;
`;

class Nav extends Component {
  render() {
    return (
      <Container>
        <Wrapper>
          <Link to="/">
            <Logo>Dinner Finder</Logo>
          </Link>
          <RightNav>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/restaurants">Restaurants</NavLink>
          </RightNav>
        </Wrapper>
      </Container>
    )
  }
}

export default Nav;