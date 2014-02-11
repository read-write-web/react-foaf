/** @jsx React.DOM */

// this source code can be useful: https://github.com/facebook/react/blob/master/src/core/ReactCompositeComponent.js
define(['rdflib', 'react'], function ($rdf, React) {

var mixins = {}
/**
 * Just a simple way to declare the initial state is not null but is empty
 */
mixins.WithEmptyInitialState = {
    getInitialState: function() {
        return {};
    }
}


/**
 * Mixin to log the component lifecycle
 */
mixins.WithLogger = {

    // TODO temporary, all JSX compiled components will all have a this.displayName so we won't have to use  this.componentName anymore
    getPrefix: function() {
        if ( this.displayName || this.componentName ) {
            return "["+this.componentName+"]";
        } else {
            throw "You need to declare componentName: \"xxx\" in your component in order to be able to use the LoggingMixin";
        }
    },

    prefixArray: function() {
        if ( this.props.key ) {
            return [this.getPrefix(),"["+this.props.key+"]"]
        } else {
            return [this.getPrefix()]
        }
    },

    prefixLogArguments: function(arg) {
        return _.union( this.prefixArray(), _.toArray(arg) )
    },

    debug: function() {
        console.debug.apply(console, this.prefixLogArguments(arguments));
    },
    log: function() {
        console.log.apply(console, this.prefixLogArguments(arguments));
    },
    info: function() {
        console.info.apply(console, this.prefixLogArguments(arguments));
    },
    warn: function() {
        console.warn.apply(console, this.prefixLogArguments(arguments));
    },
    error: function() {
        console.error.apply(console, this.prefixLogArguments(arguments));
    }


};



/**
 * Mixin to log the component lifecycle
 * It requires the WithLogger mixin to be used
 */
mixins.WithLifecycleLogging = {

    componentWillMount: function() {
        this.debug("componentWillMount. Initial state:",this.state);
    },

    componentDidMount: function(rootNode) {
        this.debug("componentDidMount",rootNode);
    },

    componentWillReceiveProps: function(nextProps) {
        this.debug("componentWillReceiveProps. Current props/state:",this.props,this.state," New props:",nextProps);
    },

    componentWillUpdate: function(nextProps, nextState) {
        this.debug("componentWillUpdate. Current props/state:  ",this.props,this.state," New props/state:",nextProps,nextState)
    },

    componentDidUpdate: function(prevProps, prevState, rootNode) {
        this.debug("componentDidUpdate. Current props/state: ",this.props,this.state," Previous props/state:",prevProps,prevState);
    },

    componentWillUnmount: function() {
        this.debug("componentWillUnmount");
    }

};

/**
 * Same as WithLifecycleLogging but less verbose
 */
mixins.WithLifecycleLoggingLite = {

    componentWillMount: function() {
        this.debug("componentWillMount");
    },

    componentWillUpdate: function(nextProps, nextState) {
        // this.debug("componentWillUpdate. New props/state:",nextProps,nextState)
    },

    componentWillUnmount: function() {
        this.debug("componentWillUnmount");
    }

};


/**
 * ReactLink encapsulates a common pattern in which a component wants to modify
 * a prop received from its parent. ReactLink allows the parent to pass down a
 * value coupled with a callback that, when invoked, expresses an intent to
 * modify that value. For example:
 *
 * React.createClass({
 *   getInitialState: function() {
 *     return {value: ''};
 *   },
 *   render: function() {
 *     var valueLink = new ReactLink(this.state.value, this._handleValueChange);
 *     return <input valueLink={valueLink} />;
 *   },
 *   this._handleValueChange: function(newValue) {
 *     this.setState({value: newValue});
 *   }
 * });
 *
 * We have provided some sugary mixins to make the creation and
 * consumption of ReactLink easier; see LinkedValueMixin and LinkedStateMixin.
 */

/**
 * @param {*} value current value of the link
 * @param {function} requestChange callback to request a change
 */
function ReactLink(value, requestChange) {
    this.value = value;
    this.requestChange = requestChange;
    // TODO: devrais être
}


//
function FOAF(key) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+key) }
function CONTACT(key) { return $rdf.sym("http://www.w3.org/2000/10/swap/pim/contact#"+key) }
function GEOLOC(key) { return $rdf.sym("http://www.w3.org/2003/01/geo/wgs84_pos#" + key) }
function RDFS(key) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+key) }

mixins.mapKeyToSym = {
    "foaf:name": FOAF("name"),
    "foaf:nick": FOAF("nick"),
    "foaf:givenName": FOAF("givenName"),
    "foaf:givenname": FOAF("givenname"),
    "foaf:familyName": FOAF("family_name"),
    "foaf:firstName": FOAF("firstName"),
    "foaf:workplaceHomepage": FOAF("workplaceHomepage"),
    "foaf:mbox": FOAF("mbox"),
    "foaf:phone": FOAF("phone"),
    "foaf:homepage": FOAF("homepage"),
    "contact:street": [CONTACT("home"), CONTACT("address"),CONTACT("street")],
    "contact:postalCode": [CONTACT("home"), CONTACT("address"),CONTACT("postalCode")],
    "contact:city": [CONTACT("home"), CONTACT("address"),CONTACT("city")],
    "contact:country": [CONTACT("home"), CONTACT("address"),CONTACT("country")]
};


/**
 * A simple mixin around ReactLink.forState().
 */
mixins.RdfLinkedPgMixin = {
    /**
     * Create a ReactLink that's linked to part of this component's state. The
     * ReactLink will have the current value of this.state[key] and will call
     * setState() when a change is requested.
     *
     * @param {pointedGraph, rel}
     *      pointerGraph: pointedGraph containing the graph to be updated.
     *      rel: string of attribute that is being updated (foaf:name, foaf:name, ...)
     * @return {ReactLink} ReactLink instance linking to the state.
     */

    linkToPgLiteral: function(PG, rel) {
        function getCurrentValue() {
            // Get the appropriate relSym to update.
            var relSym = mixins.mapKeyToSym[rel];

            // Use rel and PG to get corresponding value.
            if (!relSym.length) {
                return foafUtils.getValue(PG, relSym)[0];
            } else {
                return foafUtils.getValueWithRelSymPath(PG, relSym)[0];
            }
        }
        function onRequestChange(newValue) {
            // Get the appropriate relSym to update.
            var relSym = mixins.mapKeyToSym[rel];

            // Update the store with newValue.
            if (!relSym.length) {
                PG.updateStore(relSym, newValue);
            } else {
                PGUtils.updateStoreWithRelSymPath(PG, relSym, newValue);
            }

            // Set new value on component.
            this.value = newValue;
        }
        return new ReactLink(getCurrentValue(),onRequestChange);
    }
};

return mixins;

});