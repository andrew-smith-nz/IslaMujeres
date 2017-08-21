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
import SearchBar from './searchBar.js';
import SearchResult from './searchResult.js';
import Reactotron from 'reactotron-react-native'
import LocationInfo from './locationInfo.js'
import { bindActionCreators, connect } from 'react-redux';
import { search } from '../actions/search.js';
import { setActiveLocation, setHighlightedLocations } from '../actions/map.js';
import Icon from 'react-native-vector-icons/FontAwesome';


// Search shortcuts (filter according to time of day)
/* Breakfast
Lunch
Dinner
Drinks
Nightclubs
Snacks
 */

 // sort results by Distance (then deals), Rating, Deals (then distance)
function mapStateToProps(state) { return { searchTerms: state.search.searchTerms }}
function mapDispatchToProps (dispatch) { return { 
	search: (searchTerms) => dispatch(search(searchTerms)), 
	setActiveLocation: (id) => dispatch(setActiveLocation(id, true)), 
	setHighlightedLocations: (ids) => dispatch(setHighlightedLocations(ids)) 
} }

class Search extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name="search" size={16} color={'white'} />
        ),
      };
	  
	constructor(props)
	{
		super(props);
		this.loadSearchResults = this.loadSearchResults.bind(this);
		this.mapAllResults = this.mapAllResults.bind(this);
		let searchTerms = this.props.navigation.state.params ? this.props.navigation.state.params.searchTerms : "";
		this.state = { 
			search:this.props.searchTerms,
			searchResults:<Text />,
		};
	}	
	
	componentWillMount()
	{
		//this.loadSearchResults();
	}

	loadSearchResults()
	{
		var customData = require('../../features.json');
		var resultJSX = [];
		var resultFeatures = [];
		if (!this.props.searchTerms.length) 
			return (<View />);
		for (let i = 0; i < customData.features.length; i++)
		{
			if (customData.features[i].properties.label.toLowerCase().contains(this.props.searchTerms.toLowerCase()))
			//	|| customData.features[i].properties.Type.toLowerCase().contains(this.state.search.toLowerCase()))
			{
				resultFeatures.push(customData.features[i]);
			}
		}
		resultJSX = resultFeatures.map(feature => { return (
			<TouchableOpacity onPress={() => this.mapResult(feature)} key={'th' + feature.id}>
				<LocationInfo id={feature.id}  />
			</TouchableOpacity>)});
		return resultJSX;
		//if (resultJSX.length == 0) 
		//	this.setState({searchResults: <Text style={{marginTop: 20, textAlign: 'center', fontSize:16}}>No results found</Text>, searchResultFeatures: []})
		//else
		//	this.setState({searchResults: resultJSX, searchResultFeatures: resultFeatures});
	}
	
	mapResult(result) {
		//this.props.navigation.navigate('Map', { markedLocationIds: [ result.id ], selectedLocationId: result.id });
		this.props.setActiveLocation(result.id, true);
		this.props.navigation.navigate('Map');
	}

	mapAllResults(resultFeatures) {
		//this.props.navigation.navigate('Map', { markedLocationIds: resultFeatures.map(r => r.id), selectedLocationId: null });
		this.props.setActiveLocation(resultFeatures[0].id, false);
		this.props.setHighlightedLocations(resultFeatures.map((f) => { return f.id }));
		this.props.navigation.navigate('Map');
	}
	
	render() {
		var customData = require('../../features.json');
		var resultJSX = [];
		var resultFeatures = [];
		if (this.props.searchTerms)
		{
			for (let i = 0; i < customData.features.length; i++)
			{
				if (customData.features[i].properties.label.toLowerCase().contains(this.props.searchTerms.toLowerCase()))
				//	|| customData.features[i].properties.Type.toLowerCase().contains(this.state.search.toLowerCase()))
				{
					resultFeatures.push(customData.features[i]);
				}
			}
			resultJSX = resultFeatures.map(feature => { return (
				<TouchableOpacity onPress={() => this.mapResult(feature)} key={'th' + feature.id}>
					<LocationInfo id={feature.id}  />
				</TouchableOpacity>)});
		}
		else
		{
			resultJSX.push(<View key={null}/>);
		}
		return (<View>
					<SearchBar floating={false} />
					<ScrollView style={{height:'78%'}}>
							{resultJSX.length > 0 ? resultJSX : <Text style={{marginTop: 20, textAlign: 'center', fontSize:16}}>No results found</Text>}
					</ScrollView>
					{resultFeatures.length > 0 ? 
						<TouchableOpacity onPress={() => this.mapAllResults(resultFeatures)}>
							<Text style={{backgroundColor:'#dddddd', textAlign:'center', height:'22%', padding:5, margin:5, borderWidth:0.5, borderColor:'black', borderRadius:8}}>Show Results on Map</Text>
						</TouchableOpacity> 
					: null}
				</View>);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);