import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import Helmet from 'react-helmet';
import { Prompt } from 'react-router-dom';
import {
  Header,
  ImageInput,
  InputGroup,
  Menu,
  TextArea,
  TextInput,
  UserFilters,
} from 'components';
import { AndFilter, OptionLink, P } from 'style';
import { bottomPagePadding, maxTextWidth, red } from 'style/constants';
import { api, getFileExtension, titleCase } from 'utils';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-top: 10px;
  max-width: ${maxTextWidth};
  padding-bottom: ${bottomPagePadding};
`;

const CuisineFilters = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: -5px;
`;

const Error = styled(P)`
  color: ${red};
  margin-top: -10px;
  margin-bottom: 15px;
`;

class RestaurantCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      newCuisine: '',
      newMenuItem: '',
      menuItems: [],
      cuisines: {},
      users: {},
      selectedUser: '',
      selectedImage: null,
      foundError: false,
      errors: {
        name: '',
        coverPhoto: '',
        user: '',
        cuisines: '',
        menuItems: '',
      },
      unsavedChanges: false,
    };

    this.updateText = this.updateText.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.newCuisine = this.newCuisine.bind(this);
    this.updateCuisines = this.updateCuisines.bind(this);
    this.newMenuItem = this.newMenuItem.bind(this);
    this.removeMenuItem = this.removeMenuItem.bind(this);
    this.saveRestaurant = this.saveRestaurant.bind(this);
    this.imageErrorHandler = this.imageErrorHandler.bind(this);
  }

  componentDidMount() {
    const cuisineFetch = api('/cuisines').then(cuisinesList => {
      let { cuisines } = this.state;
      cuisinesList.forEach(c => (cuisines[c] = false));
      this.setState({ cuisines });
    });
    const userFetch = api('/users').then(usersList => {
      let { users } = this.state;
      usersList.forEach(u => {
        users[u.id] = Object.assign(u, {
          checked: false,
        });
      });
      this.setState({ users });
    });
    Promise.all([cuisineFetch, userFetch]).catch(err => {
      console.error(err);
    });
  }

  updateText(e, unsavedChanges = true) {
    let { id, value } = e.target;
    this.setState({
      unsavedChanges,
      [id]: value,
    });
  }

  updateUser(e) {
    let { selectedUser, users, errors } = this.state,
      { value } = e.target;
    Object.keys(users).forEach(u => {
      users[u].checked = u === value;
    });
    this.setState({
      unsavedChanges: true,
      users,
      selectedUser: value,
    });
  }

  updateImage(e) {
    let { errors } = this.state;
    errors.coverPhoto = '';
    this.setState({
      unsavedChanges: true,
      errors,
      selectedImage: e.target.file,
    });
  }

  imageErrorHandler(err) {
    let { errors } = this.state;
    errors.coverPhoto = err;
    this.setState({ errors });
  }

  newCuisine() {
    let { cuisines, newCuisine } = this.state;
    newCuisine = newCuisine.trim();
    if (newCuisine.length > 0) {
      newCuisine = titleCase(newCuisine);
      Object.keys(cuisines).some(c => {
        if (c.toLowerCase() === newCuisine.toLowerCase()) {
          newCuisine = c;
          return true;
        }
      });
      cuisines[newCuisine] = true;
      this.setState({
        unsavedChanges: true,
        cuisines,
        newCuisine: '',
      });
    }
  }

  updateCuisines(e) {
    let { cuisines } = this.state,
      { value } = e.target;
    cuisines[value] = !cuisines[value];
    this.setState({
      unsavedChanges: true,
      cuisines,
    });
  }

  newMenuItem() {
    let { menuItems, newMenuItem } = this.state;
    newMenuItem = newMenuItem.trim();
    if (newMenuItem.length > 0) {
      menuItems.push(newMenuItem);
      this.setState({
        unsavedChanges: true,
        menuItems,
        newMenuItem: '',
      });
    }
  }

  removeMenuItem(e) {
    let { menuItems } = this.state;
    let { index } = e.target;
    menuItems.splice(index, 1);
    this.setState({
      unsavedChanges: true,
      menuItems,
    });
  }

  saveRestaurant() {
    return new Promise((resolve, reject) => {
      let {
        name,
        description,
        selectedUser,
        selectedImage,
        cuisines,
        menuItems,
      } = this.state;
      name = name.trim();
      description = description.trim();
      cuisines = Object.keys(cuisines).filter(c => cuisines[c]);
      var errors = Object.assign({}, this.state.errors);
      let foundError = name.length === 0 || false;
      errors.name = name.length === 0 ? 'You must enter a name.' : '';
      foundError = selectedUser.length === 0 || foundError;
      errors.user = selectedUser.length === 0 ? 'You must select a user.' : '';
      foundError = cuisines.length < 1 || foundError;
      errors.cuisines =
        cuisines.length < 1 ? 'You must select at least one cuisine.' : '';
      foundError = menuItems.length < 1 || foundError;
      errors.menuItems =
        menuItems.length < 1 ? 'You must enter at least one menu item.' : '';
      errors.coverPhoto = '';
      if (errors !== this.state.errors) {
        this.setState({ foundError, errors });
        if (foundError) return reject();
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (selectedImage !== null) {
        formData.append(
          'cover_photo',
          selectedImage,
          name + '.' + getFileExtension(selectedImage.name)
        );
      }
      formData.append('user', selectedUser);
      formData.append('cuisines', JSON.stringify(cuisines));
      formData.append('food_options', JSON.stringify(menuItems));
      api('/restaurants', 'POST', formData)
        .then(data =>
          this.setState(
            {
              unsavedChanges: false,
            },
            () => resolve(`/restaurants/${data.id}`)
          )
        )
        .catch(err => {
          console.log(err);
          reject();
        });
    });
  }

  render() {
    const {
      foundError,
      errors,
      name,
      description,
      users,
      newCuisine,
      cuisines,
      newMenuItem,
      menuItems,
    } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>New Restaurant</title>
        </Helmet>
        <Prompt
          when={this.state.unsavedChanges}
          message={location =>
            `You have unsaved changes. Are you sure you want to leave?`
          }
        />
        <Header title="New Restaurant">
          <OptionLink to="/restaurants" onClick={this.saveRestaurant}>
            Save
          </OptionLink>
        </Header>
        <Form>
          {foundError && (
            <Error>Please resolve the errors below before saving.</Error>
          )}
          <InputGroup
            required
            htmlFor="name"
            title="Name"
            large
            showError={errors.name.length > 0}
            errorMessage={errors.name}
          >
            <TextInput
              id="name"
              value={name}
              placeholder="TGI Fridays"
              autoComplete="off"
              focused
              tabIndex="1"
              onChange={this.updateText}
            />
          </InputGroup>
          <InputGroup htmlFor="description" title="Description" large>
            <TextArea
              tabIndex="2"
              placeholder="Former home of Guy Fieri"
              id="description"
              value={description}
              onChange={this.updateText}
            />
          </InputGroup>
          <InputGroup
            title="Cover Photo"
            large
            hint="Maximum image upload size is 2MB"
            showError={errors.coverPhoto.length > 0}
            errorMessage={errors.coverPhoto}
          >
            <ImageInput
              id="imageInput"
              maxSize={2}
              onChange={this.updateImage}
              onError={this.imageErrorHandler}
            />
          </InputGroup>
          <InputGroup
            required
            title="Closer to"
            large
            showError={errors.user.length > 0}
            errorMessage={errors.user}
          >
            <UserFilters large items={users} onChange={this.updateUser} />
          </InputGroup>
          <InputGroup
            required
            title="Cuisines"
            large
            showError={errors.cuisines.length > 0}
            errorMessage={errors.cuisines}
          >
            <TextInput
              id="newCuisine"
              value={newCuisine}
              placeholder="Southern, Korean, Thai, ..."
              padBottom
              submitText="Add"
              tabIndex="3"
              onChange={e => this.updateText(e, false)}
              onSubmit={this.newCuisine}
            />
            <CuisineFilters>
              {Object.keys(cuisines).map((cf, i) => (
                <AndFilter
                  key={i}
                  value={cf}
                  checked={cuisines[cf]}
                  onChange={this.updateCuisines}
                  large
                />
              ))}
            </CuisineFilters>
          </InputGroup>
          <InputGroup
            required
            title="Menu Items"
            large
            showError={errors.menuItems.length > 0}
            errorMessage={errors.menuItems}
          >
            <TextInput
              id="newMenuItem"
              value={newMenuItem}
              placeholder="Fried Chicken, Apple Pie, ..."
              padBottom
              submitText="Add"
              tabIndex="4"
              onChange={e => this.updateText(e, false)}
              onSubmit={this.newMenuItem}
            />
            <Menu items={menuItems} onRemove={this.removeMenuItem} />
          </InputGroup>
        </Form>
      </Fragment>
    );
  }
}

export default RestaurantCreate;
