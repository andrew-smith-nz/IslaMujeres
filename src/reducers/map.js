import { SET_ACTIVE_LOCATION } from '../actions/map.js'
import { SET_HIGHLIGHTED_LOCATIONS } from '../actions/map.js'

export function setActiveLocation(state = { id: '', recenterMap: false }, action)
{
    switch(action.type)
    {
        case SET_ACTIVE_LOCATION: 
            return { id: action.id, recenterMap: action.recenterMap };
        default:
            return state;
    }
}

export function setHighlightedLocations(state = { ids: '' }, action)
{
    switch(action.type)
    {
        case SET_HIGHLIGHTED_LOCATIONS: 
            return { ids: action.ids };
        default:
            return state;
    }
}