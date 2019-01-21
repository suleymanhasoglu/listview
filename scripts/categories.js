// https://github.com/NYTimes/public_api_specs/blob/master/top_stories/top_stories_v2.json
module.exports = {
    all: [
        "home",
        "opinion",
        "world",
        "national",
        "politics",
        "upshot",
        "nyregion",
        "business",
        "technology",
        "health",
        "arts",
        "books",
        "movies",
        "sundayreview",
        "fashion",
        "tmagazine",
        "food",
        "magazine",
        "realestate",
        "automobiles",
        "obituaries",
        "insider"
    ],
    combined: [
        "technology", // Technology & Science
        "health", // Health & Sports
        "movies", // Movies & Theater
        "food" // Food & Travel
    ],
    combinedMap: {
        "technology": "Technology & Science",
        "health": "Health & Sports",
        "movies": "Movies & Theater",
        "food": "Food & Travel"
    }
};
