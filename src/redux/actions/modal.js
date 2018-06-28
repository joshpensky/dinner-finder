import { SET_MODAL_CONTENT, TOGGLE_MODAL } from 'actions/types';

export const setModalContent = (title, description, actions = []) => dispatch => {
  dispatch({
    type: SET_MODAL_CONTENT,
    payload: {
      title,
      description,
      actions,
    },
  })
};

export const toggleModal = visible => (dispatch, getState) => {
  const { currVisibility } = getState().modal;
  dispatch({
    type: TOGGLE_MODAL,
    payload: visible === undefined ? !currVisibility : visible,
  });
};