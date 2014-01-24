
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
		this.store = store;
		this.pointer = pointer;
		this.webGraph = webGraphId;
		this.internalGraph = (internalId)?internalId:$rdf.sym($rdf.Fetcher.crossSiteProxy(webGraphId.uri));
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

    // To print logs.
    var log = function(level, msg) {
        if (($rdf.PointedGraph.logLevel !== logLevels.nologs)  &&
            ((logLevels[level]||logLevels.debug) >= $rdf.PointedGraph.logLevel)) {
            console.log("["+level+"] "+msg);
        }
    }

    // Specific functions for each level of logs.
    var debug = function(msg) { log('debug', msg); };
    var info = function(msg) { log('info', msg); };
    var warning = function(msg) { log('warning', msg); };
    var error = function(msg) { log('error', msg); };

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

	$rdf.PointedGraph.prototype.Fetcher = function() {
		var f = this.store.fetcher
		if (!f) {
			this.store.fetcher = new $rdf.Fetcher(pg.store, self.timeout, true);
		}
		return this.store.fetcher
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
	 * This is the key pointed graph relation. It returns the same PG
	 * if the pointer is defined in the named graph, and returns the PG in the remote
	 * graph if the pointer is remote.
	 * @param {boolean} existenceCheck  (default true) only jump to the remote graph
	 *   if a pointer in that graph exists with info about the pointer ( ie there are other relations )
	 * @return {PointedGraph}
	 */
    $rdf.PointedGraph.prototype.jump = function(existenceCheck) {
        var result = undefined
        var check = existenceCheck?existenceCheck:true
        if (this.isLocalPointer()) result = this
        else {
            var docURL = $rdf.Stmpl.fragmentless(this.pointer.uri);
			   var proxiedDoc = $rdf.sym($rdf.Fetcher.crossSiteProxy(docURL)); // TODO, do not force access though proxy
            if ( this.store.statementsMatching(undefined, undefined, undefined, proxiedDoc, true).size > 0
                && ( !check
                ||  this.store.statementsMatching(this.pointer, undefined, undefined, proxiedDoc, true).size > 0
                ||  this.store.statementsMatching(undefined, undefined, this.pointer, proxiedDoc, true).size > 0)
                ) {
                result = $rdf.pointedGraph(this.store, this.pointer, $rdf.sym(docUrl), proxiedDoc);
            } else {
                result = this
            }
        }
        debug("PG(_," + this.pointer + "," + this.internalGraph + ").jump = PG(_,_," + result.webGraph+",_)");
        return result
    }

	/**
	 * find current jumped graph, but if it does not exist fetch it and return promise
	 * @param existenceCheck ( really check if
	 * @return ( PointedGraph | Promise[PointedGraph] )
	 */
	$rdf.PointedGraph.prototype.jumpNowOrLater = function(existenceCheck) {
		var check = existenceCheck?existenceCheck:true
		if (this.isLocalPointer()) return this;
		else {
			var docURL = $rdf.Stmpl.fragmentless(this.pointer.uri);
			var proxiedDoc = $rdf.sym($rdf.Fetcher.crossSiteProxy(docURL)); // TODO, do not force access though proxy
			if ( this.store.statementsMatching(undefined, undefined, undefined, proxiedDoc, true).size > 0
				&& ( !check
				||  this.store.statementsMatching(this.pointer, undefined, undefined, proxiedDoc, true).size > 0
				||  this.store.statementsMatching(undefined, undefined, this.pointer, proxiedDoc, true).size > 0)
				) {
				return $rdf.pointedGraph(this.store, this.pointer, $rdf.sym(docUrl), proxiedDoc);
			} else {
				return this.jumpAsync(check);
			}
		}
	}


	/**
	 * This is the key async pointed graph relation. It returns the same PG
	 * if the pointer is defined in the named graph, and returns the PG in the remote
	 * graph if the pointer is remote - but tries to fetch the remote graph first
	 * @param {boolean} existenceCheck (default true) only jump to the remote graph if a pointer
	 *   in that graph exists with info about the pointer ( ie there are other relations )
	 * @return {Promise[PointedGraph]}
	 */
	$rdf.PointedGraph.prototype.jumpAsync = function(existenceCheck) {
		var result = undefined
		var originalPG = this
		var check = existenceCheck?existenceCheck:true

		if (originalPG.isLocalPointer()) {
            debug("is a local pointer:",originalPG)
			result =  Q.fcall(function (){return originalPG })
		}
		else {
			var definitionalResource = originalPG.pointer.uri.split('#')[0];
			var fetcher = this.Fetcher();
            debug("notLocal: originalPG(_,",originalPG.pointer.value,",",originalPG.webGraph.value)
			result = fetcher.fetch(definitionalResource,originalPG.webGraph.uri).then(
				function(pg) {
					function jumpedGraphContainsInfo() {
						return pg.store.statementsMatching(undefined, undefined, undefined, pg.internalGraph, true).length > 0;
					}
					function pointerExistsAsSubject() {
						return (pg.store.statementsMatching(originalPG.pointer, undefined, undefined, pg.internalGraph, true).length > 0) ;
					}
					function pointerExistsAsObject() {
						return pg.store.statementsMatching(undefined, undefined, originalPG.pointer, pg.internalGraph, true).length > 0;
					}
//					debug("defGr("+originalPG.pointer + ")= "+pg.internalGraph+" contains info:"+jumpedGraphContainsInfo()
//						+ " as subj: "+pointerExistsAsSubject()
//						+ " as object: "+pointerExistsAsObject())
					if (jumpedGraphContainsInfo()
						&& ( !check
						|| pointerExistsAsSubject()
						|| pointerExistsAsObject()
						)) {
						return $rdf.pointedGraph(pg.store, originalPG.pointer, pg.webGraph, pg.internalGraph)
					} else {
						return originalPG
					}
				}
			)
		}
		return result
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
        var self = this;

        // List of PGs.
        debug("getSymbol !!!")
        var pgList = this.rels.apply(this, arguments);
        debug(pgList)

        //
        var infoTab =
            _.chain(pgList)
                .filter(function (pg) {
                    return (pg.pointer.termType == 'symbol');
                })
                .map(function(pg) {
                    return pg.pointer.value
                })
                .value();
        debug(infoTab)
        return infoTab
    }

    // relUri => List[Literal]
    $rdf.PointedGraph.prototype.getLiteral = function () {
        var self = this;

        // List of PGs.
        debug("getLiteral !!!")
        var pgList = this.rels.apply(this, arguments);
        debug(pgList)

        //
        var infoTab =
            _.chain(pgList)
                .filter(function (pg) {
                    debug(pg.pointer.termType)
                    return (pg.pointer.termType == 'literal');
                })
                .map(function (pg) {
                    return pg.pointer.value
                })
                .value();
        debug(infoTab)
        return infoTab;
    }

	$rdf.PointedGraph.prototype.relFirst = function(relUri) {
		var l = $rdf.PointedGraph.prototype.rel(relUri);
		if (l.length > 0) return l[0];
	}

    // Interaction with the PGs.
    $rdf.PointedGraph.prototype.destroy = function () {}

    $rdf.PointedGraph.prototype.delete = function(relUri, value) {
        var queryDelete =
            'PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n' +
            'DELETE DATA \n' +
            '{' + "<" + this.pointer.value + ">" + relUri + ' "' + value + '"' + '. \n' + '}';


        // Sparql request return a promise.
        return sparqlPatch(this.pointer.value, queryDelete);
    }

    $rdf.PointedGraph.prototype.insert = function(relUri, value) {
        var queryInsert =
            'PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n' +
            'INSERT DATA \n' +
            '{' + "<" + this.pointer.value + ">" + relUri + ' "' + value + '"' + '. \n' + '}';

        // Sparql request return a promise.
        return sparqlPatch(this.pointer.value, queryInsert);
    }

    $rdf.PointedGraph.prototype.update = function (relUri, oldvalue, newValue) {
        var queryDeleteInsert =
            'DELETE DATA \n' +
                '{' + "<" + this.pointer.value + "> " + relUri + ' "' + oldvalue + '"' + '} ;\n' +
            'INSERT DATA \n' +
                '{' + "<" + this.pointer.value + "> " + relUri + ' "' + newValue + '"' + '. } ';

        // Sparql request return a promise.
        console.log("$rdf.PointedGraph.prototype.update")
        console.log(queryDeleteInsert)
        return sparqlPatch(this.pointer.value, queryDeleteInsert);
    }

    // Future.
    $rdf.PointedGraph.prototype.future = function(pointer, name) {
		$rdf.PointedGraph(this.store, pointer, name,$rdf.Fetcher.crossSiteProxy(name))
	}

	// Is the symbol defined in the named graph pointed to by this PointedGraph
	$rdf.PointedGraph.prototype.isLocal = function (symbol) {
		var gName = this.webGraph;
		if (symbol.termType === 'literal' || symbol.termType === 'bnode') {
			return true
		} else {
			//todo: not perfect ( does not take care of 303 redirects )
            var doc = symbol.uri.split('#')[0];
			return gName && doc === gName.uri;
		}
	}

	$rdf.PointedGraph.prototype.isLocalPointer = function() {
		var self = this
		return self.isLocal(self.pointer)
	}

	$rdf.PointedGraph.prototype.print= function() {
		return "PG(<"+this.pointer+">, <"+this.webGraph+"> = { "+
		$rdf.Serializer(this.store).statementsToN3(this.store.statementsMatching(undefined, undefined, undefined, this.internalGraph)) + "}"
	}


    /**
     * Return a string key for the current pointer.
     * This is useful for React to be able to associate a key to each relation to avoid recreating dom nodes
     * Note that the key value must be unique or React can't handle this
     * @returns
     */
    // TODO not sure it's a good idea neither if it's well implemented
    $rdf.PointedGraph.prototype.getPointerKeyForReact = function() {
        if ( this.pointer.termType == 'bnode' ) {
            return "BNode-"+this.pointer.id; // TODO not sure it's a good idea (?)
        }
        else if ( this.pointer.termType == 'symbol' ) {
            return this.pointer.value;
        }
        else {
            // TODO for literals we re render???
            return "Literal-TODO-"+Math.random().toString(36).substring(7);
        }
    }

    /**
     * Returns the URL of the pointer if the pointer is on a symbol.
     * This means that it will return "undefined" if the pointer is on a blank node or a literal
     */
    $rdf.PointedGraph.prototype.getPointerUrl = function() {
        if ( this.pointer.termType == "symbol" ) {
            return this.pointer.value;
        }
    }



	return $rdf.PointedGraph;
}();
