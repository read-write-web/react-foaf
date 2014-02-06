
AppStarter = {

    initialize : function(pg) {
        // TODO do not use global initialPG variable but inject it in the require app
        window.initialPG = pg;


        // TODO TODO TODO TODO TODO TODO TODO TODO TODO very important FIXME !!!
        // The app should never have to use an absolute path!
        // The app shouldn't need to know the hardcoded URL on which it is deployed!!!
        this.loadRequireJS(
            "/assets/react-foaf/js/main",
            "/assets/react-foaf/js/lib/require.js",
            undefined
        )
    },

    loadRequireJS: function(dataMain,requireLib,callback) {
        var script = document.createElement('script');
        script.setAttribute("data-main", dataMain);
        script.src = requireLib;
        document.body.appendChild(script);
        if(callback) callback();
    }

}