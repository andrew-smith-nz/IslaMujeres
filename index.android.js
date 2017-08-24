import { search } from './src/reducers/search';
import { toggleFavorite } from './src/reducers/favorite.js'
import { setActiveLocation, setHighlightedLocations } from './src/reducers/map';

import React, { Component } from 'react';
import Map from './src/components/map'
import Search from './src/components/search.js'
import Favorites from './src/components/favorites.js'
import Splash from './src/components/splash.js'
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
      this.state = { rehydrated: false, mapProgress: 0, mapLoaded: false, mapDownloading: true }
      Reactotron.configure({ host: '192.168.0.103' }).use(asyncStorage()).connect()      
  }

  componentWillMount(){
    const persistor = persistStore(store, {storage: AsyncStorage, whitelist:['toggleFavorite']}, () => { this.setState({ rehydrated: true })});
    //persistor.purge()
    this.initializeMap();
  }

  addOfflinePack()
  {
    const subscription = Mapbox.addOfflinePackProgressListener(progressObject => {
      // progressObject has the same format as above
      try {
      if (progressObject)
          {
            let completed = progressObject.countOfResourcesCompleted ? progressObject.countOfResourcesCompleted : 0;
            let total = progressObject.countOfResourcesExpected ? progressObject.countOfResourcesExpected : 1;
            let progress = Math.round(100 * completed / total, 2) / 100;
            this.setState(
                {
                  mapProgress: progress,
                //mapSize: Math.round(progressObject.countOfBytesCompleted / 1000000, 2)
                });
            if (progress === 1)
              this.setState({mapDownloading: false});
        
      }} catch (ex) { Reactotron.log(ex) }
    });
      Mapbox.addOfflinePack({
        name: 'IslaMujeres', // required
        type: 'bbox', // required, only type currently supported`
        metadata: { // optional. You can put any information in here that may be useful to you
            date: new Date(),
            foo: 'bar'
        },
        bounds: [ // required. The corners of the bounded rectangle region being saved offline
        21.1967, -86.7574, 21.2683, -86.7089
        ],
        minZoomLevel: 10, // required
        maxZoomLevel: 16, // required
        styleURL: "mapbox://styles/vulpesnz/cj5753s0o3qq12rp3ge3gbyyb" // required. Valid styleURL
    }).then(() => {
      this.setState({mapDownloading: true});
        // Called after the pack has been added successfully
    }).catch(err => {
        console.error(err); // Handle error
    });
  }
  
  initializeMap()
  {
    Mapbox.setAccessToken('pk.eyJ1IjoidnVscGVzbnoiLCJhIjoiY2o1NWxkZGFtMGRlbzMzbWNnYmEzOG9ncCJ9.nXgM6lu675sFq_53JffL8g');

    Mapbox.initializeOfflinePacks().then(() => {
      //Mapbox.removeOfflinePack('IslaMujeres')
      // get packs to see if the map is already downloaded
      Mapbox.getOfflinePacks().then(packs => { 
        Reactotron.log(packs);
        let mapDownloaded = packs.filter(p => p.name === "IslaMujeres").length > 0
        // if it's not downloaded, commence download
        if (!mapDownloaded)
          this.addOfflinePack();
        else
        {
          //this.timeoutHandle = setTimeout(()=>{
            this.setState({mapDownloading: false});
        //}, 2000);          
        }
      });        
    });
    // Map is approx 100MB
    //Mapbox.removeOfflinePack('test'); return;
    //Mapbox.removeOfflinePack('IslaMujeres').then(() => { Reactotron.log("removed pack"); Mapbox.getOfflinePacks().then(packs => Reactotron.log(packs));});
        
  }

	render() {
    //if(!this.state.rehydrated)
    //{
    //  return <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}><Text>Loading...</Text></View>
    //}
    if (this.state.mapDownloading)
    {
      return <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}><Splash style={{width:'100%', height:'100%'}} progress={this.state.mapProgress} /></View>
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
