import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { Cuisines, Header, Menu, NotFound, Section, UserCard } from 'components';
import { H1, H3, HeroImage, Link, OptionLink, P } from 'style';
import { borderRadius, grayBg, grayText, maxTextWidth, screenSm, screenMd, systemFont } from 'style/constants';
import { api, newlineResolver } from 'utils';

const TitleHeader = styled.div`
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
  max-width: ${maxTextWidth};
  color: ${grayText};
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

    this._isMounted = false;
  }

  setState(nextState, callback = null) {
    if (this._isMounted) {
      super.setState(nextState, callback);
    }
  }

  componentDidMount() {
    this._isMounted = true;
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

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { fetched, notFound, id, name, user, description, cover_photo, cuisines, food_options } = this.state;
    if (notFound) {
      return <NotFound />
    }
    return (
      <Fragment>
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <HeroImage source={cover_photo} />
        <Header title={name} smallPad loading={!fetched}>
          <OptionLink to={`/restaurants/${id}/edit`}>Edit</OptionLink>
        </Header>
        {fetched && (
          <Fragment>
            <Cuisines large items={cuisines} />
            {description && description.length > 0 && (
              <Description>
                {newlineResolver(description)}
              </Description>
            )}
            <Section title="Closer to">
              <UserCard user={user} />
            </Section>
            <Section title="Menu Items">
              <Menu items={food_options} />
            </Section>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default RestaurantDetail;