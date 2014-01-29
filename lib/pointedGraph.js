
/**
 *
 * @param {$rdf.store} store - Quad Store
 * @param {$rdf.sym} pointer onto an object.  Type: Literal, Bnode, or URI
 * @param {$rdf.sym} webGraphName name of graph in which to point -  Type : $rdf.sym() URI
 * @param {$rdf.sym} internalGraphName - internal graph name. It is only different of the webGraphName if the graph is fetched through a CORS proxy.
 * @return {$rdf.PointedGraph}
 */
$rdf.pointedGraph = function(store, pointer, webGraphName, internalGraphName) {
    return new $rdf.PointedGraph(store, pointer, webGraphName, internalGraphName);
};


$rdf.PointedGraph = function() {
    $rdf.PointedGraph = function(store, pointer, webGraphId, internalId){
        Preconditions.checkArgument( $rdf.Stmpl.isFragmentlessSymbol(webGraphId),"The webGraphId should be a fragmentless symbol! -> "+webGraphId);
        Preconditions.checkArgument( $rdf.Stmpl.isFragmentlessSymbol(internalId),"The internalId should be a fragmentless symbol! -> "+internalId);
        this.store = store;
        this.pointer = pointer;
        this.webGraph = webGraphId;
        this.internalGraph = internalId;
    };
    $rdf.PointedGraph.prototype.constructor = $rdf.PointedGraph;



    // Logs.
    var logLevels = $rdf.PointedGraph.logLevels = {
        nologs: 0,
        debug: 1,
        info: 2,
        warning: 3,
        error: 4
    };

    // Default is no logs.
    $rdf.PointedGraph.logLevel = logLevels.nologs;

    // To change the level of logs
    $rdf.PointedGraph.setLogLevel = function(level) {
        $rdf.PointedGraph.logLevel = (logLevels[level] == null ? logLevels.info : logLevels[level]);
    }

    var doLog = function(level, consoleLogFunction ,messageArray) {
        var loggingEnabled = ($rdf.PointedGraph.logLevel !== logLevels.nologs);
        if ( loggingEnabled ) {
            var shouldLog = ( (logLevels[level] || logLevels.debug) >= $rdf.PointedGraph.logLevel );
            if ( shouldLog ) {
                // TODO maybe it may be cool to prefix the log with the current pg infos
                consoleLogFunction.apply(console,messageArray);
            }
        }
    }

    // Specific functions for each level of logs.
    var debug = function() { doLog('debug', console.debug, _.toArray(arguments)) };
    var info = function() { doLog('info', console.info, _.toArray(arguments)) };
    var warning = function() { doLog('warning', console.warn, _.toArray(arguments)) };
    var error = function() { doLog('error', console.error, _.toArray(arguments)) };

    // Utils.
    function sparqlPatch(uri, query) {
        var promise = $.ajax({
            type: "PATCH",
            url: uri,
            contentType: 'application/sparql-update',
            dataType: 'text',
            processData:false,
            data: query
        }).promise();
        return promise;
    }

    function sparqlPut(uri, query) {
        var promise = $.ajax({
            type: "PUT",
            url: uri,
            contentType: 'application/sparql-update',
            dataType: 'text',
            processData:false,
            data: query
        }).promise();
        return promise;
    }

    $rdf.PointedGraph.prototype.Fetcher = function() {
        return this.store.fetcher;
    }


    $rdf.PointedGraph.prototype.getGraphTriples = function() {
        return this.store.statementsMatching(undefined, undefined, undefined, this.internalGraph, false)
    }

    $rdf.PointedGraph.prototype.isGraphHasTriples = function() {
        return this.store.statementsMatching(undefined, undefined, undefined, this.internalGraph, true).length > 0;
    }

    $rdf.PointedGraph.prototype.isPointerExistHasSubject = function() {
        return this.store.statementsMatching(this.pointer, undefined, undefined, this.internalGraph, true).length > 0;
    }

    $rdf.PointedGraph.prototype.isPointerExistHasObject = function() {
        return this.store.statementsMatching(undefined, undefined, this.pointer, this.internalGraph, true).length > 0;
    }


    /**
     * Follow a predicate/symbol/rel and gives a list of pointer in the same graph.
     * @param {$rdf.sym} relUri the relation from this node
     * @returns {[PointedGraph]} of PointedGraphs with the same graph name in the same store
     */
    $rdf.PointedGraph.prototype.rel = function (relUri) {
        var pointer = this.pointer
        var internalGraph = this.internalGraph
        var webGraph = this.webGraph
        var store = this.store

        // Select all triples that matches the predicate relUri.
        var resList = store.statementsMatching(pointer, relUri, undefined, internalGraph, false);

        // Create as much PG as q results.
        var pgList = _.map(resList, function (it) {
            return $rdf.pointedGraph(store, it.object, webGraph, internalGraph);
        });

        return pgList;
    }

    /**
     * Same as "rel" but follow mmultiple predicates/rels
     * @returns {*}
     */
        // Array[relUri] => Array[Pgs]
    $rdf.PointedGraph.prototype.rels = function() {
        var self = this;
        var pgList = _.chain(arguments)
            .map(function(arg) {
                return self.rel(arg)
            })
            .flatten()
            .value()
        return pgList;
    }

    /**
     * This relation functions very much like rel, except that if the object of the relation is defined
     * in another graph, then this hops into that other graph. We use observables because the results can
     * therefore be asynchronous.
     *
     * @param {$rdf.sym} relUri the relation uri
     * @returns {rx.Observable[PointedGraph]} an observable of PointedGraphs
     */
    $rdf.PointedGraph.prototype.observableRel = function(relUri) {
        var self = this;
        //for each pg in pgList
        //if pg is a bnode or a literal or a local URI
        // then return bnode as Obvervable result
        // else
        // fetch remote graph and create a new PG with the right pointer,
        // and return that as an Observable result
        //return observer?

        var pgList = this.rel(relUri);
        var localRemote = _.groupBy(pgList, function (pg) {
            return pg.isLocalPointer()
        });
        var source1 = (localRemote.true && localRemote.true.length > 0) ?
            Rx.Observable.fromArray(localRemote.true) :
            Rx.Observable.empty();
        var fun = function (observer) {
            _.map(localRemote.false?localRemote.false:[], function (pg) {
                var f = this.Fetcher()
                var docURL = pg.pointer.uri.split('#')[0];
                var promise = f.fetch(docURL, pg.webGraph.uri);
                promise.then(
                    function (newPg) {
                        //todo: need to deal with errors
                        debug("observableRel("+relUri+")=PG(_,"+pg.pointer+", "+ newPg.webGraph+")");
                        observer.onNext($rdf.pointedGraph(pg.store, pg.pointer, newPg.webGraph, newPg.internalGraph))
                    },
                    function (err) {
                        debug("Observable rel => On Error for " + pg.graphName);
                        observer.onError(err)
                    }
                );
            })
        }
        var source2 = Rx.Observable.create(fun);
        return source1.merge(source2);
    }

    /**
     * Nearly the same as jumpAsync except it will not fetch remote document but will only use documents
     * that are already in the store. This means that you can't jump to a remote document that has not been previously
     * loaded in the store.
     * @returns {$rdf.PointedGraph}
     */
    $rdf.PointedGraph.prototype.jump = function() {
        // TODO test this function implementation :)
        console.error("TODO: this function has not been tested and blind written so remove this error log if it works fine!")
        if ( this.isLocalPointer() ) {
            return this;
        }
        else {
            var pointerDocumentUrl = this.getSymbolPointerDocumentUrl();
            var pointerDocumentUrlFetched = this.fetcher.proxifyIfNeeded(pointerDocumentUrl);
            var uriFetchState = this.fetcher.getState(pointerDocumentUrlFetched);
            if (uriFetchState == 'fetched') {
                return $rdf.pointedGraph(this.store, this.pointer, $rdf.sym(pointerDocumentUrl), $rdf.sym(pointerDocumentUrlFetched) );
            } else if ( uriFetchState == 'unrequested' ) {
                throw new Error("Can't jump because the jump requires"+pointerDocumentUrl+" to be fetched. " +
                    "This resource is not yet in the store");
            }
        }
    }


    /**
     * This permits to jump to the pointer document if the document
     * This will return the current PG if the pointer is local (bnode/literal/local symbols...)
     * This will return a new PG if the pointer refers to another document.
     *
     * So, basically
     * - (documentUrl - documentUrl#hash ) will return (documentUrl - documentUrl#hash )
     * - (documentUrl - documentUrl2#hash ) will return (documentUrl2 - documentUrl2#hash )
     *
     * @returns {Promise[PointedGraph]}
     */
    $rdf.PointedGraph.prototype.jumpAsync = function() {
        var originalPG = this;
        if ( originalPG.isLocalPointer() ) {
            return Q.fcall(function () {
                return originalPG;
            })
        }
        else {
            return this.jumpFetchRemote();
        }
    }

    /**
     * This permits to follow a remote symbol pointer and fetch the remote document.
     * This will give you a PG with the same pointer but the underlying document will be
     * the remote document instead of the current document.
     *
     * For exemple, let's suppose:
     * - current PG (documentUrl,pointer) is (url1, url1#profile)
     * - current document contains triple (url1#profile - foaf:knows - url2#profile)
     * - you follow the foaf:knows rel and get PG2 (url1, url2#profile)
     * - then you can jumpFetch on PG2 because url2 != url1
     * - this will give you PG3 (url2, url2#profile)
     * - you'll have the same pointer, but the document is different
     *
     * @returns {Promise[PointedGraph]}
     */
    $rdf.PointedGraph.prototype.jumpFetchRemote = function() {
        Preconditions.checkArgument( this.isRemotePointer(),"You are not supposed to jumpFetch if you already have all the data locally. Pointer="+this.pointer);
        var pointerUrl = this.getSymbolPointerUrl();
        var referrerUrl = $rdf.Stmpl.symbolNodeToUrl(this.webGraph);
        var force = false;
        return this.Fetcher().fetch(pointerUrl, referrerUrl, force);
    }



    /**
     * This relation function like observableRel except that it is synchronous,
     * and only works on data in the store. ( So it does not jump if the remote
     * graph does not contain information about the object )
     *
     * @param {$rdf.sym} relUri the relation uri
     * @returns {[PointedGraph]} a List of PointedGraphs
     */
    $rdf.PointedGraph.prototype.jumpRel = function(relUri) {
        debug("**** in jumpRel *** with " + relUri)
        var self = this;
        //for each pg in pgList
        //if pg is a bnode or a literal or a local URI
        // then return bnode as Obvervable result
        // else
        // fetch remote graph and create a new PG with the right pointer,
        // and return that as an Observable result
        //return observer?

        var pgList = self.rel(relUri);
        var localRemote = _.groupBy(pgList, function (pg) {
            return pg.isLocalPointer()
        });
        var jumpedPGs = _.chain(localRemote.false ? localRemote.false : [])
            .map(function (pg) {
                var docURL = pg.pointer.uri.split('#')[0];
                var proxiedDoc = $rdf.sym($rdf.Fetcher.crossSiteProxy(docURL))
                if (pg.store.statementsMatching(undefined, undefined, undefined, proxiedDoc, false) > 0) {
                    debug("there is dta in " + doc + " so we make a new PG for it")
                    return $rdf.pointedGraph(pg.store, pg.pointer, $rdf.sym(pg.docUrl), proxiedDoc)
                } else {
                    return pg
                }
            }).value()
        return (localRemote.true?localRemote.true:[]).concat(jumpedPGs)
    }

    $rdf.PointedGraph.prototype.rev = function (relUri) {
        var g = this.store;
        var n = this.webGraph;
        var internalGraph = this.internalGraph
        var p = this.pointer;

        // Select all that matches the relation relUri.
        var resList = g.statementsMatching(undefined, relUri, p, internalGraph, false);

        // Create as much PG as q results.
        var pgList = _.map(resList, function (it) {
            return new $rdf.PointedGraph(g, it.subject, n);
        });

        return pgList;
    }

    // relUri => List[Symbol]
    $rdf.PointedGraph.prototype.getSymbol = function() {
        var rels = _.flatten(arguments); // TODO: WTF WHY DO WE NEED TO FLATTEN!!!
        var pgList = this.rels.apply(this, rels);
        var symbolValueList =
            _.chain(pgList)
                .filter(pgUtils.pgFilters.isSymbolPointer)
                .map(pgUtils.pgTransformers.symbolPointerToValue)
                .value();
        return symbolValueList
    }

    // relUri => List[Literal]
    // TODO change the name
    $rdf.PointedGraph.prototype.getLiteral = function () {
        var rels = _.flatten(arguments);  // TODO: WTF WHY DO WE NEED TO FLATTEN!!!
        var pgList = this.rels.apply(this, rels);
        var literalValueList = _.chain(pgList)
            .filter(pgUtils.pgFilters.isLiteralPointer)
            .map(pgUtils.pgTransformers.literalPointerToValue)
            .value();
        return literalValueList;
    }

    $rdf.PointedGraph.prototype.relFirst = function(relUri) {
        var l = $rdf.PointedGraph.prototype.rel(relUri);
        if (l.length > 0) return l[0];
    }

    // Interaction with the PGs.
    $rdf.PointedGraph.prototype.delete = function(relUri, value) {
        var query =
            'PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n' +
                'DELETE DATA \n' +
                '{' + "<" + this.pointer.value + ">" + relUri + ' "' + value + '"' + '. \n' + '}';


        // Sparql request return a promise.
        return sparqlPatch(this.pointer.value, query);
    }

    $rdf.PointedGraph.prototype.insert = function(relUri, value) {
        var query =
            'PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n' +
                'INSERT DATA \n' +
                '{' + "<" + this.pointer.value + ">" + relUri + ' "' + value + '"' + '. \n' + '}';

        // Sparql request return a promise.
        return sparqlPatch(this.pointer.value, query);
    }

    $rdf.PointedGraph.prototype.update = function (relUri, newValue, oldvalue) {
        var query =
            'DELETE DATA \n' +
                '{' + "<" + this.pointer.value + "> " + relUri + ' "' + oldvalue + '"' + '} ;\n' +
                'INSERT DATA \n' +
                '{' + "<" + this.pointer.value + "> " + relUri + ' "' + newValue + '"' + '. } ';

        // Sparql request return a promise.
        return sparqlPatch(this.pointer.value, query);
    }

    $rdf.PointedGraph.prototype.updateStore = function(relUri, newValue) {
        this.store.removeMany(this.pointer, relUri, undefined, this.internalGraph);
        this.store.add(this.pointer, relUri, newValue, this.internalGraph);
    }

    $rdf.PointedGraph.prototype.replaceStatements = function(pg) {
        var self = this;
        this.store.removeMany(pg.pointer, undefined, undefined, pg.internalGraph);
        _.each(pg.store.statements, function(stat) {
            self.store.add(stat.subject, stat.predicate, stat.object, pg.internalGraph)
        });
    }

    $rdf.PointedGraph.prototype.ajaxPut = function (baseUri, data, success, error, done) {
        $.ajax({
            type: "PUT",
            url: baseUri,
            dataType: "text",
            contentType: "text/turtle",
            processData: false,
            data: data,
            success: function (data, status, xhr) {
                if (success) success(xhr)
            },
            error: function (xhr, status, err) {
                if (error) error(xhr)
            }
        })
            .done(function () {
                if (done) done()
            });
    }

    // Future.
    $rdf.PointedGraph.prototype.future = function(pointer, name) {
        $rdf.PointedGraph(this.store, pointer, name,$rdf.Fetcher.crossSiteProxy(name))
    }



    $rdf.PointedGraph.prototype.print = function() {
        return this.printSummary() + " = { "+this.printContent() + "}"
    }
    $rdf.PointedGraph.prototype.printSummary = function() {
        return "PG[pointer="+this.pointer+" - NamedGraph="+this.webGraph+"]";
    }
    $rdf.PointedGraph.prototype.printContent = function() {
        return $rdf.Serializer(this.store).statementsToN3(this.store.statementsMatching(undefined, undefined, undefined, this.internalGraph));
    }
    $rdf.PointedGraph.prototype.toString = function() {
        return this.printSummary();
    }


    // TODO not sure it's a good idea neither if it's well implemented
    // TODO this file should not contain anything related to react...
    /**
     * Return a string key for the current pointer.
     * This is useful for React to be able to associate a key to each relation to avoid recreating dom nodes
     * Note that the key value must be unique or React can't handle this
     * @returns
     */
    $rdf.PointedGraph.prototype.getPointerKeyForReact = function() {
        if ( this.isBlankNodePointer() ) {
            return "BNode-"+this.pointer.id; // TODO not sure it's a good idea (?)
        }
        else if ( this.isSymbolPointer() ) {
            return this.pointer.value;
        }
        else if ( this.isLiteralPointer() ) {
            return this.pointer.value;
        }
        else {
            throw new Error("Unexpected pointed type:"+this.pointer);
        }
    }

    /**
     * Return a clone of the current pointed graph.
     */
    $rdf.PointedGraph.prototype.deepCopyOfGraph = function() {
        var self = this;
        var triples = this.store.statementsMatching(undefined, undefined, undefined, this.internalGraph);
        var store = new $rdf.IndexedFormula();
        _.each(triples, function(stat) {
            store.add(stat.subject, stat.predicate, stat.object, self.internalGraph)
        });
        return new $rdf.PointedGraph(store, this.pointer, this.webGraph, this.internalGraph);
    }


    $rdf.PointedGraph.prototype.isSymbolPointer = function() {
        return $rdf.Stmpl.isSymbolNode(this.pointer);
    }
    $rdf.PointedGraph.prototype.isLiteralPointer = function() {
        return $rdf.Stmpl.isLiteralNode(this.pointer);
    }
    $rdf.PointedGraph.prototype.isBlankNodePointer = function() {
        return $rdf.Stmpl.isBlankNode(this.pointer);
    }

    /**
     * Returns the Url of the pointer.
     * The url may contain a fragment.
     * Will fail if the pointer is not a symbol because you can't get an url for a blank node or a literal.
     */
    $rdf.PointedGraph.prototype.getSymbolPointerUrl = function() {
        return $rdf.Stmpl.symbolNodeToUrl(this.pointer);
    }

    /**
     * Returns the Url of the document in which points the symbol pointer.
     * The url is a document URL so it won't contain a fragment.
     * Will fail if the pointer is not a symbol because you can't get an url for a blank node or a literal.
     */
    $rdf.PointedGraph.prototype.getSymbolPointerDocumentUrl = function() {
        var pointerUrl = this.getSymbolPointerUrl();
        return $rdf.Stmpl.fragmentless(pointerUrl);
    }


    /**
     * Returns the current document Url (so it has no fragment)
     */
    $rdf.PointedGraph.prototype.getCurrentDocumentUrl = function() {
        return $rdf.Stmpl.symbolNodeToUrl(this.webGraph);
    }

    /**
     * Returns the Url of the currently pointed document.
     * Most of the time it will return the current document url.
     * It will return a different url only for non-local symbol nodes.
     *
     * If you follow a foaf:knows, you will probably get a list of PGs where the pointer document
     * URL is not local because your friends will likely describe themselves in different resources.
     */
    $rdf.PointedGraph.prototype.getPointerDocumentUrl = function() {
        if ( this.isSymbolPointer() ) {
            return this.getSymbolPointerDocumentUrl();
        } else {
            return this.getCurrentDocumentUrl();
        }
    }

    $rdf.PointedGraph.prototype.getPointerDocumentUrl = function() {
        if ( this.isSymbolPointer() ) {
            return this.getSymbolPointerDocumentUrl();
        } else {
            return this.getCurrentDocumentUrl();
        }
    }

    /**
     * Permits to know if the pointer is local to the current document.
     * This will be the case for blank nodes, literals and local symbol pointers.
     * @returns {boolean}
     */
    $rdf.PointedGraph.prototype.isLocalPointer = function() {
        return this.getPointerDocumentUrl() == this.getCurrentDocumentUrl();
    }
    $rdf.PointedGraph.prototype.isRemotePointer = function() {
        return !this.isLocalPointer();
    }


    return $rdf.PointedGraph;
}();
