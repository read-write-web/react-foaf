define(["rdflib-pg-extension"], function(rdflibPg) {

    // TODO how to externalize this store configuration???
    var fetcherTimeout = 4000;

    $rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "https://www.stample.io/srv/cors?url=";
    //$rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
    //$rdf.Fetcher.fetcherWithPromiseCrossSiteProxyTemplate = "http://data.fm/proxy?uri=";
    //$rdf.Fetcher.homeServer = "http://localhost:9000/"

    var store = rdflibPg.createNewStore(fetcherTimeout);
    console.debug("global RdfStore created",store);
    return store;

});