/** @jsx React.DOM */

var PersonPix = React.createClass({
    render: function() {

        var imgUrl = this.props.getUserImg();
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    }
});