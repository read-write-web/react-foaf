/** @jsx React.DOM */

var PersonMessage = React.createClass({
    render: function() {
        // Get props.
        var message = this._getMessage();
        var propName = this.props.userName;

        // Format the name.
        var noValue = "...";
        var name = (propName && propName.length>0)? propName[0]:noValue;
        var nameTrunc = name.split(" ");

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {nameTrunc[0]}: <span>{message.lastMessageDate}</span></div>
                <div className="message">{message.lastMessage}</div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
            );
    },

    _getMessage: function() {
        var noValue = "";
        return {
            lastMessageDate:noValue,
            lastMessage:"No message"
        }
    },

});