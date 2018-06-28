import React from 'react';
import styled from 'styled-components';
import { Cuisines } from 'components';
import { Image, Link } from 'style';
import { borderRadius, grayBg, screenSm, screenMd, screenLg, systemFont } from 'style/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px 30px;

  @media (min-width: ${screenLg}) {
    width: calc(25% - (90px / 4));

    &:nth-child(4n + 1) {
      margin-left: 0;
    }
  
    &:nth-child(4n + 4) {
      margin-right: 0;
    }
  }

  @media (min-width: ${screenMd}) and (max-width: ${screenLg}) {
    width: calc((100% / 3) - 20px);

    &:nth-child(3n + 1) {
      margin-left: 0;
    }
  
    &:nth-child(3n + 3) {
      margin-right: 0;
    }
  }

  @media (min-width: ${screenSm}) and (max-width: ${screenMd}) {
    width: calc(50% - 15px);

    &:nth-child(2n + 1) {
      margin-left: 0;
    }
  
    &:nth-child(2n + 2) {
      margin-right: 0;
    }
  }

  @media (max-width: ${screenSm}) {
    margin: 0;
    margin-bottom: 30px;
    width: 100%;
  }
`;


const CoverPhoto = styled.div`
  width: 100%;
  height: 0;
  padding-top: calc(200% / 3);
  display: table;
  background-color: ${grayBg};
  margin-bottom: 10px;
  border-radius: ${borderRadius};
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`

const User = styled(Link)`
  width: 30px;
  height: 30px;
  background-color: ${grayBg};
  border-radius: 50%;
  margin-left: 10px;
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Title = styled(Link)`
  font-family: ${systemFont};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  flex: 1;
`;

const Restaurant = props => {
  const { id, cuisines, cover_photo, name, user } = props;
  const restaurantUrl = `/restaurants/${id}`;
  const userUrl = `/users/${user.id}`;
  return (
    <Container>
      <Link to={restaurantUrl}>
        <CoverPhoto>
          <Image source={cover_photo} />
        </CoverPhoto>
      </Link>
      <Header>
        <Title to={restaurantUrl}>{name}</Title>
        <User to={userUrl} source={user.profile_picture} />
      </Header>
      <Cuisines items={cuisines} />
    </Container>
  );
}

export default Restaurant;