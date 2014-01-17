/** @jsx React.DOM */

var PersonNotifications = React.createClass({

    render: function() {

        var notifications = this.props.notifications();

        return (
            <div className="notifications">
                <div className="newMessages float-left">{notifications.nbNewMessages}</div>
                <div className="recentInteractions float-left">{notifications.nbRecentInteraction}</div>
                <div className="updates float-left">{notifications.nbUpdates}</div>
            </div>
            );
    }
});