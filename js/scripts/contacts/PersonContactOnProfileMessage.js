/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var PersonContactOnProfileMessage = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
    componentName: "PersonContactOnProfileMessage",

    render: function() {
        var message = this.getMessage();
        this.log(this.props.personPG)
        this.log(this.props.currentUserPG)

        // Get appropriate text fo html divs.
        var addAsContactText = this._getAddAsContactText();

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {name}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="addAsContact" onClick={this._handleClick}><a href="#">{addAsContactText}</a></div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
            );
    },

	getMessage: function() {
		return message = {
			lastMessageDate:"",
			lastMessage:"No message"
		}
	},

    _handleClick: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var contactPointer = this.props.personPG[0].pointer;
        if (!this._isContactWithCurrentUser())
            this.props.onAddContact(contactPointer)
        else this.props.onRemoveContact(contactPointer);
    },

    // Set appropriate text to display contact.
    _getAddAsContactText: function() {
        return (this._isContactWithCurrentUser())? "Remove Contact":"Add as contact";
    },

    // Check if the current contact is already contact of the current user.
    _isContactWithCurrentUser: function() {
        var currentUserPG = this.props.currentUserPG;
        var res = _.chain(this.props.personPG)// TODO: why is it a list of PGs.
            .map(function(contactPG) {return contactPG.pointer;})
            .map(function (contactPGPointer) {
                return currentUserPG.hasPointerTripleMatching( FOAF('knows'), contactPGPointer);
            })
            .reduce(function(base, bool) { return base || bool}, false)
            .value()
        return res;
    }
});

    return PersonContactOnProfileMessage;
});