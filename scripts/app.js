/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");
const OS = require('sf-core/device/system').OS;

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: e.type || lang.applicationError,
        message: OS === "Android" ? e.stack : (e.message + "\n\n*" + e.stack)
    });
};

require("sf-extension-utils");
require("./theme");
const Network = require("sf-core/device/network");
var notifier = new Network.createNotifier();

notifier.subscribe((connectionType) => {
    if (connectionType === Network.ConnectionType.NONE) {
        alert("No Network Connection");
    }
});

const {
    NativeRouter: Router,
    Router: RouterBase,
    NativeStackRouter: StackRouter,
    BottomTabBarRouter,
    Route
} = require("@smartface/router");

const router = Router.of({
    path: "/",
    isRoot: true,
    routes: [
        StackRouter.of({
            path: "/pages",
            to: "/pages/pgViewList",
            headerBarParams: () => { ios: { translucent: false } },
            routes: [
                Route.of({
                    path: "/pages/pgViewList",
                    build: (router, route) => {
                        const { routeData, view } = route.getState();
                        let pgViewList = require("./pages/pgViewList");
                        return new pgViewList(routeData, router);
                    }
                })
            ]
        })
    ]
});

router.push("/pages");
