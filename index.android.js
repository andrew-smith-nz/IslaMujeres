/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Map from './app/map'
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
import Search from './app/search.js'
import Reactotron, { asyncStorage } from 'reactotron-react-native'
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import MapExample from './app/mapExample.js'



class IslaMujeres extends Component{
  constructor(props){
      super(props);
      Reactotron.configure().use(asyncStorage()).connect()
      Mapbox.setAccessToken('pk.eyJ1IjoidnVscGVzbnoiLCJhIjoiY2o1NWxkZGFtMGRlbzMzbWNnYmEzOG9ncCJ9.nXgM6lu675sFq_53JffL8g');
  }
	render() {
	return <View style={{flex:1}}>
			<MainTabs />
		</View>;
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
