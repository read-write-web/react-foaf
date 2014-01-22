


$rdf.Fetcher.prototype.requiresProxy = function(uri) {
	return uri.indexOf(homeServer) !== 0 || !uri.indexOf($rdf.Fetcher.crossSiteProxyTemplate) !== 0
}

/**
 * return the Promise of a graph fro a given url
 * @param {String} uri to fetch as string (!) (Not a $rdf.sym())
 * @param {String} referringTerm the url as string (!) referring to the the requested url (Not a $rdf.sym())
 * @param {boolean} force, force fetching of resource even if already in store
 * @return {Promise}  of a pointedGraph
 */
$rdf.Fetcher.prototype.fetch = function(uri, referringTerm, force) {
	var self = this;
	var uriSym = $rdf.sym(uri)

	//console.log("============> fetch with promise! <"+uri+">");

	var requestedUriOrProxy =  function(uri2){ return (uri2 == uri || ( $rdf.Fetcher.crossSiteProxy(uri) == uri2  )) };

	var sta = self.getState(uri);
	if (sta == 'fetched') {
		return Q.fcall( function() { return $rdf.pointedGraph(self.store, uriSym, uriSym, uriSym) });
	} else {
		var deferred = Q.defer()
		self.addCallback('done', function (uri2) {
			//console.log('fetch done');
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
			var proxyURI = (requiresProxy(uri))?$rdf.Fetcher.crossSiteProxy(uri):uri
			var result = self.requestURI(proxyURI, referringTerm, force);
			if (result == null) {
				//console.log("graph("+uriSym+") was already in store ( or ... check!)");
				deferred.resolve($rdf.pointedGraph(self.store, uriSym, uriSym, uriSym));
			}
		}
		return deferred.promise;
	}
}

