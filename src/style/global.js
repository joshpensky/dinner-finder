import { injectGlobal } from 'styled-components';
import { screenMd, white } from 'style/constants';

injectGlobal`
body, h1, h2, h3, h4, h5, h6, p, ul, li, a {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: auto;
  top: 0;
  left: 0;
  background-color: ${white};
  position: relative;

  &.modal-open {
    overflow: hidden;
    position: fixed;
  }
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
`;
