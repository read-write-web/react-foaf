/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'foafUtils', 'PGUtils', 'notify',
        'jsx!PersonContactOnProfilePix',
        'jsx!PersonContactOnProfileBasicInfo',
        'jsx!PersonContactOnProfileNotifications',
        'jsx!PersonContactOnProfileMessage'

], function (React, mixins, ReactWithAddons, foafUtils, PGUtils, notify,
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

    render: function() {
        var graphList = this._getGraphList();
        var liClasses = ReactWithAddons.addons.classSet({
            'contact': true,
            'clearfix': true,
            'float-left': true,
            'loading': this._isNotJumpedYet(),
            'error': this._isJumpError(),
            'noWebId': this._isNotSymbolPointer(),
            'filtered-user' : !this._displayUser(graphList)
        });

        // Return.
        return (
            <li className={liClasses} onClick={this._handleClick}>
                <div className="loader"></div>
                <PersonContactOnProfilePix personPG={graphList} />
                <PersonContactOnProfileBasicInfo personPGs={graphList} />
                <PersonContactOnProfileNotifications personPGs={graphList} getNotifications={this.getNotifications}/>
                <PersonContactOnProfileMessage
                    personPG={graphList}
                    currentUserPG={this.props.currentUserPG}
                    onAddContact={this.props.onAddContact}
                    onRemoveContact={this.props.onRemoveContact}/>
            </li>
            );
    },

    _handleClick: function(e) {
        // TODO maybe not appropriate? we may be able to click on a namednode before it has been jumped?
        if ( this.props.jumpedPersonPG ) {
            this.props.onPersonContactClick();
        }
        else if ( this.props.jumpError ) {
            notify("error", "Error during jump, can't click on this graph.");
            //alert("Error during jump, can't click on this graph:\n"+JSON.stringify(this.props.jumpError));
        }
        else {
            notify("error", "Graph not jumped.");
        }
        return true;
    },

    _isJumpError: function() {
        return !!this.props.jumpError;
    },

    _isNotJumpedYet: function() {
        return !this.props.jumpedPersonPG && !this._isJumpError();
    },

    _isNotSymbolPointer: function() {
        if (this.props.jumpedPersonPG) {
            return !this.props.jumpedPersonPG.isSymbolPointer()
        }
    },

    _getGraphList: function() {
        // order matters I think because we'll try to get data from the first graph in priority
        var graphs = [this.props.personPG];
        if ( this.props.jumpedPersonPG ) {
            graphs.unshift(this.props.jumpedPersonPG);
        }
        return graphs;
    },

    // TODO BAD: this should be handled in PersonContacts and filter the userlist
    // => Pg are not jumped yet in PersonContacts
    _displayUser: function(graphList) {
        var filterText = this.props.filterText;
        var userNameList = _.chain(graphList)
            .map(function(pg) {
                return pg.getLiteral(FOAF('name'));
            })
            .map(function(name) {
                return name.toString().toLowerCase();})
            .value();
        var firstUserName = userNameList[0];
        if (!filterText) return true;
        filterText = filterText.toString().toLowerCase();
        return (firstUserName.indexOf(filterText) != -1) && (firstUserName.indexOf(filterText) == 0);
    }

});

    return PersonContactOnProfile;

});