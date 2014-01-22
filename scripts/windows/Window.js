/** @jsx React.DOM */

var Window = React.createClass({
    mixins: [LoggingMixin],
    componentName: "Window",

    propTypes: {
        windowType: React.PropTypes.oneOf(['foafWindow','otherWindowTypeExemple']).required,
        windowProps: React.PropTypes.object
    },

    render: function () {

        var window;
        if ( this.props.windowType == "foafWindow") {
            // <FoafWindow props={this.props.windowProps}/> is not yet possible but was asked
            window = FoafWindow(this.props.windowProps);
        } else {
            throw "Unhandled (yet) window type: " + this.props.windowType;
        }

        return (
            <div className="window">{window}</div>
            );
    }

});

