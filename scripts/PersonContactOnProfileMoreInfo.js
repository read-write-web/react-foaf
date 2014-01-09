/** @jsx React.DOM */

var PersonContactOnProfileMoreInfo = React.createClass({
    getInitialState: function() {
        return {
            lastMessage:"..."
        }
    },

    render: function() {
        return (
            <div className="moreInfo">
                <div className="lastInteraction"><span>{this.state.lastMessage}</span></div>
                <div className="nextStep"><a href="#">Start the conversation</a></div>
            </div>
            );
    }
});