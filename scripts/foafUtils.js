
// A object holding the module foaf.
var foafUtils = {}

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function CONTACT(name) { return $rdf.sym("http://www.w3.org/2000/10/swap/pim/contact#"+name) }
function GEOLOC(name) { return $rdf.sym("http://www.w3.org/2003/01/geo/wgs84_pos#" + name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }

foafUtils.getEmails = function(pgList) {
    var emailsList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("mbox"))
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
    return emailsList;
};

foafUtils.getPhones = function(pgList) {
    var phonesList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("phone"))
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
    return phonesList;
};

foafUtils.getHomepages = function(pgList) {
    var homepagesList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("homepage"))
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
    return homepagesList;
};

foafUtils.getworkplaceHomepages = function(pgList) {
    var workplaceHomepagesList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("workplaceHomepage"))
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
    return workplaceHomepagesList;
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
                }
                return address;
            }).flatten()
            .value();
    return resList;
};

foafUtils.getName = function(pgList) {
    var nameList =
        _.chain(pgList)
            .map(function (pg) {
                return pg.rels(FOAF("name"))
            })
            .flatten()
            .map(function(pg) {
                return pg.pointer.value;
            }).value();
    return nameList;
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
        name: relLiteral(FOAF("name")),
        givenname: relLiteral(FOAF("givenName"),FOAF("givenname")),
        family_name: relLiteral(FOAF("familyName"),FOAF("family_name")),
        firstname: relLiteral(FOAF("firstName"))
    };

    return nameObject;
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
            .flatten().value()
            return (thumbs.length == 0) ? [imgPG.pointer] : thumbs
        }
    ).flatten().value();

    return imgUrlList;
};


