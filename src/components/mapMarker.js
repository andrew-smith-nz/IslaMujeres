import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { Annotation } from 'react-native-mapbox-gl';

export default class MapMarker extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (<Annotation
            id={this.props.location.id}
            key={this.props.location.id}
            coordinate={{latitude: this.props.location.geometry.coordinates[1], longitude: this.props.location.geometry.coordinates[0]}}
            style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: this.props.isSelected ? 0 : 1}}
            >
            <View key={this.props.location.id} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 15, height:15}}>
                <Image key={this.props.location.id}
                    style={{width: 15, height:15}}
                    source={{uri: this.props.isSelected ? "round_pin_blue" : (this.props.location.properties.icon ? this.props.location.properties.icon : "marker")}}
                    />
            </View>
        </Annotation>);
    }
}