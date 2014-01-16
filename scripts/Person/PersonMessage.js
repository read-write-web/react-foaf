/** @jsx React.DOM */

var PersonMessage = React.createClass({
    render: function() {

        var message = this.props.getMessage();

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {this.props.userName}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
            );
    }
});