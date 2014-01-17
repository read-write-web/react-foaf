/** @jsx React.DOM */

var PersonMessage = React.createClass({
    render: function() {
        // Get props.
        var message = this.props.lastMessage;
        var propName = this.props.userName;

        // Format the name.
        var noValue = "...";
        var name = (propName["1"] && propName["1"].length>0)? propName["1"][0]:noValue;
        var nameTrunc = name.split(" ");

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {nameTrunc[0]}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
            );
    }
});