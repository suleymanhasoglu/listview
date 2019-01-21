const Http = require("sf-core/net/http");
const REQUEST_DELAY = 500;
const TOO_MANY_REQUESTS = 429;
const AVAILABLE_CATEGORIES = require("../categories").all;

// If API_KEY expires, you can get a new one from http://developer.nytimes.com/signup
const API_KEY = "UVoMmQipSo0qHuC4Y7XjsnXzsAsCPTtY";

var getNewsByCategory = (function() {
    var newsByCategoryMap = {};

    return function getNewsByCategory(category) {
        //if (!AVAILABLE_CATEGORIES.includes(category)) {
        //	throw `Unexpected category ${category}`;
        //}

        return new Promise((resolve, reject) => {
            if (newsByCategoryMap[category]) {
                return resolve(newsByCategoryMap[category]);
            }

            var http = new Http();
            http.request({
                "url": `http://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${API_KEY}`,
                "method": "GET",
                onLoad: function(e) {
                    try {
                        var response = e.body.toString();
                        response = JSON.parse(response);
                        response = response.results;
                        newsByCategoryMap[category] = response;
                        console.log(response);
                        resolve(response);
                    }
                    catch (ex) {
                        reject(ex.toString());
                    }
                },
                onError: function(e) {
                    var statusCode = e.statusCode;
                    if (statusCode === TOO_MANY_REQUESTS) {
                        getNewsByCategory(category)
                            .then(e => resolve(e))
                            .catch(e => reject(e));
                    }
                    else {
                        var errorMessage = `Server responsed with: ${e.statusCode}. Message is: ${e.message}`;
                        reject(errorMessage);
                    }
                }
            });
        });
    };
})();

function init() {
    // Cache all news
    AVAILABLE_CATEGORIES
        .forEach((category, index) => setTimeout(() => {
            getNewsByCategory(category);
        }, REQUEST_DELAY * index));
}

module.exports = { init, getNewsByCategory };
