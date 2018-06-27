import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { FormPage, Home, RestaurantCreate, RestaurantDetail, RestaurantEdit, RestaurantList } from 'pages';
import { Nav, NotFound } from 'components';
import { Main } from 'style';
import 'style/global';

const MainRoute = props => (
  <Main>
    <Route {...props} />
  </Main>
);

const Root = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Nav />
        <Switch>
          <MainRoute exact path="/" component={Home} />
          <MainRoute exact path="/restaurants" component={RestaurantList} />
          <MainRoute exact path="/restaurants/new" component={RestaurantCreate} />
          <MainRoute exact path="/restaurants/:id" component={RestaurantDetail} />
          <MainRoute exact path="/restaurants/:id/edit" component={RestaurantEdit} />
          <MainRoute exact path="/form" component={FormPage} />
          <MainRoute component={NotFound} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>
);

export default Root;
