/** @jsx React.DOM */

var PersonBasicInfo = React.createClass({

    // Render.
    render: function() {


        // Get info.
        var names = this.props.getBasicInfo();

        return (
            <div className="basic">
                <div className="name title-case">{names.name}</div>
                <div className="surname title-case">{names.givenname}</div>
                <div className="company">{names.company}</div>
            </div>
            );
    }
});