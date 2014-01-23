
// A object holding the module foaf.
var foafUtils = {};

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function CONTACT(name) { return $rdf.sym("http://www.w3.org/2000/10/swap/pim/contact#"+name) }
function GEOLOC(name) { return $rdf.sym("http://www.w3.org/2003/01/geo/wgs84_pos#" + name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }


foafUtils.removeStringPrefix = function(string,prefix) {
    if ( string && string.indexOf(prefix) != -1)  {
        return string.split(prefix)[1];
    } else {
        return string;
    }
}

foafUtils.cleanEmail = function(email) {
    return foafUtils.removeStringPrefix(email,"mailto:");
}


foafUtils.cleanPhone = function(phone) {
    return foafUtils.removeStringPrefix(phone,"tel:");
}

/**
 *
 * @params {PointedGraph, $rdf.sym1, $rdf.sym2, ...} $rdf.sym: relUri the relation from this node
 * @returns => List[Literal] or List[Symbol]
 */
foafUtils.getLiteral = function(pgList, relSym){
    return _.chain(pgList)
            .map(function (pg) {
                return pg.rels(relSym)
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
};

foafUtils.getEmails = function(pgList) {
    return _.chain(pgList)
        .map(function (pg) {
            return pg.getSymbol(FOAF("mbox"))
        })
        .flatten()
        .map(foafUtils.cleanEmail)
        .value();
};

foafUtils.getPhones = function(pgList) {
    return _.chain(pgList)
        .map(function (pg) {
            return pg.getSymbol(FOAF("phone"))
        })
        .flatten()
        .map(foafUtils.cleanPhone)
        .value();
};

foafUtils.getHomepages = function(pgList) {
    return _.chain(pgList)
        .map(function (pg) {
            return pg.getSymbol(FOAF("homepage"))
        })
        .flatten()
        .value();

};

foafUtils.getName = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("name"))
            }).flatten()
            .value();

    return {
        0:"foaf:name",
        1: resList
    };
};

foafUtils.getGivenName = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("givenName"), FOAF("givenname"))
            }).flatten()
            .value();

    return {
        0:"foaf:givenname",
        1: resList
    };
};

foafUtils.getFamilyName = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("familyName"), FOAF("family_name"))
            }).flatten()
            .value();

    return {
        0:"foaf:family_name",
        1: resList
    };
};

foafUtils.getFirstName = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("firstName"), FOAF("first_name"))
            }).flatten()
            .value();

    return {
        0:"foaf:firstName",
        1: resList
    };
};

foafUtils.getLastName = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("lastName"), FOAF("last_name"))
            }).flatten()
            .value();

    return {
        0:"foaf:lastName",
        1: resList
    };
};

foafUtils.getGender = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("gender"))
            }).flatten()
            .value();

    return {
        0:"foaf:gender",
        1: resList
    };
};

foafUtils.getworkplaceHomepage = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getSymbol(FOAF("workplaceHomepage"))
            }).flatten()
            .value();

    return {
        0:"foaf:workplaceHomepage",
        1: resList
    };
};

foafUtils.getWorkInfoHomepage = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.getLiteral(FOAF("workInfoHomepage"))
            }).flatten()
            .value();

    return {
        0:"foaf:workInfoHomepage",
        1: resList
    };
};



foafUtils.getNames = function(pgList) {
    var relLiteral = function (relSym) {
        return _.chain(pgList)
            .map(function (pg){
                    return _.compact(_.map(pg.rels(relSym),function (litPG) {
                            return (litPG.pointer.termType === "literal") ? litPG.pointer.value  : undefined
                        }))
                }
            )
            .flatten().value();
    };

    var nameObject = {
        "foaf:name": relLiteral(FOAF("name")),
        "foaf:givenname": relLiteral(FOAF("givenName"),FOAF("givenname")),
        "foaf:family_name": relLiteral(FOAF("familyName"),FOAF("family_name")),
        "foaf:firstname": relLiteral(FOAF("firstName"))
    };

    return nameObject;
};

foafUtils.getContactHome = function(pgList) {
    var latList = foafUtils.getGeoLatitude(pgList);
    var longList = foafUtils.getGeoLongitude(pgList);
    var addressList = foafUtils.getContactAddress(pgList);

    return {lat:latList, long:longList, address:addressList};
};

foafUtils.getGeoLatitude = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(GEOLOC("lat"))
            }).flatten()
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    return resList;
};

foafUtils.getGeoLongitude = function(pgList) {
    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(GEOLOC("long"))
            }).flatten()
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    return resList;
};

foafUtils.getContactStreet = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(CONTACT("address"))
            }).flatten()
            .map(function(pg) {
                return relLiteral(pg, CONTACT("street"));
            }).flatten()
            .value();

    return {
        0:"contact:street",
        1: resList
    };
};


foafUtils.getContactPostalCode = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(CONTACT("address"))
            }).flatten()
            .map(function(pg) {
                return relLiteral(pg, CONTACT("postalCode"));
            }).flatten()
            .value();

    return {
        0:"contact:postalCode",
        1: resList
    };
};

foafUtils.getContactCity = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(CONTACT("address"))
            }).flatten()
            .map(function(pg) {
                return relLiteral(pg, CONTACT("city"));
            }).flatten()
            .value();

    return {
        0:"contact:city",
        1: resList
    };
};

foafUtils.getContactCountry = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(CONTACT("address"))
            }).flatten()
            .map(function(pg) {
                return relLiteral(pg, CONTACT("country"));
            }).flatten()
            .value();

    return {
        0:"contact:country",
        1: resList
    };
};

foafUtils.getContactAddress = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    var resList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(CONTACT("home"))
            }).flatten()
            .map(function(pg) {
                return pg.rels(CONTACT("address"))
            }).flatten()
            .map(function(pg) {
                var address = {
                    city: relLiteral(pg, CONTACT("city")),
                    country: relLiteral(pg, CONTACT("country")),
                    postalCode: relLiteral(pg, CONTACT("postalCode")),
                    street: relLiteral(pg, CONTACT("street"))
                };
                return address;
            }).flatten()
            .value();
    return resList;
};


foafUtils.getImg = function (pgList) {
    var imgUrlList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("logo"), FOAF("img"), FOAF("depiction"))
            })
            .flatten()
            .map(function(imgPG) {
                return imgPG.pointer.value;
            }).value();

    return imgUrlList;
};


foafUtils.getThumbnail = function (pgList) {
    var imgUrlList = [];
    var pixSyms =
        _.chain(pgList)
            .map(function (imgPG) {
                var thumbs = _.chain(imgPG.rel(FOAF("thumbnail"))).map(function (thumbPG) {
                    return (thumbPG.pointer.termType == "symbol") ? [thumbPG.pointer] :
                        (imgPG.pointer.termType == "symbol") ? [imgPG.pointer] : []

                })
                    .flatten().value();
                return (thumbs.length == 0) ? [imgPG.pointer] : thumbs
            }
        ).flatten().value();

    return imgUrlList;
};


