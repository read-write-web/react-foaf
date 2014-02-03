/** @jsx React.DOM */

define(['react', 'mixins', 'jsx!FoafWindow'], function (React, mixins, FoafWindow) {

var Window = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "Window",

    propTypes: {
        windowType: React.PropTypes.oneOf(['foafWindow','otherWindowTypeExemple']).required,
        windowProps: React.PropTypes.object
    },

    render: function () {
        console.log('Render window')
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

return Window;
});