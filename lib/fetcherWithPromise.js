/**
 * return the Promise of a graph fro a given url
 * @param {String} uri to fetch as string (!) (Not a $rdf.sym())
 * @param {String} referringTerm the url as string (!) referring to the the requested url (Not a $rdf.sym())
 * @param {boolean} force, force fetching of resource even if already in store
 * @return {Promise}  of a pointedGraph
 */
$rdf.Fetcher.prototype.fetch = function(uri, referringTerm, force) {
	var self = this;
	console.log("============> fetch with promise! <"+uri+">");

	// Create a promise which create a new PG.
	var promise = new RSVP.Promise(function (resolve, reject) {
			var sta = self.getState(uri);
			if (sta == 'fetched') {
				resolve($rdf.pointedGraph(self.store, $rdf.sym(uri), $rdf.sym(uri), $rdf.sym(uri)));
			}
			else {
				self.addCallback('done', function (uri2) {
					console.log('fetch done');
					//todo: use reject on failure and return a pointed graph on the error bnode in the store
					if (uri2 == uri || ( $rdf.Fetcher.crossSiteProxy(uri) == uri2  )) {
						console.log("creating pointed graph for uri=<"+uri+"> and uri2=<"+uri2+">")
						resolve($rdf.pointedGraph(self.store, $rdf.sym(uri), $rdf.sym(uri), $rdf.sym(uri2)));
					}
					else {
						reject("fetch (uri=" + uri + ")==(uri2=" + uri2 + ") is (with proxy verif) false")
						console.log("fetch (uri=" + uri + ")==(uri2=" + uri2 + ") is (with proxy verif) false")
					}
				});
				if (sta == 'unrequested') {
				   var newURI = $rdf.Fetcher.crossSiteProxy(uri)
					self.requestURI(newURI, uri, force);
				}
			}

		}
	);

	return promise;
}

