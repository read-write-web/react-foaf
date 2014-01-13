/** @jsx React.DOM */

// proxy
$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
//$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
$rdf.Fetcher.onlyUseProxy = true;

var foafSpec = "http://xmlns.com/foaf/spec/";
var store = new $rdf.IndexedFormula();

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }


//var foafDocURL = "http://bblfish.net/people/henry/card";
	//url : "https://my-profile.eu/people/tim/card",
var foafDocURL ="https://my-profile.eu/people/deiu/card";
	//url:"https://my-profile.eu/people/mtita/card",// Not working
	//url:"http://presbrey.mit.edu/foaf",
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