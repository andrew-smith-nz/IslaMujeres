/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import MapExample from './example';

class IslaMujeres extends Component {
	state = {
		center: {
		  latitude: 21.258717,
		  longitude: -86.7492
		},
		zoom: 14,
		userTrackingMode: Mapbox.userTrackingMode.none,
	}
	
  render() {
    return (
      <View style={styles.container}>   
		<Image style={{width:325, height: 50}} source={require("./img/header.png")} />     
		<MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={false}
          styleURL={"mapbox://styles/vulpesnz/cj5753s0o3qq12rp3ge3gbyyb"}
          userTrackingMode={this.state.userTrackingMode}
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('IslaMujeres', () => IslaMujeres);
