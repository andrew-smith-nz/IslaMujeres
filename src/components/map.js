import Mapbox, { MapView, Annotations, Annotation } from 'react-native-mapbox-gl';
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import LocationInfo from './locationInfo.js'
import Reactotron from 'reactotron-react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBar from './searchBar.js';
import { bindActionCreators, connect } from 'react-redux';
import { search } from '../actions/search.js';
import { setActiveLocation, setHighlightedLocations } from '../actions/map.js';
import MapMarker from './mapMarker.js';

const mapData = require('../../features.json');

function mapStateToProps(state) { return { 
    searchTerms: state.search.searchTerms, 
    activeLocationId: state.setActiveLocation.id,
    highlightedLocations: state.setHighlightedLocations.ids,
    recenterMap: state.setActiveLocation.recenterMap
}}
function mapDispatchToProps (dispatch) { return { 
	search: (searchTerms) => dispatch(search(searchTerms)), 
	setActiveLocation: (id) => dispatch(setActiveLocation(id, false)) ,
	setHighlightedLocations: (ids) => dispatch(setHighlightedLocations(ids)) 
} }

class Map extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name="map-o" size={16} color={'white'} />
        ),
      };

    constructor(props)
    {
        super(props);       
        this.onTap = this.onTap.bind(this);
        this.onUpdateUserLocation = this.onUpdateUserLocation.bind(this);
        this.setActiveLocation = this.setActiveLocation.bind(this);
        this.clearSearchResults = this.clearSearchResults.bind(this);
        this.openAnnotation = this.openAnnotation.bind(this);
        this.centerOnLocation = this.centerOnLocation.bind(this);
            
        this.state = {
            zoom: 16,
            userTrackingMode: Mapbox.userTrackingMode.none,   
            selectedLocationId:   this.props.activeLocationId,
            markedLocationIds: this.props.navigation.state.params ? this.props.navigation.state.params.markedLocationIds : [],
            //
            recenterMap: false,
            expanded: false,
            userLocation: null
            }
    }

    getLocationFromId(id)
    {
        return mapData.features.find((d) => d.id === id);
    }

    componentWillMount()
    {
        navigator.geolocation.getCurrentPosition(
            (position) => this.onUpdateUserLocation({latitude: position.coords.latitude, longitude: position.coords.longitude}),
            null, // error callback
            null //{ enableHighAccuracy:false} // options - TODO: enable high accuracy = true for live
        );
        // TODO: remove hardcoding
        //this.onUpdateUserLocation({ latitude: 21.2582, longitude: -86.7492 });
    }

    componentWillReceiveProps(newProps)
    {
        if (newProps.recenterMap)
        {
            let location = this.getLocationFromId(newProps.activeLocationId);
            this._map.setCenterCoordinate(location.geometry.coordinates[1], location.geometry.coordinates[0], true, null);                
        }    
    }

    componentDidMount()
    {        
    }

    setActiveLocation(id)
    {
        this.props.setActiveLocation(id);
    }

    componentDidUpdate()
    {
    }

    getAnnotations(){
        let annotations = [];
        if (this.props.activeLocationId)
        {
            let location = this.getLocationFromId(this.props.activeLocationId);
            annotations.push({
                coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
                type: 'point',
                
                annotationImage: {
                    source: {uri: location.properties.icon ? location.properties.icon : "marker"},
                    height: 30,
                    width: 30
                },
                id: location.id
            });
        }
        for (i = 0; i < this.props.highlightedLocations.length; i++)
        {
            if (this.props.highlightedLocations[i] !== this.props.activeLocationId)
            {
                let location = this.getLocationFromId(this.props.highlightedLocations[i]);
                annotations.push({
                    coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
                    type: 'point',
                    
                    annotationImage: {
                        source: {uri: location.properties.icon ? location.properties.icon : "marker"},
                        height: 20,
                        width: 20
                    },
                    id: location.id
                });
            }
        }
        return annotations;
    }

    getCustomAnnotations(){
        let annotations = [];
        for (i = 0; i < this.props.highlightedLocations.length; i++)
        {
            let location = this.getLocationFromId(this.props.highlightedLocations[i]);
            let isSelected = location.id === this.props.activeLocationId;
            annotations.push({JSX: <MapMarker location={location} isSelected={isSelected} /> });
        }
        if (annotations.length === 0)
        {
            // shove everything in
            for (i = 0; i < mapData.features.length; i++)
                {
                    let location = mapData.features[i];
                    let isSelected = location.id === this.props.activeLocationId;
                    annotations.push({JSX: <MapMarker location={location} isSelected={isSelected} /> });
                }
        }
        return annotations.map(a => {return a.JSX});
    }
    
    toggleExpand(){        
        this.setState({expanded: !this.state.expanded});
    }
    
    onTap(payload){
        let closestDistance = 99999;
        let currentDistance = 0;
        let closestId = null;
        if (this.props.highlightedLocations.length === 0)
        {
            for (i = 0; i < mapData.features.length; i++)
                {
                    let location = mapData.features[i];
                    
                    currentDistance = Math.sqrt(Math.pow(Math.abs(payload.longitude - location.geometry.coordinates[0]), 2) + 
                        Math.abs(Math.pow(payload.latitude - location.geometry.coordinates[1], 2)));
                    if (currentDistance < closestDistance)
                    {
                        closestDistance = currentDistance;
                        closestId =  location.id;
                    }
                }
        }
        for (i = 0; i < this.props.highlightedLocations.length; i++)
        {
            let location = this.getLocationFromId(this.props.highlightedLocations[i]);
            
            currentDistance = Math.sqrt(Math.pow(Math.abs(payload.longitude - location.geometry.coordinates[0]), 2) + 
                Math.abs(Math.pow(payload.latitude - location.geometry.coordinates[1], 2)));
            if (currentDistance < closestDistance)
            {
                closestDistance = currentDistance;
                closestId =  location.id;
            }
        }
       this.setActiveLocation(closestId);
    }

    openAnnotation(payload){
        this.setActiveLocation(payload.id);
        //this.props.setActiveLocation(payload.id);
        //this.props.navigation.navigate("Map");
    }

    onUpdateUserLocation(payload){
        // only update if they're on The Island
        if (payload.longitude >= -86.7574 && payload.longitude <= -86.7089
            && payload.latitude >= 21.1967 && payload.latitude <= 21.2683)
        {
            Reactotron.log('on the island')
            this.setState({userLocation: {longitude: payload.longitude, latitude: payload.latitude }});
        }
        else
        {
            Reactotron.log('not on the island')
            this.setState({userLocation: null});
        }
    }

    clearSearchResults(){
        this.props.setHighlightedLocations([]);
        this.setActiveLocation(null);
        this.props.search('');
    }

    centerOnLocation()
    {
        Reactotron.log(this.state.userLocation);
        if (this.state.userLocation)
            this._map.setCenterCoordinate(this.state.userLocation.latitude, this.state.userLocation.longitude, true, null);                
    }

    onRegionDidChange(){
        
    }

    render()
    {        
        let centerCoordinate = {
                latitude: 21.258717,
                longitude: -86.7492
                };
        let mapHeight = '75%';
        let infoHeight = '25%';
        let removeSearchHeight = this.props.activeLocationId ? this.state.expanded ? '35%' : '70%' : '95%';
        return (
            <View style={styles.container}> 
                {this.state.expanded && this.props.activeLocationId ? null : 
                <View style={{height: mapHeight}}>
                    <MapView
                    ref={map => { this._map = map; }}
                    style={styles.map}
                    //annotations={this.getAnnotations()}
                    initialCenterCoordinate={centerCoordinate}
                    initialZoomLevel={this.state.zoom}
                    initialDirection={0}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    styleURL={"mapbox://styles/vulpesnz/cj5753s0o3qq12rp3ge3gbyyb"}
                    userTrackingMode={this.state.userTrackingMode}
                    //onChangeUserTrackingMode={this.onChangeUserTrackingMode}
                    //onRegionDidChange={this.onRegionDidChange}
                    //onRegionWillChange={this.onRegionWillChange}
                    onOpenAnnotation={this.openAnnotation}
                    //onRightAnnotationTapped={this.onRightAnnotationTapped}
                    onUpdateUserLocation={this.onUpdateUserLocation}
                    onTap={this.onTap}
                    attributionButtonIsHidden={false}
                    logoIsHidden={false}
                    annotationsPopUpEnabled={false}
                    children={this.getCustomAnnotations()} 
                    />
                </View>}
                
                    <TouchableOpacity onPress={() => { if(this.props.activeLocationId) this.toggleExpand(); } }>
                        <View style={{alignItems:'center', borderWidth:0.5, borderColor:'#dddddd', height:20}}>
                            <Icon name={this.state.expanded ? "chevron-down" : "chevron-up"} size={12} color={this.props.activeLocationId ? "#000000" : "#aaaaaa"} />   
                        </View>                
                    </TouchableOpacity>
                    <View style={{height: infoHeight}}>
                        <LocationInfo id={this.props.activeLocationId} expanded={this.state.expanded} showDistance={this.state.userLocation}    />
                    </View>
                    {this.state.expanded && this.props.activeLocationId ? null : 
                    <SearchBar floating={true} callback={() => { this.props.navigation.navigate('Search')}} />}
                        {(this.props.highlightedLocations.length > 0 && !this.state.expanded) ?
                    <View style={{position:'absolute', width:'93%', top: 20, right:30, left:0,bottom:0, height:40, zIndex:1, alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={() => this.clearSearchResults()}>
                            <Icon name="times" size={16} color='black' />
                        </TouchableOpacity>
                    </View> 
                    : null}
                    <View style={{position:'absolute',  right:10,bottom:'28%', height:40, zIndex:1}}>
                        <TouchableOpacity onPress={() => this.centerOnLocation()}>
                            <View style={{ width: 40,
                                height: 40,
                                borderRadius: 40/2,
                                borderColor: 'black',
                                borderWidth: 0.5,
                                backgroundColor: 'white'}}>
                                <Icon name="crosshairs" size={25} color='black' style={{paddingLeft: 8, paddingTop:6.5}} />
                            </View>
                        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Map);