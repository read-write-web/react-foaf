/** @jsx React.DOM */

var PersonContactOnProfileNotifications = React.createClass({

    render: function() {
        var notifications = this.getNotifications();
        return (
        <div className="notifications">
            <div className="newMessages float-left">{notifications.nbNewMessages}</div>
            <div className="recentInteractions float-left">{notifications.nbRecentInteraction}</div>
            <div className="updates float-left">{notifications.nbUpdates}</div>
        </div>
        );
    },

	getNotifications: function() {
		return notifications = {
			nbNewMessages:0,
			nbRecentInteraction:0,
			nbUpdates:0
		}
	}


});