
// proxy
//$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
//$rdf.Fetcher.homeServer = "http://localhost:9000/";
//$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
//$rdf.Fetcher.onlyUseProxy = false;

// Level of logs in external libs.
$rdf.PointedGraph.setLogLevel("warning");



function createNewRdfStore() {
    var store = new $rdf.IndexedFormula();
    var fetcherTimeout = 10000; // TODO this doesn't work because of https://github.com/linkeddata/rdflib.js/issues/30
    $rdf.fetcher(store, fetcherTimeout, true); // this makes "store.fetcher" variable available
    return store;
}

var store = createNewRdfStore();

var foafDocURL = "http://bblfish.net/people/henry/card#me";
//var foafDocURL = "https://my-profile.eu/people/deiu/card#me";
//var foafDocURL = "https://localhost:8443/2013/backbone#me";


// TODO need to add hash if needed: we do not look for primary topic anymore
//var foafDocURL = "https://my-profile.eu/people/mtita/card";// Not working
//var foafDocURL = "http://presbrey.mit.edu/foaf";
//var foafDocURL = 'https://localhost:8443/2013/backbone';
//var foafDocURL = "https://my-profile.eu/people/tim/card";
//var foafDocURL = "https://my-profile.eu/people/deiu/card";


// maybe this should be injected as props???
var routeHelper = new RouteHelper();



Q.longStackSupport = true;