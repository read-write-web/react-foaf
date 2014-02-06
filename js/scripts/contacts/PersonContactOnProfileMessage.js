/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var PersonContactOnProfileMessage = React.createClass({
    render: function() {
        var message = this.getMessage();

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {name}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="addAsFriend" onClick={this._handleClick}><a href="#">Add as contact</a></div>
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
        console.log(this.props.personPG);
        this.props.onAddContactClick(this.props.personPG);
    }
});

    return PersonContactOnProfileMessage;
});