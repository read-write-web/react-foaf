/** @jsx React.DOM */

// this source code can be useful: https://github.com/facebook/react/blob/master/src/core/ReactCompositeComponent.js


/**
 * Mixin to log the component lifecycle
 */
var WithLogger = {

    // TODO temporary, all JSX compiled components will all have a this.displayName so we won't have to use  this.componentName anymore
    getPrefix: function() {
        if ( this.displayName || this.componentName ) {
            return "["+this.componentName+"]";
        } else {
            throw "You need to declare componentName: \"xxx\" in your component in order to be able to use the LoggingMixin";
        }
    },

    prefixLogArguments: function(arg) {
        var array = _.toArray(arg);
        array.unshift( this.getPrefix() );
        return array;
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
var WithLifecycleLogging = {

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
var WithLifecycleLoggingLite = {

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

