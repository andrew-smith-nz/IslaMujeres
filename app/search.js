import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TabNavigator}  from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import SearchResult from './searchResult.js';
import Reactotron from 'reactotron-react-native'
import LocationInfo from './locationInfo.js'

export default class Search extends Component {
	constructor(props)
	{
		super(props);
		this.setSearchResults = this.setSearchResults.bind(this);
		this.state = { 
					search:this.props.navigation.state.params.searchTerms,
					searchResults:<Text />,
		};
	}	
	
	static navigationOptions = {
		tabBarLabel: 'Search',		
	}
	
	componentWillMount()
	{
		this.setSearchResults();
	}

	setSearchResults()
	{
		var customData = require('../features.json');
		var results = [];
		for (let i = 0; i < customData.features.length; i++)
		{
			if (customData.features[i].properties.label.toLowerCase().contains(this.state.search.toLowerCase()))
			//	|| customData.features[i].properties.Type.toLowerCase().contains(this.state.search.toLowerCase()))
			{
				results.push(
				<TouchableOpacity onPress={() => this.expand(customData.features[i])} key={'th' + customData.features[i].id}>
					<LocationInfo id={customData.features[i].id}  />
				</TouchableOpacity>);
			}
		}
		this.setState({searchResults: results});
	}
	
	expand(result) {
		Reactotron.log(result);
		this.props.navigation.navigate('Map', { selectedLocationId: result.id });
	}
	
  render() {
    return (<View>
				<SearchBar
				  placeholder='Search...'
				  round={true}
				  onChangeText={(search) => this.setState({search}) }
				  onEndEditing={() => this.setSearchResults() }
				  value={this.state.search}
				  lightTheme />
				  <ScrollView>
					{this.state.searchResults}
				  </ScrollView>
			</View>);
  }
}


AppRegistry.registerComponent('Search', () => Search);