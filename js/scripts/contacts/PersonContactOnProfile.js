/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'foafUtils',
        'jsx!PersonContactOnProfilePix',
        'jsx!PersonContactOnProfileBasicInfo',
        'jsx!PersonContactOnProfileNotifications',
        'jsx!PersonContactOnProfileMessage'

], function (React, mixins, ReactWithAddons, foafUtils,
             PersonContactOnProfilePix,
             PersonContactOnProfileBasicInfo,
             PersonContactOnProfileNotifications,
             PersonContactOnProfileMessage
    ) {

var PersonContactOnProfile = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
    componentName: "PersonContactOnProfile",

    propTypes: {
        onPersonContactClick: React.PropTypes.func.isRequired,
        personPG: React.PropTypes.instanceOf($rdf.PointedGraph).isRequired,
        filterText: React.PropTypes.string.isRequired,
        // Optional:
        jumpedPersonPG: React.PropTypes.instanceOf($rdf.PointedGraph)
        // jumpError: optional and undefined type
    },


    handleClick: function(e) {
        // TODO maybe not appropriate? we may be able to click on a namednode before it has been jumped?
        if ( this.props.jumpedPersonPG ) {
            this.props.onPersonContactClick();
        }
        else if ( this.props.jumpError ) {
            alert("Error during jump, can't click on this graph:\n"+JSON.stringify(this.props.jumpError));
        }
        else {
            alert("Graph not jumped");
        }
        return true;
    },

    isJumpError: function() {
        return !!this.props.jumpError;
    },

    isNotJumpedYet: function() {
        return !this.props.jumpedPersonPG && !this.isJumpError();
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

        var liClasses = ReactWithAddons.addons.classSet({
            'contact': true,
            'clearfix': true,
            'float-left': true,
            'loading': this.isNotJumpedYet(),
            'error': this.isJumpError(),
            'filtered-user' : !this.displayUser(graphList)
        });

        // Return.
        return (
            <li className={liClasses} onClick={this.handleClick}>
                <div className="loader"></div>
                <PersonContactOnProfilePix personPG={graphList} />
                <PersonContactOnProfileBasicInfo personPGs={graphList} />
                <PersonContactOnProfileNotifications personPGs={graphList} getNotifications={this.getNotifications}/>
                <PersonContactOnProfileMessage personPG={graphList}/>
            </li>
            );
    },


    // TODO BAD: this should be handled in PersonContacts and filter the userlist
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

    return PersonContactOnProfile;

});