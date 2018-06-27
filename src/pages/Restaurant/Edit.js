import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { Cuisines, Header, ImageInput, InputGroup, Modal, Menu, TextArea, TextInput, UserFilters } from 'components';
import { AndFilter, H1, H3, OptionLink } from 'style';
import { maxTextWidth } from 'style/constants';
import { api, getFileExtension, titleCase } from 'utils';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-top: 10px;
  max-width: ${maxTextWidth};
  padding-bottom: 80px;
`;

const CuisineFilters = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: -5px;
`;

class RestaurantEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      name: '',
      description: '',
      newCuisine: '',
      newMenuItem: '',
      menuItems: [],
      cuisines: {},
      users: {},
      selectedUser: '',
      coverPhoto: null,
      coverPhotoPreview: '',
      deleteModalVisible: false,
    };

    this.updateText = this.updateText.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.newCuisine = this.newCuisine.bind(this);
    this.updateCuisines = this.updateCuisines.bind(this);
    this.newMenuItem = this.newMenuItem.bind(this);
    this.removeMenuItem = this.removeMenuItem.bind(this);
    this.saveRestaurant = this.saveRestaurant.bind(this);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
  }

  componentDidMount() {
    this.nameInput.focus();
    const cuisineFetch = api('/cuisines')
      .then(cuisinesList => {
        let { cuisines } = this.state;
        cuisinesList.forEach(c => cuisines[c] = false);
        this.setState({ cuisines });
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
      .then(() => {
        api(`/restaurants/${this.state.id}`)
          .then(data => {
            let { users, cuisines } = this.state;
            data.cuisines.forEach(c => cuisines[c] = true);
            let userId = data.user.id;
            Object.keys(users).forEach(u => {
              users[u].checked = u === userId;
            });
            this.setState({
              name: data.name,
              description: data.description || '',
              selectedUser: userId,
              cuisines,
              menuItems: data.food_options,
              coverPhotoPreview: data.cover_photo,
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
      })
      .catch(err => {
        console.error(err);
      });
  }

  updateText(e) {
    let { id, value } = e.target;
    let { state } = this;
    state[id] = value;
    this.setState(state);
  }

  updateUser(e) {
    let { selectedUser, users } = this.state,
        { value } = e.target;
    Object.keys(users).forEach(u => {
      users[u].checked = u === value;
    });
    this.setState({
      users,
      selectedUser: value,
    });
  }

  updateImage(e) {
    this.setState({
      coverPhoto: e.target.file,
    })
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
      })
      cuisines[newCuisine] = true;
      this.setState({
        cuisines,
        newCuisine: '',
      });
    }
  }

  updateCuisines(e) {
    let { cuisines } = this.state,
        { value } = e.target;
    cuisines[value] = !cuisines[value];
    this.setState({ cuisines });
  }

  newMenuItem() {
    let { menuItems, newMenuItem } = this.state;
    newMenuItem = newMenuItem.trim();
    if (newMenuItem.length > 0) {
      menuItems.push(newMenuItem);
      this.setState({
        menuItems,
        newMenuItem: '',
      });
    }
  }

  removeMenuItem(e) {
    let { menuItems } = this.state;
    let { index } = e.target;
    menuItems.splice(index, 1);
    this.setState({ menuItems })
  }

  saveRestaurant() {
    return new Promise((resolve, reject) => {
      let { id, name, description, selectedUser, coverPhoto, cuisines, menuItems } = this.state;
      name = name.trim();
      description = description.trim();
      cuisines = Object.keys(cuisines).filter(c => cuisines[c]);
      if (name.length === 0) {
        return reject();
      }
      if (selectedUser.length === 0) {
        return reject();
      }
      if (cuisines.length < 1) {
        return reject();
      }
      if (menuItems.length < 1) {
        return reject();
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (coverPhoto !== null) {
        formData.append('cover_photo', coverPhoto);
      }
      formData.append('user', selectedUser);
      formData.append('cuisines', JSON.stringify(cuisines));
      formData.append('food_options', JSON.stringify(menuItems));
      api(`/restaurants/${id}`, 'POST', formData)
        .then(data => resolve(`/restaurants/${id}`))
        .catch(err => {
          reject(err)
        });
    });
  }

  showDeleteModal() {
    return new Promise((resolve, reject) => {
      this.setState({
        deleteModalVisible: true,
      }, reject);
    });
  }

  deleteRestaurant() {
    return new Promise((resolve, reject) => {
      api(`/restaurants/${this.state.id}`, 'DELETE')
        .then(data => {
          this.props.history.push('/restaurants');
          return resolve();
        })
        .catch(err => {
          reject(err);
        });
    })
  }

  render() {
    const { deleteModalVisible, id, name, description, users, newCuisine, cuisines, newMenuItem, menuItems, coverPhotoPreview } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Edit Restaurant</title>
        </Helmet>
        <Modal visible={deleteModalVisible} actions={[
          { text: 'Confirm', main: true, action: this.deleteRestaurant },
          { text: 'Cancel' },
        ]} />
        <Header title="Edit Restaurant">
          <OptionLink to={`/restaurants/${id}`} onClick={this.saveRestaurant}>Save</OptionLink>
          <OptionLink to="/restaurants" onClick={this.showDeleteModal} destructive>Delete</OptionLink>
        </Header>
        <Form>
          <InputGroup required htmlFor="name" title="Name" large>
            <TextInput id="name" value={name} placeholder="TGI Fridays" autoComplete="off"
              inputRef={ref => this.nameInput = ref} tabIndex="1" onChange={this.updateText} />
          </InputGroup>
          <InputGroup htmlFor="description" title="Description" large>
            <TextArea tabIndex="2" placeholder="Former home of Guy Fieri"
              id="description" value={description} onChange={this.updateText} />
          </InputGroup>
          <InputGroup title="Cover Photo" large hint="Maximum image upload size is 2MB">
            <ImageInput id="imageInput" maxSize={2} onChange={this.updateImage} preview={coverPhotoPreview} />
          </InputGroup>
          <InputGroup required title="Closer to" large>
            <UserFilters large items={users} onChange={this.updateUser} />
          </InputGroup>
          <InputGroup required title="Cuisines" large>
            <TextInput id="newCuisine" value={newCuisine} placeholder="Southern, Korean, Thai, ..." padBottom
              submitText="Add" tabIndex="3" onChange={this.updateText} onSubmit={this.newCuisine} />
            <CuisineFilters>
              {Object.keys(cuisines).map((cf, i) => (
                <AndFilter key={i} value={cf} checked={cuisines[cf]} onChange={this.updateCuisines} large />
              ))}
            </CuisineFilters>
          </InputGroup>
          <InputGroup required title="Menu Items" large>
            <TextInput id="newMenuItem" value={newMenuItem} placeholder="Fried Chicken, Apple Pie, ..." padBottom
              submitText="Add" tabIndex="4" onChange={this.updateText} onSubmit={this.newMenuItem} />
            <Menu items={menuItems} onRemove={this.removeMenuItem} />
          </InputGroup>
        </Form>
      </Fragment>
    );
  }
}

export default withRouter(RestaurantEdit);