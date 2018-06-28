import { injectGlobal } from 'styled-components';
import { white } from 'style/constants';

injectGlobal`
body, h1, h2, h3, h4, h5, h6, p, ul, li, a {
  margin: 0;
  padding: 0;
}

body {
  background-color: ${white};
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
`;
