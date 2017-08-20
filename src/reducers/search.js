import { SEARCH } from '../actions/search.js'
import Reactotron from 'reactotron-react-native'

export function search(state = { searchTerms: '' }, action)
{
    switch(action.type)
    {
        case SEARCH: 
            return { searchTerms: action.searchTerms };
        default:
            return state;
    }
}