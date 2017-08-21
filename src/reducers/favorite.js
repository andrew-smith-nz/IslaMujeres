import { TOGGLE_FAVORITE } from '../actions/favorite.js'
import Reactotron from 'reactotron-react-native'

export function toggleFavorite(state = { favorites: [] }, action)
{
    //Reactotron.log("Favorites reducer, action = " + action.type);
    switch(action.type)
    {
        case TOGGLE_FAVORITE: 
            let done = false;
            let newFavorites = [];
            for (i = 0; i < state.favorites.length; i++)
            {
                if (state.favorites[i] !== action.id)   
                    newFavorites.push(state.favorites[i]);
                else
                    done = true;
            }
            if (!done)
                newFavorites.push(action.id);            
            return { favorites: newFavorites };
        default:
            return state;
    }
}