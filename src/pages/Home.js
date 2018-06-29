import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { Cuisines, Header, Menu, Section, UserCard } from 'components';
import { H1, HeroImage, OptionLink, P } from 'style';
import { grayText, maxTextWidth } from 'style/constants';
import { api } from 'utils';

const Description = styled(P)`
  margin-top: 15px;
  max-width: ${maxTextWidth};
  color: ${grayText};
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      name: '',
      description: '',
      cover_photo: '',
      user: null,
      cuisines: [],
      food_options: [],
    }
    
    this.chooseRestaurant = this.chooseRestaurant.bind(this);
  }

  componentDidMount() {
    this.chooseRestaurant().catch(() => Promise.resolve());
  }

  chooseRestaurant() {
    return new Promise((resolve, reject) => {
      this.setState({
        fetched: false,
        name: '',
        cover_photo: '',
      }, () => {
        api('/restaurants/choose')
          .then(data => {
            setTimeout(() => {
              this.setState({
                fetched: true,
                ...data,
              });
            }, 1000);
          });
      });
      reject();
    })
  }

  render() {
    const { fetched, name, description, cover_photo, user, cuisines, food_options } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <HeroImage source={cover_photo} loading={!fetched} />
        <Header title={name} smallPad loading={!fetched}>
          <OptionLink to="/" onClick={this.chooseRestaurant} disabled={!fetched}>Re-roll</OptionLink>
        </Header>
        {fetched && (
          <Fragment>
            <Cuisines large items={cuisines} />
            {description && <Description>{description}</Description>}
            <Section title="Closer to">
              <UserCard user={user} />
            </Section>
            <Section title="Menu Items">
              <Menu items={food_options} />
            </Section>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default Home;
