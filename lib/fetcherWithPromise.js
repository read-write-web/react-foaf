

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
    var docUri = $rdf.Stmpl.fragmentless(uri);
    var docUriSym = $rdf.sym(docUri);

	console.log("============> fetch with promise! <"+uri+">");

    /*
    * Check if the graph uri is already in the store.
    * */
    console.log(this.store.statementsMatching(undefined, undefined, undefined, uriSym))
    console.log(this.requested)
    /**
     * Permits to know if the URI we currently fetches is matching a given URI, without taking care of the proxy stuff...
     * @param uri2
     * @returns {boolean}
     */
	var isRequestURIMatching =  function(uri2) {
        var result = (self.requiresProxy(uri))?
            (uri2 == uri || ( $rdf.Fetcher.crossSiteProxy(uri) == uri2  )) :
            (uri2 == docUri || ( $rdf.Fetcher.crossSiteProxy(docUri) == uri2 ))
        return result;
    };

	var sta = self.getState(uri);
	if (force) sta='unrequested';

	if (sta == 'fetched') {
		return Q.fcall( function() { return $rdf.pointedGraph(self.store, uriSym, uriSym, uriSym) });
	} else {
		var deferred = Q.defer();
		self.addCallback('done', function fetchDoneCallback(uri2) {
            var callbackMatch = isRequestURIMatching(uri2);
			if ( callbackMatch ) {
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, docUriSym, $rdf.sym(uri2)));
			}
			return !callbackMatch;
		});
		self.addCallback('fail', function fetchFailureCallback(uri2, status) {
            var callbackMatch = isRequestURIMatching(uri2);
			if ( callbackMatch ) {
                deferred.reject(new Error("Async fetch fail for "+uri+" with status=" + status));
            }
            return !callbackMatch;
		});

		if (sta == 'unrequested') {
			var proxyURI = (self.requiresProxy(uri)) ? $rdf.Fetcher.crossSiteProxy(uri) : docUri;
			var result = self.requestURI(proxyURI, referringTerm, force);
			if (result == null) {
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, docUriSym, docUriSym));
			}
		}
        // See https://github.com/stample/react-foaf/issues/8 -> RDFLib doesn't always fire the "fail" callback :(
        // see https://github.com/linkeddata/rdflib.js/issues/30
		return Q.timeout(deferred.promise, hardcodedFetcherTimeout, "Timeout fired after "+hardcodedFetcherTimeout+" because no response from RDFLib :( (rdflib bug)");

	}

}

