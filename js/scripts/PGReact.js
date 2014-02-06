
/**
 * Just a little utility to integrate well pointed graphs and React
 */
define("PGReact",["rdflib-pg-extension"], function (rdflibPg, React) {

    return {
        // TODO not sure it's a good idea neither if it's well implemented
        // TODO this file should not contain anything related to ReactJS lib...
        /**
         * Return a string key for the current pointer.
         * This is useful for React to be able to associate a key to each relation to avoid recreating dom nodes
         * Note that the key value must be unique or React can't handle this
         * @returns
         */
        getPointerKeyForReact: function(pg) {
            if ( pg.isBlankNodePointer() ) {
                return "BNode-"+pg.pointer.id; // TODO not sure it's a good idea (?)
            }
            else if ( pg.isSymbolPointer() ) {
                return rdflibPg.Utils.symbolNodeToUrl(pg.pointer);
            }
            else if ( pg.isLiteralPointer() ) {
                return rdflibPg.Utils.literalNodeToValue(pg.pointer);
            }
            else {
                throw new Error("Unexpected pointed type:" + pg.pointer);
            }
        }
    }

});