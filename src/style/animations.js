import { keyframes } from 'styled-components';

export const loadAnim = keyframes`
  from {
    transform: translate(0px, -50%) rotate(15deg);
  }
  to {
    transform: translate(100vw, -50%) rotate(15deg);
  }
`;