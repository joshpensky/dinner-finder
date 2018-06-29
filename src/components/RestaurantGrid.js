import React, { Component } from 'react';
import styled from 'styled-components';
import { Header, InputGroup, Restaurant, UserFilters } from 'components';
import { AddButton, AndFilter } from 'style';
import { borderRadius, grayBg, white } from 'style/constants';
import { api } from 'utils';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${grayBg};
  margin-bottom: 20px;
  padding: 12px 15px;
  box-sizing: border-box;
  width: 100%;
  z-index: 0;
  border-radius: ${borderRadius};
`;

const CuisineFilters = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: -5px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  background-color: ${white};
  margin-bottom: -30px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 20px;
    background-color: ${white};
    transform: translateY(-100%);
  }
`;

class RestaurantGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      users: {},
      cuisineFilters: {},
      selectedUser: '',
    };

    this._isMounted = false;
    this.searchTimeout = null;
    this.updateCuisineFilter = this.updateCuisineFilter.bind(this);
    this.updateUserFilter = this.updateUserFilter.bind(this);
    this.searchBuffer = this.searchBuffer.bind(this);
    this.queryItems = this.queryItems.bind(this);
  }

  setState(nextState, callback = null) {
    if (this._isMounted) {
      super.setState(nextState, callback);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    const cuisineFetch = api('/cuisines')
      .then(cuisines => {
        let { cuisineFilters } = this.state;
        cuisines.forEach(c => cuisineFilters[c] = false);
        this.setState({ cuisineFilters });
      });
    const userFetch = api('/users')
      .then(usersList => {
        let { users } = this.state;
        usersList.forEach(u => {
          users[u.id] = Object.assign(u, {
            checked: false,
          });
        });
        this.setState({ users });
      });
    Promise.all([cuisineFetch, userFetch])
      .then(this.searchBuffer)
      .catch(err => {
        console.error(err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateCuisineFilter(e) {
    let { cuisineFilters } = this.state,
        { value } = e.target;
    cuisineFilters[value] = !cuisineFilters[value]
    this.setState({ cuisineFilters }, this.searchBuffer);
  }

  updateUserFilter(e) {
    let { selectedUser, users } = this.state,
        { value } = e.target;
    Object.keys(users).forEach(u => {
      users[u].checked = u === value && !users[value].checked;
    })
    this.setState({
      users,
      selectedUser: users[value].checked ? value : '',
    }, this.searchBuffer);
  }

  searchBuffer(force = false) {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
    }
    if (force) {
      this.queryItems();
    } else {
      this.searchTimeout = setTimeout(this.queryItems, 500);
    }
  }

  queryItems() {
    const { cuisineFilters, selectedUser } = this.state;
    const query = {
      users: selectedUser,
      cuisines: Object.keys(cuisineFilters).filter(f => cuisineFilters[f]).join(',')
    }
    api(`/restaurants?${Object.keys(query).map(k => `${k}=${query[k]}`).join('&')}`)
      .then(items => {
        this.setState({ items });
      })
      .catch(err => {
        console.error(error);
      });
  }

  render() {
    let { title } = this.props;
    let { cuisineFilters, users, items } = this.state;
    return (
      <Container>
        <Header title={title || 'Restaurants'}>
          <AddButton to="/restaurants/new" />
        </Header>
        <Filter innerRef={ref => this.filter = ref}>
          <InputGroup title="Cuisines">
            <CuisineFilters>
              {Object.keys(cuisineFilters).map((cf, i) => (
                <AndFilter large key={i} value={cf} checked={cuisineFilters[cf]} 
                  onChange={this.updateCuisineFilter} light />
              ))}
            </CuisineFilters>
          </InputGroup>
          <InputGroup title="Closer to">
            <UserFilters large items={users} onChange={this.updateUserFilter} />
          </InputGroup>
        </Filter>
        <Grid>
          {items.map(item => (
            <Restaurant key={item.id} {...item} />
          ))}
        </Grid>
      </Container>
    );
  }
}

export default RestaurantGrid;