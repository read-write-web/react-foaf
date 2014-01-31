require.config({
    baseUrl: "/assets/react-foaf/js",
    //deps: ["main"],

    paths: {
        "jquery": "lib/jquery-2.1.0.min",
        "react": "lib/react-0.8.0",
        "reactAddons": "lib/react-with-addons-0.8.0",
        "JSXTransformer": "lib/JSXTransformer",
        "jsx": "jsx",
        "underscore":"lib/underscore",
        "lodash": "lib/lodash.underscore",
        "preconditions": "lib/preconditions",
        "rx": "lib/rx",
        "rxAsync": "rlib/x.async",
        "q": "lib/q",
        "rdflib": "lib/rdflib",
        "StampleRdfibutils": "lib/Stample.rdfibutils",
        "pointedGraph": "lib/pointedGraph",
        "fetcherWithPromise": "lib/fetcherWithPromise",
        "director": "lib/director",
        "pgUtils": "lib/pgUtils",
        "foafUtils": "lib/foafUtils",
        "httpUtils": "lib/httpUtils",

        "mixins": "scripts/mixins",
        "routing": "scripts/routing",
        "AppConfig": "scripts/AppConfig",
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
        "PersonContacts": "scripts/scripts/contacts/PersonContacts",
        "SearchBox": "scripts/scripts/contacts/SearchBox",

        "PersonBasicInfo": "scripts/person/PersonBasicInfo",
        "PersonNotifications": "scripts/person/PersonNotifications",
        "PersonMessage": "scripts/person/PersonMessage",
        "PersonMoreInfo": "scripts/person/PersonMoreInfo",
        "PersonAddress": "scripts/person/PersonAddress",
        "PersonWebId": "scripts/person/PersonWebId",
        "PersonWebId": "scripts/person/PersonWebId",
        "Person": "scripts/person/Person"


    },

    shim: {
        JSXTransformer: {
            exports: "JSXTransformer"
        }
    }
});

require(['jquery', 'react', 'rdflib', 'pointedGraph', 'jsx!scripts/App'], function ($, React, $rdf, PointedGraph, App) {
    console.log(React)
    console.log(App)

    // proxy
//$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
//$rdf.Fetcher.homeServer = "http://localhost:9000/";
//$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
//$rdf.Fetcher.onlyUseProxy = false;

// Level of logs in external libs.
    $rdf.PointedGraph.setLogLevel("warning");

    var foafSpec = "http://xmlns.com/foaf/spec/";
    var store = new $rdf.IndexedFormula();
    var fetcherTimeout = 10000; // TODO this doesn't work because of https://github.com/linkeddata/rdflib.js/issues/30
    $rdf.fetcher(store, fetcherTimeout, true); // this makes "store.fetcher" variable available

//var foafDocURL = "http://bblfish.net/people/henry/card#me";
//var foafDocURL = "https://my-profile.eu/people/deiu/card#me";
    var foafDocURL = "https://localhost:8443/2013/backbone#me";


// TODO need to add hash if needed: we do not look for primary topic anymore
//var foafDocURL = "https://my-profile.eu/people/mtita/card";// Not working
//var foafDocURL = "http://presbrey.mit.edu/foaf";
//var foafDocURL = 'https://localhost:8443/2013/backbone';
//var foafDocURL = "https://my-profile.eu/people/tim/card";
//var foafDocURL = "https://my-profile.eu/people/deiu/card";


// maybe this should be injected as props???
    var routeHelper = new RouteHelper();



    Q.longStackSupport = true;


/*    // Mount the JSX component in the app container
    React.renderComponent(
     Timer({start: start}),
     document.getElementById('js-app-container'));
*/

    //var appComponent =  <App />;
    var mountNode = document.getElementById('container');
    React.renderComponent(App(null), mountNode);

    /*
    window.onload = function startApplication() {
        console.log('Start Application :::::::::::::::::::::::::::::::::::::::::');
        React.renderComponent(App(null), mountNode);
    };
    */

});