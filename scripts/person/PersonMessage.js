/** @jsx React.DOM */

var PersonMessage = React.createClass({
    render: function() {
        // Get props.
        var message = this._getMessage();

        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from {this._getUsername()}: <span>{message.lastMessageDate}</span></div>
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

    _getUsername: function() {
        var userName = foafUtils.getName([this.props.personPG]);
        var noValue = "...";
        var name = (userName && userName.length>0)? userName[0]:noValue;
        // Only take the first name.
        return name.split(" ")[0];
    }
});