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
import { StackNavigator}  from 'react-navigation';
import Search from './app/search.js'
import Reactotron from 'reactotron-react-native'
import Mapbox, { MapView } from 'react-native-mapbox-gl';



class IslaMujeres extends Component{
  constructor(props){
      super(props);
      Reactotron.connect()
      Mapbox.setAccessToken('pk.eyJ1IjoidnVscGVzbnoiLCJhIjoiY2o1NWxkZGFtMGRlbzMzbWNnYmEzOG9ncCJ9.nXgM6lu675sFq_53JffL8g');
  }
	render() {
	return <View style={{flex:1}}>
			<Image style={{width:325, height: 50}} source={require("./img/header.png")} />     
			<MainTabs />
		</View>;
	}
}

const MainTabs = StackNavigator({
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
