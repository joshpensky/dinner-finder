import React from 'react';
import styled from 'styled-components';
import { H4, Link } from 'style';
import { borderRadius, grayBg, systemFont } from 'style/constants';

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: ${borderRadius};
  text-align: center;
  cursor: pointer;
`;

const ProfilePicture = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${grayBg};
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const NameLabel = styled.label`
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 6px;
`;

const UserCard = props => {
  const { user } = props;
  const userLink = `/users/${user.id}`;
  return (
    <Container to={userLink}>
      <ProfilePicture source={user.profile_picture} />
      <NameLabel>{user.name.first}</NameLabel>
    </Container>
  );
}

export default UserCard;