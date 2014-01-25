
// proxy
//$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
//$rdf.Fetcher.homeServer = "http://localhost:9000/";
//$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
//$rdf.Fetcher.onlyUseProxy = false;

// Level of logs in external libs.
$rdf.PointedGraph.setLogLevel("nologs");

var foafSpec = "http://xmlns.com/foaf/spec/";
var store = new $rdf.IndexedFormula();


// *** ?
function FOAF(attr) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+attr) }
function CONTACT(attr) { return $rdf.sym("http://www.w3.org/2000/10/swap/pim/contact#"+attr) }
function GEOLOC(attr) { return $rdf.sym("http://www.w3.org/2003/01/geo/wgs84_pos#" + attr) }
function RDFS(attr) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+attr) }

var defaulfContext = { // TODO : Find better denomination.
    "foaf": function(attr) {return FOAF(attr)},
    "contact": function(attr) {return CONTACT(attr)},
    "geoloc": function(attr) {return GEOLOC(attr)},
    "rdfs": function(attr) {return RDFS(attr)}
}


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
