const System = require("sf-core/device/system");
const getNewsByCategory = require("../service/index").getNewsByCategory;
const categories = require("../categories").all;
const constants = require("../constants");
const CATEGORIES_TO_FETCH = constants.CATEGORIES_TO_FETCH;
const GALLERY_ITEM_ACTION = constants.GALLERY_ITEM_ACTION;

var fetchNews = (function() {
    var news = {};
    var lastIndex = 0;
    // Fetch CATEGORIES_TO_FETCH categories at a time
    return function fetchNews() {
        var categoriesToBeFetched = categories.slice(lastIndex, lastIndex += CATEGORIES_TO_FETCH);
        if (lastIndex>=categories.length) lastIndex = 0; //added 12.01.2019 by Süleyman
        //console.log(categories.length+" "+lastIndex);
        var promises = categoriesToBeFetched.map(c => getNewsByCategory(c));
        var shouldFetch = categoriesToBeFetched.length > 0;
        return new Promise((resolve, reject) => {
            if (!shouldFetch) {
                /*an error occurs after 4th time so I added a line to 
                assign zero to lastIndex when it is more than or equal to 
                categories.length */
                return resolve();
            }    
            Promise
                .all(promises)
                .then(fetchedNews => {
                    fetchedNews
                        .forEach((fetchedNew, index) => {
                            var category = categoriesToBeFetched[index];
                            news[category] = fetchedNew;
                            
                            // IS USED TO TEST PERFORMANCE, MAY BE REMOVED
                            //var duplicatedNews = [];
                            //for (let i = 0; i < 10; ++i) {
                            //    duplicatedNews = duplicatedNews.concat(fetchedNew);
                            //}
                            //news[category] = duplicatedNews;
                            // IS USED TO TEST PERFORMANCE, MAY BE REMOVED

                            //console.log(`${category} ${JSON.stringify(fetchedNew)}`);
                        });
                    //console.log(news);    
                    resolve(news);
                })
                .catch(error => {
                    reject(`Request Failed. Reason: ${JSON.stringify(error)}`);
                });
        });
    };
})();


function findImageUrlByIndex(news, index) {
    var currentNew = news[index];
    var image = currentNew &&
        currentNew.multimedia[currentNew.multimedia.length - 1]; // Use highest resolution image
    return image && image.url;
}

function capitalizeFirstLetter(str) {
    return str.replace(/^\w/, c => c.toUpperCase());
}


function showDeleteMenu(page) {
    
    return new Promise((resolve, reject) => {
        var menu = new Menu();
        var menuItemShow = new MenuItem({
            title: "Show"
        });
        var menuItemDelete = new MenuItem({
            title: "Delete"
        });
        var menuItemCancel = new MenuItem({
            title: "Cancel"
        });

        menuItemShow.ios.style = MenuItem.ios.Style.DEFAULT;
        menuItemDelete.ios.style = MenuItem.ios.Style.DESTRUCTIVE;
        menuItemCancel.ios.style = MenuItem.ios.Style.CANCEL;

        menuItemShow.onSelected = function() {
            
            resolve(GALLERY_ITEM_ACTION.SHOW);
        };

        menuItemDelete.onSelected = function() {
            resolve(GALLERY_ITEM_ACTION.DELETE);
        };

        menuItemCancel.onSelected = function() {
            resolve(GALLERY_ITEM_ACTION.CANCEL);
        };

        menu.items = (System.OS === "iOS") ? [menuItemShow, menuItemDelete, menuItemCancel] : [menuItemShow, menuItemDelete];
        
        menu.show(page);
        
    });
}

module.exports = {
    findImageUrlByIndex,
    fetchNews,
    capitalizeFirstLetter,
    showDeleteMenu
};
