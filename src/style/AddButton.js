import styled from 'styled-components';
import Link from './Link';
import { blue, borderRadius, white } from 'style/constants';

const AddButton = styled(Link)`
  width: 36px;
  height: 30px;
  cursor: pointer;
  position: relative;
  background-color: ${blue};
  border-radius: ${borderRadius};
  margin-bottom: 6px;

  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${white};
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