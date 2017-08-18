import { search } from './src/reducers/search';

import React, { Component } from 'react';
import Map from './src/components/map'
import Search from './src/components/search.js'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { StackNavigator, TabNavigator}  from 'react-navigation';
import Reactotron, { asyncStorage } from 'reactotron-react-native'
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

let store = createStore(combineReducers({search}));

class IslaMujeres extends Component{
  constructor(props){
      super(props);
      Reactotron.configure().use(asyncStorage()).connect()
      Mapbox.setAccessToken('pk.eyJ1IjoidnVscGVzbnoiLCJhIjoiY2o1NWxkZGFtMGRlbzMzbWNnYmEzOG9ncCJ9.nXgM6lu675sFq_53JffL8g');
  }
	render() {
	return <Provider store={store}>
            <View style={{flex:1}}>
              <MainTabs />
            </View>
         </Provider> ;
	}
}

const MainTabs = TabNavigator({
  Map: {
    screen: Map,
  },
  Search: {
    screen: Search,
  },
},
  { headerMode:'none'}
);

AppRegistry.registerComponent('IslaMujeres', () => IslaMujeres);
