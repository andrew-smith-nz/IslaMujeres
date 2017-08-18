import Mapbox, { MapView, Annotations, Annotation } from 'react-native-mapbox-gl';
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import LocationInfo from './locationInfo.js'
import Reactotron from 'reactotron-react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBar from './searchBar.js';
import { bindActionCreators, connect } from 'react-redux';
import { search } from '../actions/search.js';

const mapData = require('../../features.json');
function mapStateToProps(state) { return { searchTerms: state.search.searchTerms }}
function mapDispatchToProps (dispatch) { return { search: (searchTerms) => dispatch(search(searchTerms)) } }

class Map extends Component {
    constructor(props)
    {
        super(props);       
        this.onTap = this.onTap.bind(this);
        this.onUpdateUserLocation = this.onUpdateUserLocation.bind(this);
        this.setActiveLocation = this.setActiveLocation.bind(this);
        this.clearSearchResults = this.clearSearchResults.bind(this);
            
        this.state = {
            zoom: 16,
            userTrackingMode: Mapbox.userTrackingMode.none,   
            selectedLocationId:   this.props.navigation.state.params ? this.props.navigation.state.params.selectedLocationId : null,
            markedLocationIds: this.props.navigation.state.params ? this.props.navigation.state.params.markedLocationIds : [],
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
        //this.onUpdateUserLocation({ latitude: 21.2582, longitude: -86.7492 });
    }

    componentDidMount()
    {        
        this.setActiveLocation();
    }

    setActiveLocation()
    {
       
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
                    source: {uri: location.properties.icon},
                    height: 20,
                    width: 20
                },
                id: location.id
            });
        }
        for (i = 0; i < this.state.markedLocationIds.length; i++)
        {
            if (this.state.markedLocationIds[i] !== this.state.selectedLocationId)
            {
                let location = this.getLocationFromId(this.state.markedLocationIds[i]);
                annotations.push({
                    coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
                    type: 'point',
                    
                    annotationImage: {
                        source: {uri: location.properties.icon},
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
        for (i = 0; i < this.state.markedLocationIds.length; i++)
            {
                if (this.state.markedLocationIds[i] !== this.state.selectedLocationId)
                {
                    let location = this.getLocationFromId(this.state.markedLocationIds[i]);
                    annotations.push({JSX: <Annotation
                        id="annotation2"
                        coordinate={{latitude: 37.55, longitude: -122.25}}
                        style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
                      >
                        <View style={{width: 200, height: 200, borderWidth: 1, borderColor: 'red', borderRadius: 50, backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <Image
                            style={{width: 20, height: 20}}
                            source={{uri: location.properties.icon}}
                          />
                        </View>
                    </Annotation>});
                    /* annotations.push({
                        coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
                        type: 'point',
                        
                        annotationImage: {
                            source: {uri: location.properties.icon},
                            height: 20,
                            width: 20
                        },
                        id: location.id
                    }); */
                }
            }
            return annotations.map(a => {return <View><Text>Test</Text></View>});
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
        this.setState({userLocation: {longitude: payload.longitude, latitude: payload.latitude }});
    }

    clearSearchResults(){
        this.setState({markedLocationIds: []});
    }

    render()
    {
        let centerCoordinate = {
                latitude: 21.258717,
                longitude: -86.7492
                };
        let mapHeight = this.state.expanded ? '40%' : '75%';
        let infoHeight = this.state.expanded ? '60%' : '25%';
        let removeSearchHeight = this.state.selectedLocationId ? this.state.expanded ? '35%' : '70%' : '95%';
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
                
                {this.state.selectedLocationId ? 
                    <TouchableOpacity onPress={() =>  this.toggleExpand()}>
                        <View style={{alignItems:'center', borderWidth:0.5, borderColor:'#dddddd', height:20}}>
                            <Icon name={this.state.expanded ? "chevron-down" : "chevron-up"} size={12} color="#000000" />   
                        </View>                
                    </TouchableOpacity> : null}
                    {this.state.selectedLocationId ? <View style={{height: infoHeight}}>
                        <LocationInfo id={this.state.selectedLocationId} expanded={this.state.expanded} userLocation={this.state.userLocation} />
                    </View> : null } 
                    <SearchBar floating={true} callback={() => { this.props.navigation.navigate('Search')}} />
                        {this.state.markedLocationIds.length > 0 ?
                    <View style={{position:'absolute', top: 60, right:0,left:0,bottom:0, height:40, zIndex:1, alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.clearSearchResults()}>
                            <Text style={{ width: 200, textAlign:'center', borderRadius:6, borderWidth:0.5, borderColor:'black', backgroundColor: '#ffffff', paddingLeft:4, paddingRight:4}} >
                                Clear Search Results</Text>
                        </TouchableOpacity>
                    </View> : null}
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