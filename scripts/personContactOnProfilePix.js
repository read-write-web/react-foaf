/** @jsx React.DOM */

var PersonContactOnProfilePix = React.createClass({
    render: function() {
        var imgUrl = this.props.getUserImg();
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    }
});

//<div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>