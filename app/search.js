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
import SearchBar from './searchBar.js';
import SearchResult from './searchResult.js';
import Reactotron from 'reactotron-react-native'
import LocationInfo from './locationInfo.js'

// Search shortcuts (filter according to time of day)
/* Breakfast
Lunch
Dinner
Drinks
Nightclubs
Snacks
 */

 // sort results by Distance (then deals), Rating, Deals (then distance)


export default class Search extends Component {
	constructor(props)
	{
		super(props);
		this.loadSearchResults = this.loadSearchResults.bind(this);
		this.mapAllResults = this.mapAllResults.bind(this);
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
		this.loadSearchResults();
	}

	loadSearchResults()
	{
		var customData = require('../features.json');
		var resultJSX = [];
		var resultFeatures = [];
		for (let i = 0; i < customData.features.length; i++)
		{
			if (customData.features[i].properties.label.toLowerCase().contains(this.state.search.toLowerCase()))
			//	|| customData.features[i].properties.Type.toLowerCase().contains(this.state.search.toLowerCase()))
			{
				resultFeatures.push(customData.features[i]);
			}
		}
		resultJSX = resultFeatures.map(feature => { return (
			<TouchableOpacity onPress={() => this.mapResult(feature)} key={'th' + feature.id}>
				<LocationInfo id={feature.id}  />
			</TouchableOpacity>)});
		if (resultJSX.length == 0) 
			this.setState({searchResults: <Text style={{marginTop: 20, textAlign: 'center', fontSize:16}}>No results found</Text>, searchResultFeatures: []})
		else
			this.setState({searchResults: resultJSX, searchResultFeatures: resultFeatures});
	}
	
	mapResult(result) {
		this.props.navigation.navigate('Map', { markedLocationIds: [ result.id ], selectedLocationId: result.id });
	}

	mapAllResults() {
		this.props.navigation.navigate('Map', { markedLocationIds: this.state.searchResultFeatures.map(r => r.id), selectedLocationId: null });
	}
	
  render() {
    return (<View>
				<SearchBar floating={false} callback={(searchTerms) => { this.setState({search: searchTerms}, this.loadSearchResults)}} searchTerms={this.state.search} />
				  <ScrollView>
						{this.state.searchResults}
				  </ScrollView>
					<TouchableOpacity onPress={this.mapAllResults}>
						<Text>Show all on map</Text>
					</TouchableOpacity>
			</View>);
  }
}


AppRegistry.registerComponent('Search', () => Search);