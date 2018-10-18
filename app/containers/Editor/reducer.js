import { fromJS } from 'immutable';


// The initial state of the App
const initialState = fromJS({
  username: ''
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case 'CURRENT_STATUS':
      return action.data;
    default:
      return state;
  }
}

export default homeReducer;
