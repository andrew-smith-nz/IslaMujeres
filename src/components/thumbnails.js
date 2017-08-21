import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../style/stylesheet.js';
import Reactotron from 'reactotron-react-native';
import { getPhotos } from '../util/photoGallery.js';

export default class Thumbnails extends Component{
    constructor(props)
    {
        super(props);
        this.getPhotosFromGallery = this.getPhotosFromGallery.bind(this);
    }

    getPhotosFromGallery()
    {
        let photos = getPhotos(this.props.id);
        return photos.map(p => { return (<Image source={p.resource} style={{width:80, height:80}} key={p.id + p.sortOrder} />)});
    }

    render(){
            return (
                <View style={{width:86, marginLeft:3, marginTop:6, alignItems:'center'}}>
                    {this.getPhotosFromGallery()}
                </View>);
    }
}