export const SEARCH = "SEARCH";

export function search(searchTerms){
    return {
        type: SEARCH,
        searchTerms
    }
}