import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../style/stylesheet.js';
import Reactotron from 'reactotron-react-native'

export default class Thumbnails extends Component{
    constructor(props)
    {
        super(props);
    }

    render(){
            return (
                <View style={{width:86, marginLeft:3, marginTop:6, alignItems:'center'}}>
                    <Image source={this.props.imageSource} style={{width:80, height:80}} />
                </View>);
    }
}