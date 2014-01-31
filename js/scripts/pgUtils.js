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

