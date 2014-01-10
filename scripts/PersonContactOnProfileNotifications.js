/** @jsx React.DOM */

var PersonContactOnProfileNotifications = React.createClass({

    render: function() {
        var notifications = this.props.getNotifications();
        return (
        <div className="notifications">
            <div className="newMessages float-left">{notifications.nbNewMessages}</div>
            <div className="recentInteractions float-left">{notifications.nbRecentInteraction}</div>
            <div className="updates float-left">{notifications.nbUpdates}</div>
        </div>
        );
    }
});