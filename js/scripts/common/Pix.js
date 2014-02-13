/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

    var Pix = React.createClass({
        render: function () {
            // Render Html.
            return (
                <div className="picture">
                    {this.transferPropsTo(<img/>)}
                </div>
                );
        }
    });

    return Pix;
});