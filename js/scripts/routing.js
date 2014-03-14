


function createRouter(onRouteChangeHandler) {
    checkOnRouteChangeHandler(onRouteChangeHandler);

    // This will listen to url changes and call the appropriate function
    var directorRoutes = {
        '/' : onRouteChangeHandler.onGoToHome,
        '/profile/:profileURL' : function(profileURL) {
            var profileURLdecoded = routeHashCodec.decode(profileURL);
            onRouteChangeHandler.onVisitProfile(profileURLdecoded);
        }
    };

    // Documentation here: https://github.com/flatiron/director
    var directorRouter = Router(directorRoutes);
    directorRouter.configure({
        html5history: false,
        notfound: function() {
            console.error("ROUTE NOT FOUND!, hash="+window.location.hash+" and arguments=" +JSON.stringify(arguments))
            window.location.hash = "/";
        },
        on: function() {
            console.debug("Route is found, hash="+window.location.hash+" and arguments=" +JSON.stringify(arguments))
        }
    });
    directorRouter.init();
    if ( !window.location.hash ) {
        console.debug("Redirecting to default hash route #/");
        window.location.hash = "/";
    }
    return directorRouter;
}


/**
 * This will permit to change the current route in the application
 * @returns {{goToHome: goToHome, visitProfile: visitProfile}}
 */
function RouteHelper() {
    this.goToHome = function() {
        console.debug("goToHome");
        window.location.hash = '/';
    };
    this.visitProfile = function(profileURL) {
        console.debug("visitProfile " + profileURL);
        window.location.hash = '/profile/'+routeHashCodec.encode(profileURL);
    };
}



/**
 * Ensure the onRouteChangeHandler provide a callback for all the route changes
 * @param onRouteChangeHandler
 */
function checkOnRouteChangeHandler(onRouteChangeHandler) {
    console.assert( onRouteChangeHandler, "onRouteChangeHandler should be provided");
    console.assert(
        _.isFunction(onRouteChangeHandler.onGoToHome) && onRouteChangeHandler.onGoToHome.length == 0,
        "onRouteChangeHandler.onGoToHome() function should be provided. routingObject=" + onRouteChangeHandler
    );
    console.assert(
        _.isFunction(onRouteChangeHandler.onVisitProfile) && onRouteChangeHandler.onVisitProfile.length == 1,
        "onRouteChangeHandler.onVisitProfile(url) function should be provided. routingObject=" + onRouteChangeHandler
    );
}







// see https://github.com/flatiron/director/issues/220
// we use hex because urlencode of uris doesn't always work with Flatiron Director
var routeHashCodec = {
    encode: function(text) {
        // return encodeURIComponent(text);
        return asc2hex(text);
    },
    decode: function(encodedText) {
        // return decodeURIComponent(encodedText);
        return hex2asc(encodedText);
    }
}


// From http://jalaj.net/blog/2012/09/13/hex-to-from-ascii-in-javascript/
function asc2hex(pStr) {
    tempstr = '';
    for (a = 0; a < pStr.length; a = a + 1) {
        tempstr = tempstr + pStr.charCodeAt(a).toString(16);
    }
    return tempstr;
}
function hex2asc(pStr) {
    tempstr = '';
    for (b = 0; b < pStr.length; b = b + 2) {
        tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
    }
    return tempstr;
}