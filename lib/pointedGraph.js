/**
 *
 * @param {$rdf.store} store - Quad Store
 * @param {$rdf.sym} pointer onto an object.  Type : $rdf.sym() - ie Literal, Bnode, or URI
 * @param {$rdf.sym} webGraphName name of graph in which to point -  Type : $rdf.sym() but limited to URI
 * @param {$rdf.sym} internalGraphName - optional internal graph name, when the internal graph is different due to going through a proxy
 * @return {$rdf.PointedGraph}
 */
$rdf.pointedGraph = function(store, pointer, webGraphName, internalGraphName) {
	return new $rdf.PointedGraph(store, pointer, webGraphName, internalGraphName);
};


$rdf.PointedGraph = function() {
	$rdf.PointedGraph = function(store, pointer, webGraphId, internalId){
		this.store = store;
		this.pointer = pointer; //# // Type : $rdf.sym()
		this.webGraph = webGraphId;
		this.internalGraph = (internalId)?internalId:$rdf.sym($rdf.Fetcher.crossSiteProxy(webGraphId.uri))
	};
	$rdf.PointedGraph.prototype.constructor = $rdf.PointedGraph;

    // Utils
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

	/**
	 *
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
				 var f = new $rdf.Fetcher(pg.store, self.timeout, true);
				 var docURL = pg.pointer.uri.split('#')[0];
				 var promise = f.fetch(docURL, pg.webGraph.uri);
				 promise.then(
					 function (newPg) {
						 //todo: need to deal with errors
						 console.log("observableRel("+relUri+")=PG(_,"+pg.pointer+", "+ newPg.webGraph+")");
						 observer.onNext($rdf.pointedGraph(pg.store, pg.pointer, newPg.webGraph, newPg.internalGraph))
					 },
					 function (err) {
						 console.log("Observable rel => On Error for " + pg.graphName);
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
			var definitionalResource = this.pointer.uri.split('#')[0];
			var proxiedDoc = $rdf.sym($rdf.Fetcher.crossSiteProxy(definitionalResource))
			if ( this.store.statementsMatching(undefined, undefined, undefined, proxiedDoc, true).size > 0
				&& ( !check
			   ||  this.store.statementsMatching(this.pointer, undefined, undefined, proxiedDoc, true).size > 0
				||  this.store.statementsMatching(undefined, undefined, this.pointer, proxiedDoc, true).size > 0)
				) {
				result = $rdf.pointedGraph(pg.store, pg.pointer, $rdf.sym(pg.docUrl), remoteDoc)
			} else {
				result = this
			}
		}
		console.log("PG(_," + this.pointer + "," + this.internalGraph + ").jump = PG(_,_," + result.webGraph+",_)")
		return result

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
			result =  new RSVP.Promise(function (resolve, reject) {
				resolve(originalPG)
			})
		}
		else {
			var definitionalResource = originalPG.pointer.uri.split('#')[0];
			var fetcher = new $rdf.Fetcher(originalPG.store)
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
//					console.log("defGr("+originalPG.pointer + ")= "+pg.internalGraph+" contains info:"+jumpedGraphContainsInfo()
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
		console.log("**** in jumpRel *** with " + relUri)
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
					console.log("there is dta in " + doc + " so we make a new PG for it")
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
        console.log("getSymbol !!!")
        var pgList = this.rels.apply(this, arguments);
        console.log(pgList)

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
        console.log(infoTab)
        return infoTab
    }

    // relUri => List[Literal]
    $rdf.PointedGraph.prototype.getLiteral = function () {
        var self = this;

        // List of PGs.
        console.log("getLiteral !!!")
        var pgList = this.rels.apply(this, arguments);
        console.log(pgList)

        //
        var infoTab =
            _.chain(pgList)
                .filter(function (pg) {
                    console.log(pg.pointer.termType)
                    return (pg.pointer.termType == 'literal');
                })
                .map(function (pg) {
                    return pg.pointer.value
                })
                .value();
        console.log(infoTab)
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

	return $rdf.PointedGraph;
}();
