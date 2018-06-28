import { SET_MODAL_CONTENT, TOGGLE_MODAL } from 'actions/types';

const initialState = {
  visible: false,
  title: '',
  description: '',
  actions: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL_CONTENT:
      return {
        ...state,
        ...action.payload,
      };
    case TOGGLE_MODAL:
      return {
        ...state,
        visible: action.payload,
      };
    default:
      return state;
  }
};