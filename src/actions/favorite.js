export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export function toggleFavorite(id)
{
    return {
            type:TOGGLE_FAVORITE,
            id,
        };
}