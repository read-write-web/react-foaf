/** @jsx React.DOM */

var PersonNotifications = React.createClass({

    render: function() {

        var notifications = this._getNotifications();

        return (
            <div className="notifications">
                <div className="newMessages float-left">{notifications.nbNewMessages}</div>
                <div className="recentInteractions float-left">{notifications.nbRecentInteraction}</div>
                <div className="updates float-left">{notifications.nbUpdates}</div>
            </div>
            );
    },

    _getNotifications: function() {
        return {
            nbNewMessages:0,
            nbRecentInteraction:0,
            nbUpdates:0
        }
    },
});