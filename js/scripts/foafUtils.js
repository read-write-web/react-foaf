
// A object holding the module foaf.
var foafUtils = {};

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function CONTACT(name) { return $rdf.sym("http://www.w3.org/2000/10/swap/pim/contact#"+name) }
function GEOLOC(name) { return $rdf.sym("http://www.w3.org/2003/01/geo/wgs84_pos#" + name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }

/*
* Local Utils.
* */
foafUtils.getValue = function(pg) {
    var args = (slice.call(arguments, 1));
    var resList = pg.getLiteral(args);
    if (resList.length == 0) resList = pg.getSymbol(args);
    return resList;
}

foafUtils.getValueWithRelSymPath = function(pg, relSymPath) {
    var pgList = pgUtils.getPgsWithArray(pg, relSymPath);
    var valList = _.chain(pgList)
        .map(function(pgMap) {
            return pgMap.pointer.value;
        }).value();
    return valList
}

function getValueList(pgList) {
    var args = (slice.call(arguments, 1));
    var res =  _.chain(pgList)
        .map(function (pg) {
            var r = pg.getLiteral(args);
            return (r.length==0)? pg.getSymbol(args) : r;
        }).flatten()
        .value();
    return res;
}

function removeStringPrefix(string,prefix) {
    if ( string && string.indexOf(prefix) != -1)  {
        return string.split(prefix)[1];
    } else {
        return string;
    }
}

function cleanEmail(email) {
    return removeStringPrefix(email,"mailto:");
}

function cleanPhone(phone) {
    return removeStringPrefix(phone,"tel:");
}

foafUtils.getEmails = function(pgList) {
    var res = getValueList(pgList, FOAF("mbox"));
    return _.map(res, cleanEmail);
};

foafUtils.getMbox = function(pgList) {
    var res = getValueList(pgList, FOAF("mbox"));
    return _.map(res, cleanEmail);
};

foafUtils.getPhones = function(pgList) {
    var res = getValueList(pgList, FOAF("phone"));
    return _.map(res, cleanPhone);
};

foafUtils.getHomepages = function(pgList) {
    return getValueList(pgList, FOAF("homepage"));
};

foafUtils.getName = function(pgList, options) {
    return getValueList(pgList, FOAF("name"));
};

foafUtils.getGivenName = function(pgList, options) {
    return getValueList(pgList, FOAF("givenName"), FOAF("givenname"));
};

foafUtils.getFamilyName = function(pgList, options) {
    return getValueList(pgList, FOAF("familyName"), FOAF("family_name"));
};

foafUtils.getFirstName = function(pgList, options) {
    return getValueList(pgList, FOAF("firstName"), FOAF("first_name"));
};

foafUtils.getLastName = function(pgList, options) {
    return getValueList(pgList, FOAF("lastName"), FOAF("last_name"));
};

foafUtils.getGender = function(pgList, options) {
    return getValueList(pgList, FOAF("gender"));
};

foafUtils.getworkplaceHomepage = function(pgList, options) {
    return getValueList(pgList, FOAF("workplaceHomepage"));
};

foafUtils.getWorkInfoHomepage = function(pgList, options) {
    return getValueList(pgList, FOAF("workInfoHomepage"));
};

foafUtils.getImg = function (pgList, options) {
    return getValueList(pgList, FOAF("logo"), FOAF("img"), FOAF("depiction"));
};

foafUtils.checkImgURL = function(url) {
    if (url.indexOf("file:", 0) !== -1) return false;
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) return true
    return false;
}

foafUtils.getFirstValidImg = function(pgList) {
    var imgUrlList = foafUtils.getImg(pgList);
    var imgUrlListCheck = _.chain(imgUrlList)
        .filter(foafUtils.checkImgURL) // TODO is this really necessary???
        .value();
    return _.first(imgUrlListCheck);
}

foafUtils.getThumbnail = function (pgList) {
    return getValueList(pgList, FOAF("thumbnail"));
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

    return _.chain(pgList)
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

};

foafUtils.getContactPostalCode = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    return _.chain(pgList)
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
};

foafUtils.getContactCity = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    return _.chain(pgList)
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
};

foafUtils.getContactCountry = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    return _.chain(pgList)
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
};

foafUtils.getContactAddress = function(pgList) {
    var relLiteral = function (pg, relSym) {
        return _.chain(pg.rels(relSym))
            .map(function (litPG) {
                return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
            })
            .flatten().value();
    };

    return _.chain(pgList)
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
};

foafUtils.mapAttrToFunc = {
    "foaf:name": foafUtils.getName,
    "foaf:givenName": foafUtils.getGivenName,
    "foaf:givenname": foafUtils.getGivenName,
    "foaf:familyName": foafUtils.getFamilyName,
    "foaf:firstName": foafUtils.getFirstName,
    "foaf:workplaceHomepage": foafUtils.getworkplaceHomepage,
    "foaf:mbox": foafUtils.getMbox,
    "foaf:phone": foafUtils.getPhones,
    "foaf:homepage": foafUtils.getHomepages,
    "contact:street": foafUtils.getContactStreet,
    "contact:postalCode": foafUtils.getContactPostalCode,
    "contact:city": foafUtils.getContactCity,
    "contact:country": foafUtils.getContactCountry
};
