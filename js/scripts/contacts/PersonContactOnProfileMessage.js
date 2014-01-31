/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var PersonContactOnProfileMessage = React.createClass({
    render: function() {
        var message = this.getMessage();
/*        var message = this.props.lastMessage;
        var propName = this.props.userName;
        var noValue = "...";
        var name = (propName.name["1"] && propName.name["1"].length>0)? propName.name["1"][0]:noValue;
*/
        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {name}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
            );
    },

	getMessage: function() {
		return message = {
			lastMessageDate:"",
			lastMessage:"No message"
		}
	}
});

    return PersonContactOnProfileMessage;
});