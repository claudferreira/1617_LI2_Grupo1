import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const initialState = {
  users: null,
  currentUser: null,
}

export const actionTypes = {
  SET_USERS: 'SET_USERS',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS:
      return Object.assign({}, state, { users: action.payload })
    case actionTypes.SET_CURRENT_USER:
      return Object.assign({}, state, { currentUser: action.payload })
    default: return state
  }
}

// ACTIONS
export const setUsers = payload => dispatch => dispatch({ type: actionTypes.SET_USERS, payload })
export const setCurrentUser = payload => dispatch => dispatch({ type: actionTypes.SET_CURRENT_USER, payload })

export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
