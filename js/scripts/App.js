/** @jsx React.DOM */

define(['react', 'mixins', 'jsx!Window'], function (React, mixins, Window) {

var App = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "App",

    propTypes: {
        profileURL: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        console.log('getInitialState App')
        // the id is required because we must assign an unique react key to each window
        // TODO this needs to be generated when there will be multiple windows
        var onlyHardcodedWindow = {
            windowId : "onlyHardcodedWindow",
            windowType : "foafWindow",
            windowProps : {
                url: this.props.profileURL
            }
        }
        return {
            windows: [onlyHardcodedWindow]
        }
    },

    render: function () {
        console.log('Render App')
        var windows = _.map(this.state.windows,function (window) {
            return <Window key={window.windowId} windowType={window.windowType} windowProps={window.windowProps}/>;
        });
        return (
            <div className="app">
            {windows}
            </div>
            )
    }

});

return App;
});
