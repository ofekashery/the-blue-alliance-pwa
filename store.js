import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Map } from 'immutable'
import createReducer from './reducers'

export function initializeStore (state = Map()) {
  return createStore(
    createReducer(),
    state,
    composeWithDevTools(applyMiddleware(thunk))
  )
}
