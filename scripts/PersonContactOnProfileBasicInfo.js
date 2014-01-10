/** @jsx React.DOM */

var PersonContactOnProfileBasicInfo = React.createClass({

    render: function() {
        console.log('Render Basic info !!!!!!!!!!!!!');

        // Get info.
        var names = this.props.getBasicInfo();

        return (
            <div className="basic">
                <div className="name title-case">{names.name}</div>
                <div className="surname title-case">{names.givenname}</div>
                <div className="company">{names.company}</div>
            </div>
            );

        /*
        return (
            <div className="basic">
                <div className="name title-case">{name}</div>
                <div className="surname title-case">{surname}</div>
                <div className="company">{company}</div>
            </div>

            );
            */
    }
});