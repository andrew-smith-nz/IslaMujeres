import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native';
import styles from '../style/stylesheet.js'

export default class SearchResult extends Component {
    constructor(props){
        super(props);
    }

    render () {
        return (<View style={styles.leftRow}>
                        <Image source={require("../img/bar.png")} style={{width: 30, height: 30}}></Image>
                        <Text style={{padding:10}} key={this.props.result.properties.id}>Name: {this.props.result.properties.label}</Text>
                </View>);
    }
}
