/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgViewListDesign = require('ui/ui_pgViewList');
const Image = require("sf-core/ui/image");
const addChild = require("@smartface/contx/lib/smartface/action/addChild");
const Color = require("sf-core/ui/color");
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Application = require("sf-core/application");
const ListView = require('sf-core/ui/listview');
const ListViewItem = require('sf-core/ui/listviewitem');
const Label = require('sf-core/ui/label');
const FlexLayout = require('sf-core/ui/flexlayout');
const TextAlignment     = require("sf-core/ui/textalignment");

var titleSet = [{
      title: "Title 1"
    }, {
        title: "Title 2"
    }, {
        title: "Title 3"
    }, {
        title: "Title 4"
    }, {
        title: "Title 5"
    }, {
        title: "Title 6"
    }, {
        title: "Title 7"
    }, {
        title: "Title 8"
    }, {
        title: "Title 9"
    }, {
        title: "Title 10"
    }, {
        title: "Title 20"
    }, {
        title: "Title 30"
    }, {
        title: "Title 40"
    }, {
        title: "Title 50"
    }, {
        title: "Title 60"
    }, {
        title: "Title 70"
    }, {
        title: "Title 80"
    }, {
        title: "Title 90"
    }];
    

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
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
  
  /*this.headerBar.dispatch({
      type: "updateUserStyle",
      userStyle: {
          visible: true
      }
  });*/
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
    initListView(page.lv1);
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
    listView.flexGrow  = 1,
    listView.rowHeight = 60;
    listView.itemCount = titleSet.length;
    listView.backgroundColor = Color.LIGHTGRAY,

    listView.onRowBind = function(listViewItem, index) {
        listViewItem.myLabelTitle.text = titleSet[index].title;
    };

    listView.onPullRefresh = function() {
        listView.stopRefresh();
    };

    listView.onRowCreate = function(){
        var myListViewItem = new ListViewItem();
        var myLabelTitle = new Label({
            height: 40,
            width: 100,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            textAlignment : TextAlignment.MIDCENTER
        });
        myListViewItem.addChild(myLabelTitle);
        myListViewItem.myLabelTitle = myLabelTitle;
    
        return myListViewItem;
    };

    listView.refreshData();
}


module.exports = PgViewList;