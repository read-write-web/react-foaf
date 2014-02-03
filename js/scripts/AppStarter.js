App = {
    initialize : function(pg) {
        // Initial PG is in globals.
        initialPG = pg;

        // Load main.js.
        loadFiles({
            "data-main": "/assets/react-foaf/js/main",
            "requirejs": "/assets/react-foaf/js/lib/require.js"
        });

        // Function to load requireJS main.js
        function loadRequireJS(obj, callback) {
            var script = document.createElement('script');
            script.setAttribute("data-main", obj["data-main"]);
            script.src = obj.src;
            document.body.appendChild(script);
            if(callback) callback();
        }

        function loadFiles(obj) {
            console.log("load Application");
            console.log(obj)
            console.log(initialPG)
            loadRequireJS({ "data-main": obj["data-main"], "src": obj.requirejs });
        }


}
}