/** @jsx React.DOM */

define(['react', 'mixins'],
    function (React, mixins) {
        var Surname = React.createClass({
            render: function () {
                // Render Html.
                return this.transferPropsTo(<div className="surname title-case">{this.props.surname}</div>)
            }
        });

        return Surname;
    });