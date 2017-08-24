import React, { Component } from 'react';
import {View, Text, Image } from 'react-native';
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
            <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>
                <Image source={{uri: 'splash'}} style={{flex: 1, alignSelf:'stretch', alignItems:'center'}} resizeMode={'stretch'} >
                    <View style={{position:'absolute', bottom:40, alignItems:'center', flexDirection:'column', backgroundColor:'#eeeeee', borderRadius:10, paddingTop:10, paddingBottom:10, paddingLeft:20, paddingRight:20}}>
                        <Text>{this.props.progress != 0 ? "Downloading map resources for offline use..." : "Loading map..."}</Text>
                        {this.props.progress != 0 ? <ProgressBar progress={this.props.progress} width={200} height={20}  style={{marginTop:10}}/> : null}
                    </View>
                </Image>
            </View>
        );
    }
}