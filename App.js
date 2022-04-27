import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import MenuNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import shopListReducer from './store/reducers/shoplist';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  shopLists: shopListReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <MenuNavigator />
    </Provider>
  );
}
