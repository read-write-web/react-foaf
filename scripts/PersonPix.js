/** @jsx React.DOM */

var PersonPix = React.createClass({
    render: function() {
        // Get image from parent.
        var imgUrl = this.props.getUserImg();

        // Render Html.
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    }
});