/** @jsx React.DOM */

define(['react', 'mixins'],
    function (React, mixins) {
        var Company = React.createClass({
            render: function () {
                // Render Html.
                return this.transferPropsTo(<div className="company">{this.props.company}</div>)
            }
        });

        return Company;
    });