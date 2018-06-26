import styled from 'styled-components';
import { paddingSm, paddingMd, paddingLg, screenSm, screenMd, screenXl } from 'style/constants';

const Main = styled.main`
  width: 100%;
  max-width: ${screenXl};
  flex: 1;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 ${paddingSm};

  /*@media (max-width: ${screenMd}) {
    padding: 0 ${paddingMd};
  }

  @media (max-width: ${screenSm}) {
    padding: 0 ${paddingSm};
  }*/
`;

export default Main;