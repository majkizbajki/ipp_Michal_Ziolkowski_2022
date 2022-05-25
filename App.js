import React, {useState} from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import shopListReducer from './store/reducers/shoplist';

import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  shopLists: shopListReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'pacifico': require('./assets/fonts/Pacifico-Regular.ttf'),
    'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
  });
};

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  if(!fontLoaded){
    return(
      <AppLoading 
        startAsync={fetchFonts} 
        onFinish={() => {
          setFontLoaded(true);
        }} 
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
