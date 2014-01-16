/** @jsx React.DOM */

var Pix = React.createClass({
    render: function() {
        // Render Html.
        return (
            <div className="picture">
             {this.transferPropsTo(<img/>)}
            </div>
            );
    }
});