/** @jsx React.DOM */

var PersonContactOnProfileMessage = React.createClass({
    render: function() {
        var message = this.getMessage();
        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {this.props.userName}: <span>{message.lastMessageDate}</span></div>
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