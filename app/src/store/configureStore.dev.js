import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { saga } from 'spunky'

import rootReducer from '../modules'

function configureStore (initialState = {}) {
  const logger = createLogger({
    collapsed: true
  })

  const localStorageMiddleware = ({getState}) => { // <--- FOCUS HERE
    return (next) => (action) => {
        const result = next(action);
        localStorage.setItem('applicationState', JSON.stringify(
            getState()
        ));
        return result;
    };
};

const reHydrateStore = () => { // <-- FOCUS HERE

  if (localStorage.getItem('applicationState') !== null) {
      return JSON.parse(localStorage.getItem('applicationState')) // re-hydrate the store

  }
}


  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [
    sagaMiddleware,
    thunk,
    logger,
    localStorageMiddleware
  ]

  const store = createStore(
    rootReducer,
    reHydrateStore(),// <-- FOCUS HERE
    applyMiddleware(
      ...middlewares
    )
)

  sagaMiddleware.run(saga)

  return store
}

export default configureStore()
