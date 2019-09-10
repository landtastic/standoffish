import ActionTypes from '../../actions/action_types';

const defaultState = {
  theme: 'dark',
};

export default function sectionsReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_THEME: {
      return {
        theme: action.data.theme,
      };
    }

    default:
      break;
  }

  return state;
}
