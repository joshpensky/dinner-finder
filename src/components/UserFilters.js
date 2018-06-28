import React from 'react';
import styled from 'styled-components';
import { black, blue, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${props => props.large ? 14 : 12}px;

  &:last-child {
    margin-right: 0;
  }
`;

const ProfilePicture = styled.label`
  width: ${props => props.large ? 48 : 40}px;
  height: ${props => props.large ? 48 : 40}px;
  background-color: #ddd;
  border-radius: 50%;
  background-image: url(${props => props.source});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${props => props.large ? 54 : 46}px;
    height: ${props => props.large ? 54 : 46}px;
    border-radius: 50%;
    background-color: ${blue};
    transform: translate(-50%, -50%) scale(${props => props.checked ? 1 : 0.8});
    transition: 0.2s ease-out;
    z-index: -2;
  }
`;

const RadioButton = styled.input.attrs({
  type: 'radio',
})`
  display: none;
`;

const NameLabel = styled.label`
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: ${props => props.checked ? blue : black};
  opacity: ${props => props.checked ? 1 : 0.8};
  margin-top: 6px;
  transition: 0.1s ease-out;
`;

const UserFilters = props => {
  let { items, large } = props;
  items = items || [];
  return (
    <Container>
      {Object.values(items).map((item, i) => (
        <Wrapper key={i} large={large}>
          <ProfilePicture htmlFor={item.id} source={item.profile_picture} checked={item.checked} large={props.large}>
            <RadioButton id={item.id} value={item.id} checked={item.checked} onClick={props.onChange} />
          </ProfilePicture>
          {large && <NameLabel htmlFor={item.id} checked={item.checked}>{item.name.first}</NameLabel>}
        </Wrapper>
      ))}
    </Container>
  );
}

export default UserFilters;