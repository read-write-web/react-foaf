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
        var contactUri = this.props.personPG[0].pointer.value;
        (!this._isContactWithCurrentUser())? this.props.onAddContact(contactUri):this.props.onRemoveContact(contactUri);
    },

    // Set appropriate text to display contact.
    _getAddAsContactText: function() {
        return (this._isContactWithCurrentUser())? "Remove Contact":"Add as contact";
    },

    // Check if the current contact is already contact of the current user.
    _isContactWithCurrentUser: function() {
        var currentUserPG = this.props.currentUserPG;
        var contactUri = this.props.personPG[0].pointer.value;
        var contactPointer = this.props.personPG[0].pointer;
        
        // If contactUri is already in the current user contact lists, return true.
        return currentUserPG.isStatementExist(currentUserPG.pointer, FOAF('knows'), contactPointer, currentUserPG.namedGraphFetchUrl);
    }
});

    return PersonContactOnProfileMessage;
});