import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../style/stylesheet.js';
import Thumbnails from './thumbnails.js'
import Reactotron from 'reactotron-react-native'

const images = {
  starFilled: require('../img/star_filled.png'),
  starUnfilled: require('../img/star_unfilled.png')
}

export default class LocationInfo extends Component{
    constructor(props)
    {
        super(props);
        this.getInfo = this.getInfo.bind(this);

        this.state = { 
					latitude: 0,
					longitude: 0
		};
    }

    getInfo()
    {
		var customData = require('../features.json');
        return customData.features.find(f => f.id === this.props.id);
    }

    formatDistance(kms)
    {
        if (kms < 1)
            return Math.round(kms * 1000, 0) + " meters";
        return Math.round(kms, 2) + " kms"
    }

    getDistance(lat1, lon1) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((this.state.latitude - lat1) * p)/2 + 
                c(lat1 * p) * c(this.state.latitude * p) * 
                (1 - c((this.state.longitude - lon1) * p))/2;

        Reactotron.log(lat1 + ", " + lon1)
        return this.formatDistance(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    }

    componentWillMount()
    {        
		navigator.geolocation.getCurrentPosition((position) => this.setCurrentPosition(position), null, null);
    }

	setCurrentPosition(position)
	{
        Reactotron.log(position);
        this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
        
	}

    render() {
        let info = this.getInfo();
        let description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis maximus ullamcorper. Nullam venenatis ex eget aliquam efficitur. Proin imperdiet fermentum dolor, et consequat metus ullamcorper eu. Quisque rhoncus vitae dolor ac iaculis. Donec velit enim, tristique ac nisl id, sollicitudin vulputate mi. Aliquam pulvinar gravida sapien, a fringilla dui pharetra sit amet. Etiam a lorem eu eros efficitur ultrices sit amet sit amet lectus. Proin et dui tincidunt, tempus elit quis, interdum magna.';
        return (
            <View>
                <View style={{flexDirection:'row'}}>
                    <Thumbnails imageSource={require("../img/no_photo_available.png")} />
                    <View style={{margin:3, flexDirection:'column', width:'70%'}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth:0.5, borderBottomColor:'#dddddd'}}>
                            <Text style={styles.locationHeading}>{info.properties.label}</Text>
                            <Text style={styles.locationText}>Bar</Text>
                        </View>   
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row'}}><Text style={styles.locationText}>4.2</Text><Image source={images.starFilled} style={{height:15, width:15}} /></View>
                            <Text style={styles.locationText}>{this.getDistance(info.geometry.coordinates[1], info.geometry.coordinates[0])}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={styles.locationText}>
                        {this.props.expanded ? description : description.substring(0, 100) + '...'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}