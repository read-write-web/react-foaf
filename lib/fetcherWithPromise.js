

/*
*  Check it the proxy is required.
*  False if a proxy template is not defined : $rdf.Fetcher.crossSiteProxyTemplate.
* */
$rdf.Fetcher.prototype.requiresProxy = function(uri) {
    return ($rdf.Fetcher.crossSiteProxyTemplate) && ((uri.indexOf($rdf.Fetcher.homeServer) !== 0) || (!uri.indexOf($rdf.Fetcher.crossSiteProxyTemplate) !== 0));
}

/**
 *
 * @param uri
 * @returns {String} the original url or the proxies url
 */
$rdf.Fetcher.prototype.proxiedURL = function(uri) {
	if ($rdf.Fetcher.prototype.requiresProxy(uri)) {
		return $rdf.Fetcher.prototype.crossSiteProxy(uri)
	} else return uri
}


var hardcodedFetcherTimeout = 5000; // in millies, temporary hardcoded

/**
 * return the Promise of a graph fro a given url
 * @param {String} uri to fetch as string (!) (Not a $rdf.sym())
 * @param {String} referringTerm the url as string (!) referring to the the requested url (Not a $rdf.sym())
 * @param {boolean} force, force fetching of resource even if already in store
 * @return {Promise}  of a pointedGraph
 */
$rdf.Fetcher.prototype.fetch = function(uri, referringTerm, force) {
	var self = this;
	var uriSym = $rdf.sym(uri);
    var docUri = uri.split('#')[0];

	//console.log("============> fetch with promise! <"+uri+">");

    // TODO Henry document this please
	var requestedUriOrProxy =  function(uri2){
        return (self.requiresProxy(uri))?
            (uri2 == uri || ( $rdf.Fetcher.crossSiteProxy(uri) == uri2  )) :
            (uri2 == docUri || ( $rdf.Fetcher.crossSiteProxy(docUri) == uri2 ))
    };

	var sta = self.getState(uri);
	if (force) sta='unrequested';

	if (sta == 'fetched') {
		return Q.fcall( function() { return $rdf.pointedGraph(self.store, uriSym, uriSym, uriSym) });
	} else {
		var deferred = Q.defer();
		self.addCallback('done', function (uri2) {
			//console.log('fetch done');
			//todo: use reject on failure and return a pointed graph on the error bnode in the store
			if (requestedUriOrProxy(uri2)) {
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, uriSym, $rdf.sym(uri2)));
			}
			else {
//				console.log("not in correct promise! fetch (uri=" + uri + ")==(uri2=" + uri2 + ") is (with proxy verif) false");
			}
			return !requestedUriOrProxy(uri2); // Call me again?
		});
		self.addCallback('fail', function(uri2, status) {
			if (requestedUriOrProxy(uri2)) {
                // We enqueue the reject to avoid it being called synchronously
                setTimeout(function() {
                    deferred.reject(new Error("Asynch fetch fail for "+uri+" with status=" + status));
                },0);
            }
			return (!requestedUriOrProxy(uri2)); // Call me again?
		});

		if (sta == 'unrequested') {
			var proxyURI = (self.requiresProxy(uri)) ? $rdf.Fetcher.crossSiteProxy(uri) : docUri;
            // console.log("proxyURI=",proxyURI)
			    var result = self.requestURI(proxyURI, referringTerm, force);
			if (result == null) {
				//console.log("graph("+uriSym+") was already in store ( or ... check!)");
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, uriSym, uriSym));
			}
		}

        // See https://github.com/stample/react-foaf/issues/8 -> RDFLib doesn't always fire the "fail" callback :(
		return Q.timeout(deferred.promise, hardcodedFetcherTimeout, "Timeout fired after "+hardcodedFetcherTimeout+" because no response from RDFLib :( (rdflib bug)");
	}

}


// TODO where to put this method, it should not use a global function name
function fetchPointedGraph(url) {
    if (!url) return;
    var fetcher = $rdf.fetcher(store, 10000, true);
    var referer = window.location; // TODO rework the referer with the url of a foaf profile previously visited
    return fetcher.fetch(url, referer);
}

