import React, { Component } from 'react';
import {View, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

export default class Splash extends Component{
    constructor(props)
    {
        super(props);
    }

    componentWillMount()
    {
    }


    render()
    {
        return (
            <View>
                <ProgressBar progress={this.props.progress} width={200} />
            </View>
        );
    }
}