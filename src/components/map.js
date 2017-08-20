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

const mapData = require('../../features.json');

function mapStateToProps(state) { return { 
    searchTerms: state.search.searchTerms, 
    activeLocationId: state.setActiveLocation.id,
    highlightedLocations: state.setHighlightedLocations.ids
}}
function mapDispatchToProps (dispatch) { return { 
	search: (searchTerms) => dispatch(search(searchTerms)), 
	setActiveLocation: (id) => dispatch(setActiveLocation(id)) ,
	setHighlightedLocations: (ids) => dispatch(setHighlightedLocations(ids)) 
} }

class Map extends Component {
    constructor(props)
    {
        super(props);       
        this.onTap = this.onTap.bind(this);
        this.onUpdateUserLocation = this.onUpdateUserLocation.bind(this);
        this.setActiveLocation = this.setActiveLocation.bind(this);
        this.clearSearchResults = this.clearSearchResults.bind(this);
        this.openAnnotation = this.openAnnotation.bind(this);
            
        this.state = {
            zoom: 16,
            userTrackingMode: Mapbox.userTrackingMode.none,   
            selectedLocationId:   this.props.activeLocationId,
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
    }

    setActiveLocation(id)
    {
        Reactotron.log("Set Active Locaction = " + id)
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
            annotations.push({JSX: <Annotation
                id={location.id}
                key={location.id}
                coordinate={{latitude: location.geometry.coordinates[1], longitude: location.geometry.coordinates[0]}}
                style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: location.id !== this.props.activeLocationId ? 0 : 1}}
                >
                <View key={location.id} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 60, height: 40}}>
                    <TouchableOpacity key={location.id} onPress={() => this.setActiveLocation(location.id)}>
                        <Image key={location.id}
                        style={{width: location.id !== this.props.activeLocationId ? 15 : 20, height: location.id !== this.props.activeLocationId ? 15 : 20}}
                        source={{uri: location.properties.icon ? location.properties.icon : "marker"}}
                        />
                    </TouchableOpacity>
                    {true ? null : <Text style={{fontSize:8, textAlign:'center'}}>{location.properties.label}</Text>}
                </View>
            </Annotation>});
        }
        return annotations.map(a => {return a.JSX});
    }
    
    toggleExpand(){        
        this.setState({expanded: !this.state.expanded});
    }
    
    onTap(payload){
        Reactotron.log("Ontap")
        let closestDistance = 99999;
        let currentDistance = 0;
        let closestId = null;
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
        Reactotron.log("Annotation Clicked" + payload.id)
        this.setActiveLocation(payload.id);
        //this.props.setActiveLocation(payload.id);
        //this.props.navigation.navigate("Map");
    }

    onUpdateUserLocation(payload){
        this.setState({userLocation: {longitude: payload.longitude, latitude: payload.latitude }});
    }

    clearSearchResults(){
        this.props.setHighlightedLocations([]);
        this.setActiveLocation(null);
        this.props.search('');
    }

    onRegionDidChange(){
        
    }

    render()
    {
        let centerCoordinate = {
                latitude: 21.258717,
                longitude: -86.7492
                };
        let mapHeight = this.state.expanded ? '40%' : '75%';
        let infoHeight = this.state.expanded ? '60%' : '25%';
        let removeSearchHeight = this.props.activeLocationId ? this.state.expanded ? '35%' : '70%' : '95%';
        return (
            <View style={styles.container}> 
                {this.state.expanded && this.props.activeLocationId ? null : 
                <View style={ this.props.activeLocationId ? {height: mapHeight} : {height:'100%'}}>
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
                    //onUpdateUserLocation={this.onUpdateUserLocation}
                    onTap={this.onTap}
                    attributionButtonIsHidden={false}
                    logoIsHidden={false}
                    annotationsPopUpEnabled={false}
                    children={this.getCustomAnnotations()} 
                    />
                </View>}
                
                {this.props.activeLocationId ? 
                    <TouchableOpacity onPress={() =>  this.toggleExpand()}>
                        <View style={{alignItems:'center', borderWidth:0.5, borderColor:'#dddddd', height:20}}>
                            <Icon name={this.state.expanded ? "chevron-down" : "chevron-up"} size={12} color="#000000" />   
                        </View>                
                    </TouchableOpacity> : null}
                    {this.props.activeLocationId ? <View style={{height: infoHeight}}>
                        <LocationInfo id={this.props.activeLocationId} expanded={this.state.expanded} userLocation={this.state.userLocation} />
                    </View> : null } 
                    {this.state.expanded && this.props.activeLocationId ? null : 
                    <SearchBar floating={true} callback={() => { this.props.navigation.navigate('Search')}} />}
                        {this.props.highlightedLocations.length > 0 && !this.state.expanded ?
                    <View style={{position:'absolute', top: 20, right:20,left:0,bottom:0, height:40, zIndex:1, alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.clearSearchResults()}>
                            <Icon name="times" size={16} color='black' />
                        </TouchableOpacity>
                    </View> 
                    : null}
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