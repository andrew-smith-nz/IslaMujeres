export const SET_ACTIVE_LOCATION = "SET_ACTIVE_LOCATION";
export const SET_HIGHLIGHTED_LOCATIONS = "SET_HIGHLIGHTED_LOCATIONS";

export function setActiveLocation(id, recenterMap)
{
    return {
            type:SET_ACTIVE_LOCATION,
            id,
            recenterMap
        };
}

export function setHighlightedLocations(ids)
{
    return {
            type:SET_HIGHLIGHTED_LOCATIONS,
            ids
        };
}