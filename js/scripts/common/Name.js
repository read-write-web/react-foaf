/** @jsx React.DOM */

define(['react', 'mixins'],
    function (React, mixins) {
        var Name = React.createClass({
            render: function () {
                // Render Html.
                return this.transferPropsTo(<div className="name title-case">{this.props.name}</div>)
            }
        });

        return Name;
});