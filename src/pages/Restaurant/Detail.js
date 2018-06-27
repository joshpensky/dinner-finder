import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { Cuisines, Menu, NotFound } from 'components';
import { H1, H3, Link, P } from 'style';
import { borderRadius, grayBg, grayText, maxTextWidth, screenSm, screenMd, systemFont } from 'style/constants';
import { api, newlineResolver } from 'utils';

const Hero = styled.div`
  width: 100%;
  height: 0;
  padding-top: calc(100% / 3);
  background-color: ${grayBg};
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${borderRadius};

  @media (max-width: ${screenMd}) {
    padding-top: calc(100% / 2);
  }

  @media (max-width: ${screenSm}) {
    padding-top: calc(200% / 3);
  }
`;

const Header = styled.div`
  margin-top: 15px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Name = styled(H1)`
  max-width: ${maxTextWidth};
  flex: 1;
`;

const User = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-left: 15px;
  background-color: #eee;
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Description = styled(P)`
  margin-top: 15px;
  max-width: 700px;
  color: ${grayText};
`;

const Section = styled.section`
  margin-top: 30px;

  h3 {
    margin-bottom: 10px;
  }
`;

class RestaurantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      fetched: false,
      notFound: false,
      name: '',
      user: null,
      description: '',
      cover_photo: '',
      cuisines: [],
      food_options: [],
    };
  }

  componentDidMount() {
    api(`/restaurants/${this.state.id}`)
      .then(data => {
        this.setState({
          fetched: true,
          ...data,
        });
      })
      .catch(err => {
        if (err.status === 404) {
          this.setState({
            fetched: true,
            notFound: true,
          });
        };
      });
  }

  render() {
    const { fetched, notFound, name, user, description, cover_photo, cuisines, food_options } = this.state;
    if (!fetched) {
      return <Hero />
    } else if (notFound) {
      return <NotFound />
    }
    const userLink = `/users/${user.id}`;
    return (
      <Fragment>
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <Hero source={String(cover_photo)} />
        <Header>
          <Name>{name}</Name>
          <Link to={userLink}>
            <User source={user.profile_picture} />
          </Link>
        </Header>
        <Cuisines items={cuisines} />
        {description && description.length > 0 && (
          <Description>
            {newlineResolver(description)}
          </Description>
        )}
        <Section>
          <H3>Menu Items</H3>
          <Menu items={food_options} />
        </Section>
      </Fragment>
    )
  }
}

export default RestaurantDetail;