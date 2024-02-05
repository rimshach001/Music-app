import React from 'react';
import MyStack from './Navigation/MyStack';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './Redux/Store';
const App: React.FC = () => {
  return (

    <Provider store={store}>
      <MyStack />
    </Provider>
  );
};

export default App;