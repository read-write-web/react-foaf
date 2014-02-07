
AppStarter = {

    /**
     * Initialize the application
     *  // TODO this pg attr is library dependent, should rather be an url or an RDF document body serialized
     * @param pg the initial pointed graph
     * @param currentScriptUrl: required to resolve relative paths of other JS files to load
     */
    initialize : function(pg,currentScriptUrl) {
        console.debug("Initializing with PG=",pg);
        var baseUrl = this.getBaseUrl(currentScriptUrl);
        console.debug("Will use baseUrl=",baseUrl);


        // TODO do not use global initialPG variable but inject it in the require app
        window.initialPG = pg;


        this.loadRequireJS(
            baseUrl+"/js/main",
            baseUrl+"/js/lib/require/require.js",
            undefined
        )

    },

    loadRequireJS: function(dataMain,requireLib,callback) {
        var script = document.createElement('script');
        script.setAttribute("data-main", dataMain);
        script.src = requireLib;
        document.body.appendChild(script);
        if(callback) callback();
    },

    /**
     * The baseUrl is the absolute path of the folder of the app.
     * We can't use the html baseUrl to resolve paths because.
     *
     * @param scriptUrl
     * @return baseUrl (doesn't end with a / )
     */
    getBaseUrl: function(currentScriptUrl) {
        if ( currentScriptUrl && currentScriptUrl.indexOf(".js") != -1 && currentScriptUrl.indexOf("/") != -1 ) {
            var scriptFolder = currentScriptUrl.substr( 0 , currentScriptUrl.lastIndexOf("/") );
            return scriptFolder;
        }
        else {
            throw new Error("Bad or missing scriptUrl attribute: "+currentScriptUrl + " . " +
                "It is required to start the app with AppStarter.initialize(pg,currentScriptUrl)." +
                "Note currentScriptUrl should at least contain one / so you can use ./AppStarter.js but not AppStarter.js");
        }
    }

}