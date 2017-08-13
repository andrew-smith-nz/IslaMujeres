import Mapbox, { MapView, Annotations } from 'react-native-mapbox-gl';
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import LocationInfo from './locationInfo.js'
import Reactotron from 'reactotron-react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';

const mapData = require('../features.json');

export default class Map extends Component {
    constructor(props)
    {
        super(props);       
        this.onTap = this.onTap.bind(this);
        this.onUpdateUserLocation = this.onUpdateUserLocation.bind(this);
        this.setActiveLocation = this.setActiveLocation.bind(this);
            
        this.state = {
            zoom: 14.5,
            userTrackingMode: Mapbox.userTrackingMode.none,   
            selectedLocationId: '6cd38145931d11b86f14a0874d756099',
            expanded: false,
            }
    }

    getLocationFromId(id)
    {
        return mapData.features.find((d) => d.id === id);
    }

    componentWillMount()
    {
        // TODO: remove hardcoding
        this.onUpdateUserLocation({ latitude: 21.2582, longitude: -86.7492 });
    }

    componentDidMount()
    {        
        this.setActiveLocation();
    }

    setActiveLocation()
    {
        if (this.props.navigation.state.params)
        {
            let location = this.getLocationFromId(this.props.navigation.state.params.selectedLocationId);
            this._map.setCenterCoordinateZoomLevel(
                location.geometry.coordinates[1], 
                location.geometry.coordinates[0],
                16,
                animated = true, 
                null);
           if (this.state.selectedLocationId !== this.props.navigation.state.params.selectedLocationId) 
               this.setState({ selectedLocationId: this.props.navigation.state.params.selectedLocationId})
           if (this.state.zoom !== 16) this.setState({zoom: 16})
           this.props.navigation.state.params = null;
        }
    }

    componentDidUpdate()
    {        
        this.setActiveLocation();
    }

    getAnnotations(){
        let annotations = [];
        if (this.state.selectedLocationId)
        {
            let location = this.getLocationFromId(this.state.selectedLocationId);
            annotations.push({
                coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
                type: 'point',
                
                annotationImage: {
                    source: { uri: 'https://cldup.com/CnRLZem9k9.png' },
                    height: 25,
                    width: 25
                },
                id: 'marker1'
            });
        }
        return annotations;
    }

    getCustomAnnotations(){
        return null;
    }
    
    toggleExpand(){        
        this.setState({expanded: !this.state.expanded});
    }
    
    onTap(payload){
        let closestDistance = 99;
        let currentDistance = 0;
        let closestId = null;
        for (i = 0; i < mapData.features.length; i++)
        {
            currentDistance = Math.sqrt(Math.pow(Math.abs(payload.longitude - mapData.features[i].geometry.coordinates[0]), 2) + 
                Math.abs(Math.pow(payload.latitude - mapData.features[i].geometry.coordinates[1], 2)));
            if (currentDistance < closestDistance)
            {
                closestDistance = currentDistance;
                closestId =  mapData.features[i].id;
            }
        }
        this.setState({selectedLocationId: closestId});
    }

    onUpdateUserLocation(payload){
        Reactotron.log("setting user location to ");
        this.setState({userLocation: {longitude: payload.longitude, latitude: payload.latitude }});
    }

    render()
    {
        let centerCoordinate = {
                latitude: 21.258717,
                longitude: -86.7492
                };
        let mapHeight = this.state.expanded ? '40%' : '75%';
        let infoHeight = this.state.expanded ? '60%' : '25%';
        return (
            <View style={styles.container}>  
                <View style={ this.state.selectedLocationId ? {height: mapHeight} : {height:'100%'}}>
                    <MapView
                    ref={map => { this._map = map; }}
                    style={styles.map}
                    annotations={this.getAnnotations()}
                    initialCenterCoordinate={centerCoordinate}
                    initialZoomLevel={this.state.zoom}
                    initialDirection={0}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
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
                    attributionButtonIsHidden={false}
                    logoIsHidden={false}
                    annotationsPopUpEnabled={false}>
                        {this.getCustomAnnotations()}
                    </MapView>
                </View>
                
                {this.state.selectedLocationId ? <View style={{alignItems:'center', borderWidth:0.5, borderColor:'#dddddd', height:20}}>
                    <TouchableOpacity onPress={() =>  this.toggleExpand()}>
                         <Icon name={this.state.expanded ? "chevron-down" : "chevron-up"} size={12} color="#000000" />                   
                    </TouchableOpacity>
                </View> : null}
                    {this.state.selectedLocationId ? <View style={{height: infoHeight}}>
                        <LocationInfo id={this.state.selectedLocationId} expanded={this.state.expanded} userLocation={this.state.userLocation} />
                    </View> : null } 
                    <View  style={{position:'absolute', top:0, right:0,left:0,bottom:0, height:50, zIndex:1}}>
                        <SearchBar
                        placeholder='Search...'
                        round={true}
                        onChangeText={(search) =>  this.setState({search}) }
                        onEndEditing={() => this.props.navigation.navigate('Search',  {searchTerms: this.state.search}) }
                        value={this.state.search}
                        lightTheme
                        containerStyle={{backgroundColor:'transparent', borderWidth:0}}
                        inputStyle={{backgroundColor:'white', borderColor:'black', borderWidth:0.5}}
                        />
                    </View>
            </View>);
    }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	flexDirection: 'column',
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