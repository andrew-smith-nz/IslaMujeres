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
        this.state = { floating: props.floating, search: this.props.searchTerms, isSearching: false }
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
                        onFocus={() => this.setState({isSearching: true})}
                        onBlur={() => this.setState({isSearching: false})}
                        onChangeText={(text) => this.setState({search: text}) }
                        onEndEditing={() => { this.props.search(this.state.search); this.fireCallback() }}
                        value={this.state.search}
                        lightTheme
                        containerStyle={{backgroundColor:'transparent', borderWidth:0}}
                        inputStyle={{backgroundColor:'white', borderColor:'black', borderWidth:0.5}}
                        />;


        let texts = ['Restaurant', 'Bar', 'Fun'];
        let searchButtons = texts.map((text) =>
            <TouchableOpacity key={text} onPress={() => {this.props.search(text); this.fireCallback();}}>
                <Text key={text} style={{ borderRadius:6, backgroundColor: 'white', margin:4, paddingLeft:4, paddingRight:4, padding:2, borderColor:'black', borderWidth:0.5}}>{text}</Text>
            </TouchableOpacity>);
        let quickSearches = <View style={{flexDirection:'row', paddingLeft:10}}>{searchButtons}</View>;

        if (this.state.floating)
        {
            return (<View style={{position:'absolute', top:0, right:0,left:0,bottom:0, height:(this.state.isSearching ? 100: 50), zIndex:1}}>
                        <View style={{flexDirection:'column'}}>
                            {bar}
                            {this.state.isSearching ? quickSearches : null}
                        </View>
                    </View>);
        }
        else
        {
            return (<View>{bar}</View>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomSearchBar);