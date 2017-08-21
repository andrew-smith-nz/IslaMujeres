import { search } from './src/reducers/search';
import { toggleFavorite } from './src/reducers/favorite.js'
import { setActiveLocation, setHighlightedLocations } from './src/reducers/map';

import React, { Component } from 'react';
import Map from './src/components/map'
import Search from './src/components/search.js'
import Favorites from './src/components/favorites.js'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { StackNavigator, TabNavigator}  from 'react-navigation';
import Reactotron, { asyncStorage } from 'reactotron-react-native'
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { compose, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import {persistStore, autoRehydrate, applyMiddleware} from 'redux-persist'

let store = createStore(combineReducers({search, setActiveLocation, setHighlightedLocations, toggleFavorite}), compose(autoRehydrate({log:true})));

class IslaMujeres extends Component{
  constructor(props){
      super(props);
      this.state = { rehydrated: false }
      Reactotron.configure().use(asyncStorage()).connect()
      Mapbox.setAccessToken('pk.eyJ1IjoidnVscGVzbnoiLCJhIjoiY2o1NWxkZGFtMGRlbzMzbWNnYmEzOG9ncCJ9.nXgM6lu675sFq_53JffL8g');
  }
  componentWillMount(){
    const persistor = persistStore(store, {storage: AsyncStorage, whitelist:['toggleFavorite']}, () => { this.setState({ rehydrated: true })});
    //persistor.purge()
  }
	render() {
    if(!this.state.rehydrated){
      return <Text>Loading...</Text>
    }
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
    Favorites: {
      screen: Favorites,
    },
  },
    { 
      headerMode:'none',
      swipeEnabled:false,
      tabBarOptions: {
        showIcon: true, 
        showLabel: false, 
        style: {height:35, backgroundColor:'#99ccff'},
        tabStyle: { margin:5, padding:0},
        indicatorStyle: {backgroundColor:'#3399ff', height:35} }
    }
);

AppRegistry.registerComponent('IslaMujeres', () => IslaMujeres);
