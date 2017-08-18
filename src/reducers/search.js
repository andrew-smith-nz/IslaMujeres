import { SEARCH } from '../actions/search.js'
import Reactotron from 'reactotron-react-native'

export function search(state = { searchTerms: '' }, action)
{
    switch(action.type)
    {
        case SEARCH: 
            Reactotron.log("Updating search terms to [" + action.searchTerms + "]")
            return { searchTerms: action.searchTerms };
        default:
            return state;
    }
}