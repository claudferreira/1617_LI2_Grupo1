import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import omit from 'lodash/omit'

const initialState = {
  users: null,
  currentUser: null,
  connection: {
    master: true,
    slave: true,
  }
}

export const actionTypes = {
  SET_USERS: 'SET_USERS',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  DELETE_USER: 'DELETE_USER',

  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS:
      return Object.assign({}, state, { users: action.payload })
    case actionTypes.SET_CURRENT_USER:
      return Object.assign({}, state, { currentUser: action.payload })
    case actionTypes.DELETE_USER:
      return Object.assign({}, state, { users: omit(state.users, [action.id]) })

    case actionTypes.SET_CONNECTION_STATUS:
      return Object.assign({}, state, { connection: { ...state.connection, [action.payload.type]: action.payload.status } })

    default: return state
  }
}

// ACTIONS
export const setUsers = payload => dispatch => dispatch({ type: actionTypes.SET_USERS, payload })
export const setCurrentUser = payload => dispatch => dispatch({ type: actionTypes.SET_CURRENT_USER, payload })
export const deleteUser = id => dispatch => dispatch({ type: actionTypes.DELETE_USER, id })

export const setConnectionStatus = (type, status) => dispatch => dispatch({
  type: actionTypes.SET_CONNECTION_STATUS,
  payload: { type, status }
})

export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
