import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import { SearchBar } from 'react-native-elements';
import Reactotron from 'reactotron-react-native';
import { bindActionCreators, connect } from 'react-redux';
import { search } from '../actions/search.js';

function mapStateToProps(state) { return { searchTerms: state.search.searchTerms }}
function mapDispatchToProps (dispatch) { return { search: (searchTerms) => dispatch(search(searchTerms)) } }

class CustomSearchBar extends Component {
    constructor(props) {
        super(props);
        this.fireCallback = this.fireCallback.bind(this);
        this.state = { floating: props.floating, search: this.props.searchTerms }
    }

    fireCallback()
    {
        if (this.props.callback)
            this.props.callback();
    }
    
    componentWillReceiveProps(newProps){
        if (this.props.searchTerms != newProps.searchTerms)
            this.setState({search: newProps.searchTerms });
    }
    
    render() {
        let bar = <SearchBar
                        placeholder='Search...'
                        round={true}
                        onChangeText={(text) => this.setState({search: text}) }
                        onEndEditing={() => { this.props.search(this.state.search); this.fireCallback() }}
                        value={this.state.search}
                        lightTheme
                        containerStyle={{backgroundColor:'transparent', borderWidth:0}}
                        inputStyle={{backgroundColor:'white', borderColor:'black', borderWidth:0.5}}
                        />;

        if (this.state.floating)
        {
            return (<View style={{position:'absolute', top:0, right:0,left:0,bottom:0, height:50, zIndex:1}}>
                        {bar}
                    </View>);
        }
        else
        {
            return (<View>{bar}</View>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomSearchBar);