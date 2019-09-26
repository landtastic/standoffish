import ActionTypes from './action_types';

export const toggleBar = bar => ({
  type: ActionTypes.TOGGLE_BAR,
  data: {
    bar,
  },
});
