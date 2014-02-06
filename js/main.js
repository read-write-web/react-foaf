require.config({
    //baseUrl: "js",
    //deps: ["main"],

    paths: {

        /*
        * Libs
        * */

        "jquery": "lib/jquery-2.1.0.min",
        "react": "lib/react-0.8.0",
        "reactAddons": "lib/react-with-addons-0.8.0",
        "JSXTransformer": "lib/JSXTransformer",
        "jsx": "jsx",
        "underscore":"lib/underscore",
        "lodash": "lib/lodash.underscore",
        "rx": "lib/rx",
        "rxAsync": "lib/x.async",
        "q": "lib/q",
        "rdflib": "lib/rdflib/rdflib-stample-0.1.0",
        "rdflib-pg-extension": "lib/rdflib/rdflib-stample-pg-extension-0.1.0",
        "director": "lib/director",


        /*
        * Utils
        * */

        "foafUtils": "scripts/foafUtils",
        "httpUtils": "scripts/httpUtils",

        "mixins": "scripts/mixins",
        "routing": "scripts/routing",
        "PGReact": "scripts/PGReact",


        /*
        *    REACT Components.
        * */

        "App": "scripts/App",
        "Window": "scripts/windows/Window",
        "FoafWindow": "scripts/windows/FoafWindow",
        "MainSearchBox": "scripts/layout/MainSearchBox",
        "ContentSpace": "scripts/layout/ContentSpace",
        "FooterItem": "scripts/layout/FooterItem",

        "Pix": "scripts/common/Pix",
        "PersonContactOnProfileBasicInfo": "scripts/contacts/PersonContactOnProfileBasicInfo",
        "PersonContactOnProfileMoreInfo": "scripts/contacts/PersonContactOnProfileMoreInfo",
        "PersonContactOnProfileNotifications": "scripts/contacts/PersonContactOnProfileNotifications",
        "PersonContactOnProfileMessage": "scripts/contacts/PersonContactOnProfileMessage",
        "PersonContactOnProfilePix": "scripts/contacts/PersonContactOnProfilePix",
        "PersonContactOnProfile": "scripts/contacts/PersonContactOnProfile",
        "PersonContactOnProfileJumpWrapper": "scripts/contacts/PersonContactOnProfileJumpWrapper",
        "PersonContacts": "scripts/contacts/PersonContacts",
        "SearchBox": "scripts/contacts/SearchBox",

        "PersonBasicInfo": "scripts/person/PersonBasicInfo",
        "PersonNotifications": "scripts/person/PersonNotifications",
        "PersonMessage": "scripts/person/PersonMessage",
        "PersonMoreInfo": "scripts/person/PersonMoreInfo",
        "PersonAddress": "scripts/person/PersonAddress",
        "PersonWebId": "scripts/person/PersonWebId",
        "PersonEditProfile": "scripts/person/PersonEditProfile",
        "Person": "scripts/person/Person"


        /*
        * CSS : Use less.
        * */



    },

    shim: {
        JSXTransformer: {
            exports: "JSXTransformer"
        },

        "rdflib-pg-extension": {
            "deps": ["rdflib","q","underscore"],
            "exports":"$rdf.PG"
        },

        "foafUtils": {
            "exports":"foafUtils"
        },

        "httpUtils": {
            "exports":"httpUtils"
        }

        /*
        "reactAddons": {
            "exports":"React.addons"
        }*/

    }
});

require([
    "jquery",
    "react",
    "rdflib",
    "rdflib-pg-extension",
    "q",
    "routing",
    "jsx!App"],
    function ($, React, rdflib, rdflibPg, Q, routing, App) {

        // Make these variable globals.
        window.Q = Q; //TODO: find better way to deal with Q

        // Globals for imgs.
        avatar = "img/avatar.png";
        friendIcon = 'img/friends_icon_yellow.png';
        closeIcon = 'img/close_icon.png';
        webIdIcon = 'img/webid.png';

        // proxy
        //$rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "https://www.stample.io/srv/cors?url=";
        //$rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
        //$rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "http://data.fm/proxy?uri=";
        //$rdf.Fetcher.homeServer = "http://localhost:9000/"

        window.foafSpec = "http://xmlns.com/foaf/spec/"; // Do I need this?


        var fetcherTimeout = 4000;

        // TODO fix global variable issue :(
        store = rdflibPg.createNewStore(fetcherTimeout);

        // Set the bootstrap URL with the initial PG pointer.
        // TODO bad !!!
        if ( window.initialPG ) {
            foafDocURL = initialPG.pointer.uri;
        } else {
            foafDocURL = "http://bblfish.net/people/henry/card#me";
            //var foafDocURL = "https://my-profile.eu/people/deiu/card#me";
            //foafDocURL = "https://localhost:8443/2013/backbone#me";
            // TODO need to add hash if needed: we do not look for primary topic anymore
            //var foafDocURL = "https://my-profile.eu/people/mtita/card";// Not working
            //var foafDocURL = "http://presbrey.mit.edu/foaf";
            //var foafDocURL = 'https://ameliemelo3.localhost:8443/card';
            //var foafDocURL = "https://my-profile.eu/people/tim/card";
            //var foafDocURL = "https://my-profile.eu/people/deiu/card";
        }


        // maybe this should be injected as props???
        routeHelper = new RouteHelper();

        // ???
        Q.longStackSupport = true;

        // Launch the App.
        var mountNode = document.getElementById('container');
        React.renderComponent(App({profileURL:foafDocURL}), mountNode);

});