/** @jsx React.DOM */

var PersonContactOnProfileNotifications = React.createClass({
    getInitialState: function() {
        return {
            nbNewMessages:"0",
            nbRecentNotifications:"0",
            nbUpdates:"0"
        }
    },

    render: function() {
        return (
            <div className="notifications">
                <div className="newMessages float-left">{this.state.nbNewMessages}</div>
                <div className="recentInteractions float-left">{this.state.nbRecentNotifications}</div>
                <div className="updates float-left">{this.state.nbUpdates}</div>
            </div>
            );
    }
});