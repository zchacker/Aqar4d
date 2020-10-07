import React, {Component} from 'react';

import { createStore , applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from '../reducers/';
import RootNav from '../tools/RootNav';

export default class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers , {} , applyMiddleware(ReduxThunk))}>
        <RootNav />
      </Provider>
    );
  }
}
