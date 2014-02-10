// A object holding the module foaf.
var PGUtils = {};


/**
 * Get the list of pgs that follows the last relSym in the array.
 * @param pg
 * @param relSymArray: path of relSyms.
 * i.e. : [relSym0, relSym1, relSym2]: relSym2 is immediate child of relSym1 which is immediate chile of relSym0
 * @returns => List[pg]
 */
PGUtils.getPgsWithRelSymPath = function(pg, relSymArray) {
    var inc = 0;

    // If the path is empty return an empty list.
    if (relSymArray.length == 0) return [];

    // Tail recursive function traverse the path and get all Pgs of the last rel in relSymArray.
    var getPgsWithRelSymPathRec = function(pgList) {
        if (inc == relSymArray.length - 1) {
            return pgList;
        }
        else {
            inc = inc + 1;
            var pgRecList = _.chain(pgList)
                .map(function(pgRec) {
                    return pgRec.rel(relSymArray[inc])
                }).flatten().value();
            return getPgsWithRelSymPathRec(pgRecList)
        }
    }

    // Call the tail recursive function with the first rel.
    return getPgsWithRelSymPathRec(pg.rel(relSymArray[inc]));
}


PGUtils.updateStoreWithRelSymPath = function(pg, relSymPath, newValue) {
    // Get the list of parent in the rel path.
    var relSymPathHead = _.initial(relSymPath);

    // Get the target relSym.
    var relSymPathLast = _.last(relSymPath);

    // Get all Pgs that verified the relSym in the path.
    var pgList = PGUtils.getPgsWithArray(pg, relSymPathHead);

    // Update the store in the list of Pgs.
    _.map(pgList, function(pgItem) {
        pgItem.updateStore(relSymPathLast, newValue)
    });
}

/**
 * Get the list of pgs that follows the last relSym in the array.
 * @param pg
 * @param relSymArray: path of relSyms.
 * i.e. : [relSym0, relSym1, relSym2]: relSym2 is immediate child of relSym1 which is immediate chile of relSym0
 * @returns => List[pg]
 */
PGUtils.getPgsWithArray = function(pg, relSymArray) {
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


PGUtils.addRel = function(pg, rel, object) {
    pg.store.add(pg.pointer, rel, object, pg.namedGraphFetchUrl );
}

PGUtils.removeRel = function(pg, rel, object) {
    var st = $rdf.st(pg.pointer, rel, object, pg.namedGraphFetchUrl);
    pg.store.remove(st);
    //pg.store.removeMany(pg.pointer, rel, object, pg.namedGraphFetchUrl );
}
