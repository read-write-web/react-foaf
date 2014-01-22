var pgUtils = {};


// TODO this will be enhanced later, not used yet!


pgUtils.literalNodePredicate = function(node) {
    return node instanceof $rdf.Literal;
}
pgUtils.symbolNodePredicate = function(node) {
    return node instanceof $rdf.Symbol;
}
pgUtils.blankNodePredicate = function(node) {
    return node instanceof $rdf.BlankNode;
}

pgUtils.literalNodeToValue = function(literalNode) {
    return literalNode.value;
}


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
        .filter(pgUtils.literalNodePredicate)
        .value();
}
pgUtils.getSymbolNodes = function(pg, relSym) {
    return _.chain(pgUtils.getNodes(pg,relSym))
        .filter(pgUtils.symbolNodePredicate)
        .value();
}
pgUtils.getBlankNodes = function(pg, relSym) {
    return _.chain(pgUtils.getNodes(pg,relSym))
        .filter(pgUtils.blankNodePredicate)
        .value();
}


pgUtils.getLiteralValues = function(pg, relSym) {
    return _.chain(pgUtils.getLiteralNodes(pg,relSym))
        .map(pgUtils.literalNodeToValue)
        .value();
}


