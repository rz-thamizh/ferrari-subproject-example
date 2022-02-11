import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './core/rootReducer';

let storeInstance = null;

function createNewStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
}

export const initStore = (preloadedState) => {
  let newStore = storeInstance ?? createNewStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && storeInstance) {
    newStore = createNewStore({
      ...storeInstance.getState(),
      ...preloadedState,
    });
    // Reset the current store
    storeInstance = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return newStore;
  // Create the store once in the client
  if (!storeInstance) storeInstance = newStore;

  return newStore;
};

export function useStore(initialState) {
  const store = useMemo(() => initStore(initialState), [initialState]);
  return store;
}
