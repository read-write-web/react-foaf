var pgUtils = {};


/**
 * Get the nodes for a given relation symbol
 * @param pg
 * @param relSym
 * @returns => List[Nodes]
 */
pgUtils.getNodes = function(pg, relSym) {
    return _.chain( pg.rels(relSym) )
        .map(function(pg) {
            return pg.pointer;
        }).value();
}

pgUtils.getLiteralNodes = function(pg, relSym) {
    return _.chain(pgUtils.getNodes(pg,relSym))
        .filter($rdf.Stmpl.isLiteralNode)
        .value();
}
pgUtils.getSymbolNodes = function(pg, relSym) {
    return _.chain(pgUtils.getNodes(pg,relSym))
        .filter($rdf.Stmpl.isSymbolNode)
        .value();
}
pgUtils.getBlankNodes = function(pg, relSym) {
    return _.chain(pgUtils.getNodes(pg,relSym))
        .filter($rdf.Stmpl.isBlankNode)
        .value();
}


/**
 * Get the list of pgs that follows the last relSym in the array.
 * @param pg
 * @param relSymArray: path of relSyms.
 * i.e. : [relSym0, relSym1, relSym2]: relSym2 is immediate child of relSym1 which is immediate chile of relSym0
 * @returns => List[pg]
 */
pgUtils.getPgsWithArray = function(pg, relSymArray) {
    var inc = 0;

    // If the path is empty return an empty list.
    if (relSymArray.length == 0) return [];

    // Tail recursive function traverse the path and get all Pgs of the last rel in relSymArray.
    var getPgsWithArrayRec = function(pgList) {
        if (inc == relSymArray.length - 1) {
            return pgList;
        }
        else {
            inc = inc + 1;
            var pgRecList = _.chain(pgList)
                .map(function(pgRec) {
                    return pgRec.rel(relSymArray[inc])
                }).flatten().value();
            return getPgsWithArrayRec(pgRecList)
        }
    }

    // Call the tail recursive function with the first rel.
    return getPgsWithArrayRec(pg.rel(relSymArray[inc]));
}

/**
 *
 * @param pgList
 * @returns {*}
 */
pgUtils.getLiteralValues = function(pgList) {
    var rels = (slice.call(arguments, 1));
    var res =  _.chain(pgList)
        .map(function (pg) {
            return pg.getLiteral(rels);
        })
        .flatten()
        .value();
    return res;
}

pgUtils.pointerPredicate = function(nodePredicate) {
    return function(pg) {

    }
}


pgUtils.pgFilters = {};
pgUtils.pgFilters.isLiteralPointer = function(pg) {
    return pg.isLiteralPointer();
}
pgUtils.pgFilters.isBlankNodePointer = function(pg) {
    return pg.isBlankNodePointer();
}
pgUtils.pgFilters.isSymbolPointer = function(pg) {
    return pg.isSymbolPointer();
}


pgUtils.pgTransformers = {};
pgUtils.pgTransformers.literalPointerToValue = function(pg) {
    return $rdf.Stmpl.literalNodeToValue(pg.pointer);
}
pgUtils.pgTransformers.symbolPointerToValue = function(pg) {
    return $rdf.Stmpl.symbolNodeToUrl(pg.pointer);
}

