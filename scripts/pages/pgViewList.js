/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgViewListDesign = require('ui/ui_pgViewList');
const Image = require("sf-core/ui/image");
const ImageView = require("sf-core/ui/imageview");
const addChild = require("@smartface/contx/lib/smartface/action/addChild");
const Color = require("sf-core/ui/color");
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Application = require("sf-core/application");
const ListView = require('sf-core/ui/listview');
const ListViewItem = require('sf-core/ui/listviewitem');
const fetchNews = require("../utils/index").fetchNews;
const Label = require('sf-core/ui/label');
const FlexLayout = require('sf-core/ui/flexlayout');
const TextAlignment = require("sf-core/ui/textalignment");
const TOO_MANY_REQUESTS = 429;
const Http = require("sf-core/net/http");
const REQUEST_DELAY = 500;
const categories = require("../categories").all;
const getNewsByCategory = require("../service/index").getNewsByCategory;
const findImageUrlByIndex = require("../utils/index").findImageUrlByIndex;
const dataArray = [];


const PgViewList = extend(PgViewListDesign)(
    // Constructor
    function(_super, routeData, router) {
        // Initalizes super class for this page scope
        _super(this);
        this._router = router;
        this._routeData = routeData;
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    }
);


function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    page.headerBar.itemColor = Color.create("#ffffff");
    page.headerBar.visible = true;
    page.headerBar.leftItemEnabled = true;


    //page.flindicator.visible = true;
    getNewsByCategory(categories[0])
        .then(news => {
            //page.flindicator.visible = false
            for (var j = 0; j < news.length; j++) {
                var _url = news[j].multimedia[news[j].multimedia.length - 1];
                if (_url != null && _url.copyright) {
                    dataArray.push({ isImage: false, data: _url.copyright });
                    dataArray.push({ isImage: true, data: _url.url });
                }
            }
            initListView(page.lv1);
        })
        .catch(e => alert(e));

    var myItem = new HeaderBarItem({
        title: "Smartface",
        //if any image is not put here onPress will not be activated
        image: Image.createFromFile("images://leftarrow.png"),
        onPress: () => {
            Application.exit();
        }
    });
    page.headerBar.setLeftItem(myItem); // .setLeftItem(myItem);
}


function initListView(listView) {
    listView.flexGrow = 1,
        listView.itemCount = dataArray.length;
    listView.backgroundColor = Color.LIGHTGRAY;

    listView.onPullRefresh = function() {
        listView.stopRefresh();
    };

    listView.onRowType = function(index) {
        if (dataArray[index].isImage)
            return 2
        else return 1;
    }

    listView.onRowHeight = function(index) {
        if (dataArray[index].isImage)
            return 200; //return 200;
        else return 60;
    };

    listView.onRowCreate = function(rowType) {
        if (rowType === 1) {
            let myListViewItem = new ListViewItem();
            let myLabelTitle = new Label({
                //height: 80,
                marginLeft: 10,
                marginRight: 10,
                alignSelf: FlexLayout.AlignSelf.CENTER,
                textAlignment: TextAlignment.MIDCENTER
            });
            myListViewItem.addChild(myLabelTitle);
            myListViewItem.myLabelTitle = myLabelTitle;
            return myListViewItem;
        }
        else if (rowType === 2) {
            var flexLayout1 = new FlexLayout({
                id: 101,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                positionType: FlexLayout.PositionType.RELATIVE,
                flexDirection: FlexLayout.FlexDirection.ROW
            });

            var myImageView = new ImageView({
                id: 104,
                image: "images://smartface.png",
                flexGrow: 1,
                imageFillType: ImageView.FillType.STRETCH,
            });
            flexLayout1.addChild(myImageView);
            flexLayout1.myImageView = myImageView;
            var myListViewItem = new ListViewItem();
            myListViewItem.addChild(flexLayout1);
            myListViewItem.flexLayout1 = flexLayout1;
            return myListViewItem;
        }

    };

    listView.onRowBind = function(listViewItem, index) {
        if (dataArray[index].isImage) {
            let flexLayout1 = listViewItem.findChildById(101);
            let listImage = flexLayout1.myImageView;
            listImage.height = listViewItem.height;
            listImage.width = listViewItem.width;
            listImage.loadFromUrl(dataArray[index].data);
        }
        else {
            listViewItem.backgroundColor = Color.create("#c9dfe5");
            listViewItem.myLabelTitle.text = dataArray[index].data;
        }
    };

    listView.refreshData();
}


module.exports = PgViewList;
