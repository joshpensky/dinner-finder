import styled from 'styled-components';
import Link from './Link';
import { blue, borderRadius, clearBlue } from 'style/constants';

const AddButton = styled(Link)`
  width: 36px;
  height: 30px;
  cursor: pointer;
  position: relative;
  background-color: ${clearBlue};
  border-radius: ${borderRadius};

  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${blue};
  }

  &::before {
    width: 3px;
    height: 16px;
  }

  &::after {
    width: 16px;
    height: 3px;
  }
`;

export default AddButton;