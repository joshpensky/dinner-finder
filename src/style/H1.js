import styled from 'styled-components';
import { screenSm, systemFont } from 'style/constants';

const H1 = styled.h1`
  font-family: ${systemFont};
  font-size: 42px;
  line-height: 44px;

  @media (max-width: ${screenSm}) {
    font-size: 38px;
    line-height: 40px;
  }
`;

export default H1;