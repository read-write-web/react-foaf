
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

    // Check if in proxy mode or not.
    var requestedUriOrProxy;
    var uriToFetch;
    if ($rdf.Fetcher.onlyUseProxy) {
        requestedUriOrProxy =  function(uri2){ return (uri2 == uri || ( $rdf.Fetcher.crossSiteProxy(uri) == uri2  )) };
        uriToFetch = $rdf.Fetcher.crossSiteProxy(uri);
    }
    else {
        requestedUriOrProxy =  function(uri2){ return (uri2 == docUri || ( $rdf.Fetcher.crossSiteProxy(docUri) == uri2  )) };
        uriToFetch = docUri;
    }

	var sta = self.getState(uri);
	if (sta == 'fetched') {
		return Q.fcall( function() { return $rdf.pointedGraph(self.store, uriSym, uriSym, uriSym) });
	} else {
		var deferred = Q.defer()
		self.addCallback('done', function (uri2) {
			//todo: use reject on failure and return a pointed graph on the error bnode in the store
            if (requestedUriOrProxy(uri2)) {
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, uriSym, $rdf.sym(uri2)));
			}
			else {
//				console.log("not in correct promise! fetch (uri=" + uri + ")==(uri2=" + uri2 + ") is (with proxy verif) false");
			}
			return !requestedUriOrProxy(uri2) ; // Call me again?
		});
		self.addCallback('fail', function(uri2, status) {
			if (requestedUriOrProxy(uri2)) deferred.reject("Asynch fetch fail: " + status + " for " + uri );
			return (!requestedUriOrProxy(uri2)); // Call me again?
		});

		if (sta == 'unrequested') {
			var result = self.requestURI(uriToFetch, referringTerm, force);
			if (result == null) {
				//console.log("graph("+uriSym+") was already in store ( or ... check!)");
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, uriSym, uriSym));
			}
		}
		return deferred.promise;
	}
}

