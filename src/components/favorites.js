import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, AsyncStorage, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators, connect } from 'react-redux';
import Reactotron from 'reactotron-react-native';
import LocationInfo from './locationInfo.js'
import { setActiveLocation } from '../actions/map.js';

const mapData = require('../../features.json');

function mapStateToProps(state) { return { 
    favorites: state.toggleFavorite.favorites
}}
function mapDispatchToProps (dispatch) { return { 
	setActiveLocation: (id) => dispatch(setActiveLocation(id, true)), 
} }

class Favorites extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name="heart-o" size={16} color={'white'} />
        ),
      };

    constructor(props)
    {
        super(props);
        this.getFavorites = this.getFavorites.bind(this);

        this.state = { favorites: []};
    }

    componentWillMount()
    {
        this.getFavorites();
    }

    componentWillReceiveProps(newProps)
    {
        this.getFavorites();
    }

	mapResult(id) {
		//this.props.navigation.navigate('Map', { markedLocationIds: [ result.id ], selectedLocationId: result.id });
		this.props.setActiveLocation(id);
		this.props.navigation.navigate('Map');
    }
    
    getFavorites()
    {
        return this.props.favorites.map(id => { return (
				<TouchableOpacity onPress={() => this.mapResult(id)} key={'th' + id}>
                    <LocationInfo id={id} key={id} />
				</TouchableOpacity>)});
    }

    render()
    {
        return <ScrollView>{this.getFavorites()}</ScrollView>
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Favorites);