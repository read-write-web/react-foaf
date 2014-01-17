/** @jsx React.DOM */

// proxy
//$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
$rdf.Fetcher.onlyUseProxy = true;

// Level of logs in external libs.
$rdf.PointedGraph.setLogLevel("nologs");

var foafSpec = "http://xmlns.com/foaf/spec/";
var store = new $rdf.IndexedFormula();

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }

/*
FOAFKEY: {
    "foaf:name": "foaf:name";
    "foaf:name": "foaf:givenname";
    "foaf:name": "foaf:family_name";
    "foaf:name": "foaf:firstname";
    "foaf:name": "foaf:workplaceHomepage";
}
*/
//var foafDocURL = "http://bblfish.net/people/henry/card";
//var foafDocURL = "https://my-profile.eu/people/tim/card";
var foafDocURL = "https://my-profile.eu/people/deiu/card";
//var foafDocURL = "https://my-profile.eu/people/deiu/card";
//var foafDocURL = "https://my-profile.eu/people/mtita/card";// Not working
//var foafDocURL = "http://presbrey.mit.edu/foaf";
//var foafDocURL = 'https://localhost:8443/2013/backbone';

React.renderComponent(
	 <FoafBx url={foafDocURL}/>,
    document.getElementById('container')
);

/*
var foafBx = <FoafBx />;
React.renderComponent(
    foafBx,
    document.getElementById('container')
);
*/