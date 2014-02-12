
AppStarter = {

    /**
     * Initialize the application
     *  // TODO this pg attr is library dependent, should rather be an url or an RDF document body serialized
     * @param pointedGraph the initial pointed graph
     * @param currentScriptUrl: required to resolve relative paths of other JS files to load
     */
    initialize : function(pointedGraph,currentScriptUrl) {
        var self = this
        console.debug("Initializing with PG=",pointedGraph);
        var appBaseUrl = this.getAppBaseUrl(currentScriptUrl);
        console.debug("Will use appBaseUrl=",appBaseUrl);

        var requireJsUrl = appBaseUrl+"/js/lib/require/require.js"
        this.loadScript(requireJsUrl,function() {
            self.startRequire(appBaseUrl,pointedGraph);
        })
    },

    /**
     * Triggers the dynamic loading of a new JS file
     * @param scriptSrc
     * @param callback
     */
    loadScript: function(scriptSrc, callback) {
        var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = scriptSrc;
        // Then bind the event to the callback function.
        oScript.onreadystatechange = callback;   // IE 6 & 7
        oScript.onload = callback;
        oHead.appendChild(oScript);
    },

    /**
     * The baseUrl is the absolute path of the folder of the app.
     * We can't use the html baseUrl to resolve paths because.
     *
     * @param scriptUrl
     * @return baseUrl (doesn't end with a / )
     */
    getAppBaseUrl: function(currentScriptUrl) {
        if ( currentScriptUrl && currentScriptUrl.indexOf(".js") != -1 && currentScriptUrl.indexOf("/") != -1 ) {
            var scriptFolder = currentScriptUrl.substr( 0 , currentScriptUrl.lastIndexOf("/") );
            return scriptFolder;
        }
        else {
            throw new Error("Bad or missing scriptUrl attribute: "+currentScriptUrl + " . " +
                "It is required to start the app with AppStarter.initialize(pg,currentScriptUrl)." +
                "Note currentScriptUrl should at least contain one / so you can use ./AppStarter.js but not AppStarter.js");
        }
    },

    /**
     * Start require
     * @param appBaseUrl
     * @param pg
     */
    startRequire: function(appBaseUrl, pointedGraph) {

        require.config({
            baseUrl: appBaseUrl,

            map: {
                "*": {
                    // doesn't work well if declared with "paths"
                    "less": "js/lib/require/require-less-0.1.1/less"
                }
            },

            paths: {

                /*
                 * RequireJS Plugins
                 */
                "jsx": "js/lib/require/require-jsx/jsx",
                "JSXTransformer": "js/lib/require/require-jsx/JSXTransformer",


                /*
                 * Libs
                 */
                "jquery": "js/lib/jquery-2.1.0.min",
                "react": "js/lib/react-0.8.0",
                "reactAddons": "js/lib/react-with-addons-0.8.0",
                "underscore":"js/lib/underscore",
                "lodash": "js/lib/lodash.underscore",
                "rx": "js/lib/rx",
                "rxAsync": "js/lib/rx.async",
                "q": "js/lib/q",
                "director": "js/lib/director",
                "noty": "js/lib//notifications/jquery-noty",
                "notyLayout": "js/lib/notifications/layouts/topcenter",
                "notyTheme": "js/lib/notifications/themes/default",

                // For now we use the link of github js to be able to stay up to date with the rdflib-stample-pg-extension -->
                "rdflib": "https://rawgithub.com/stample/rdflib-pg-extension/master/releases/0.1.0/rdflib-stample-0.1.0",
                "rdflib-pg-extension": "https://rawgithub.com/stample/rdflib-pg-extension/master/releases/0.1.0/rdflib-stample-pg-extension-0.1.0",
                //"rdflib": "js/lib/rdflib/rdflib-stample-0.1.0",
                //"rdflib-pg-extension": "js/lib/rdflib/rdflib-stample-pg-extension-0.1.0",

                "globalRdfStore": "js/scripts/globalRdfStore",

                /*
                 * Utils
                 */
                "foafUtils": "js/scripts/foafUtils",
                "PGUtils": "js/scripts/PGUtils",
                "notify": "js/scripts/notify",

                "mixins": "js/scripts/mixins",
                "routing": "js/scripts/routing",
                "PGReact": "js/scripts/PGReact",


                /*
                 *    REACT Components.
                 */
                "App": "js/scripts/App",
                "Window": "js/scripts/windows/Window",
                "FoafWindow": "js/scripts/windows/FoafWindow",
                "MainSearchBox": "js/scripts/layout/MainSearchBox",
                "ContentSpace": "js/scripts/layout/ContentSpace",
                "FooterItem": "js/scripts/layout/FooterItem",

                "Pix": "js/scripts/common/Pix",
                "PersonContactOnProfileBasicInfo": "js/scripts/contacts/PersonContactOnProfileBasicInfo",
                "PersonContactOnProfileMoreInfo": "js/scripts/contacts/PersonContactOnProfileMoreInfo",
                "PersonContactOnProfileNotifications": "js/scripts/contacts/PersonContactOnProfileNotifications",
                "PersonContactOnProfileMessage": "js/scripts/contacts/PersonContactOnProfileMessage",
                "PersonContactOnProfilePix": "js/scripts/contacts/PersonContactOnProfilePix",
                "PersonContactOnProfile": "js/scripts/contacts/PersonContactOnProfile",
                "PersonContactOnProfileJumpWrapper": "js/scripts/contacts/PersonContactOnProfileJumpWrapper",
                "PersonContacts": "js/scripts/contacts/PersonContacts",
                "SearchBox": "js/scripts/contacts/SearchBox",

                "PersonBasicInfo": "js/scripts/person/PersonBasicInfo",
                "PersonNotifications": "js/scripts/person/PersonNotifications",
                "PersonMessage": "js/scripts/person/PersonMessage",
                "PersonMoreInfo": "js/scripts/person/PersonMoreInfo",
                "PersonAddress": "js/scripts/person/PersonAddress",
                "PersonWebId": "js/scripts/person/PersonWebId",
                "PersonEditProfile": "js/scripts/person/PersonEditProfile",
                "Person": "js/scripts/person/Person",


                /*
                 * Static assets
                 */
                "appImages": "js/scripts/appImages"

            },

            shim: {
                JSXTransformer: {
                    exports: "JSXTransformer"
                },

                "notyLayout": ["jquery", "noty"],
                "notyTheme": ["jquery", "noty"],

                "noty": {
                    "deps": ["jquery"],
                    "exports": "noty"
                },

                "rdflib-pg-extension": {
                    "deps": ["rdflib","q","underscore","rx","rxAsync"],
                    "exports":"$rdf.PG"
                },

                "foafUtils": {
                    "exports":"foafUtils"
                },

                 "PGUtils": {
                 "exports":"PGUtils"
                 }

            }
        });

        require(
            [
                "jquery",
                "react",
                "q",
                "globalRdfStore",
                "routing",
                "jsx!App",
                "less!css/base.less",
                "notify",
                "noty",
                "notyLayout",
                "notyTheme"
            ],
            function ($, React, Q, globalRdfStore, routing, App, baseLess, notify) {
                // Make these variable globals.
                window.Q = Q; //TODO: find better way to deal with Q


                // Set the bootstrap URL with the initial PG pointer.
                // TODO bad !!!
                var foafDocURL;
                if (pointedGraph) {
                    foafDocURL = pointedGraph.pointer.uri;
                }
                else {
                    //foafDocURL = "http://bblfish.net/people/henry/card#me";
                    //foafDocURL = "https://my-profile.eu/people/deiu/card#me";
                    //foafDocURL = "http://www-public.it-sudparis.eu/~berger_o/foaf.rdf";
                    // TODO need to add hash if needed: we do not look for primary topic anymore
                    //var foafDocURL = "https://my-profile.eu/people/mtita/card";// Not working
                    //var foafDocURL = "http://presbrey.mit.edu/foaf";
                    //var foafDocURL = 'https://ameliemelo3.localhost:8443/card';
                    //var foafDocURL = "https://my-profile.eu/people/tim/card";
                    foafDocURL = "https://localhost:8443/2013/backboneFriend3#me";
                    //foafDocURL = 'https://localhost:8443/2013/testWoAddress';
                }

                // TODO maybe this should be injected as props???
                routeHelper = new RouteHelper();


                // Launch the App.
                var mainComponent = App({
                    profileURL:foafDocURL
                });
                var mountNode = document.getElementById('container');
                React.renderComponent(mainComponent,mountNode);

            });
    }


}