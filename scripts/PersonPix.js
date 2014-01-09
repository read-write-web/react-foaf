/** @jsx React.DOM */

var PersonPix = React.createClass({
    render: function() {
        console.log("Render Person Pix");
        var imgUrl = this.props.getUserImg();
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    }
});