import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import { black, systemFont } from 'style/constants';

const NavLink = styled(Link).attrs({
  activeClassName: 'active',
})`
  font-family: ${systemFont};
  font-size: 16px;
  text-decoration: none;
  color: ${black};
  margin-right: 15px;

  &:last-child {
    margin-right: 0;
  }
`;

export default NavLink;