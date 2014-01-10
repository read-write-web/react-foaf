/** @jsx React.DOM */

var PersonContactOnProfilePix = React.createClass({
    render: function() {
        console.log("Render Person Pix");
        var imgUrl = this.props.getUserImg();
        console.log(imgUrl);
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    }
});

//<div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>