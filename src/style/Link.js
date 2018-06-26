import styled from 'styled-components';
import { Link as Anchor } from 'react-router-dom';
import { black } from 'style/constants';

const Link = styled(Anchor)`
  text-decoration: none;
  color: ${black};
`;

export default Link;