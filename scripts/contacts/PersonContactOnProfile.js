/** @jsx React.DOM */

var PersonContactOnProfile = React.createClass({
    mixins: [WithLogger,WithLifecycleLoggingLite],
    componentName: "PersonContactOnProfile",

    propTypes: {
        onPersonContactClick: React.PropTypes.func.isRequired,
        personPG: React.PropTypes.instanceOf($rdf.PointedGraph).isRequired,
        filterText: React.PropTypes.string.isRequired,
        // Optional:
        jumpedPersonPG: React.PropTypes.instanceOf($rdf.PointedGraph),
        jumpFailure: React.PropTypes.bool
    },

    handleClick: function(e) {
        // TODO maybe not appropriate? we may be able to click on a namednode before it has been jumped?
        if ( this.props.jumpedPersonPG ) {
            this.props.onPersonContactClick();
        }
        else {
            alert("graph not jumped: can't click on it");
        }
        return true;
    },


    isJumpFailure: function() {
        return this.props.jumpFailure;
    },

    isNotJumpedYet: function() {
        return !this.props.jumpedPersonPG && !this.isJumpFailure();
    },

    getGraphList: function() {
        // order matters I think because we'll try to get data from the first graph in priority
        var graphs = [this.props.personPG];
        if ( this.props.jumpedPersonPG ) {
            graphs.unshift(this.props.jumpedPersonPG);
        }
        return graphs;
    },


    render: function() {
        var graphList = this.getGraphList();

        var liClasses = React.addons.classSet({
            'contact': true,
            'clearfix': true,
            'float-left': true,
            'loading': this.isNotJumpedYet(),
            'error': this.isJumpFailure(),
            'filtered-user' : !this.displayUser(graphList)
        });

        // Return.
        return (
            <li className={liClasses} onClick={this.handleClick}>
                <div className="loader"></div>
                <PersonContactOnProfilePix personPGs={graphList} />
                <PersonContactOnProfileBasicInfo personPGs={graphList} />
                <PersonContactOnProfileNotifications personPGs={graphList} getNotifications={this.getNotifications}/>
                <PersonContactOnProfileMessage personPG={graphList}/>
            </li>
            );
    },


    // TODO maybe this should be handled on the top-level jump wrapper directly, to keep this comp simpler
    displayUser: function(graphList) {
        // TODO this is bad, we use toString on an object which contains an array, kind of strangrr
        var userName = foafUtils.getName(graphList).toString().toLowerCase();
        var filterText = this.props.filterText;
        if (!filterText) return true;
        else {
            filterText = filterText.toString().toLowerCase();
            return (userName.indexOf(filterText) != -1) && (userName.indexOf(filterText) == 0);
        }
    }

});
