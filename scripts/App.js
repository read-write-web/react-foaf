/** @jsx React.DOM */

var App = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "App",


    getInitialState: function() {
        // the id is required because we must assign an unique react key to each window
        // TODO this needs to be generated when there will be multiple windows
        var onlyHardcodedWindow = {
            windowId : "onlyHardcodedWindow",
            windowType : "foafWindow",
            windowProps : {
                url: foafDocURL
            }
        }
        return {
            windows: [onlyHardcodedWindow]
        }
    },

    render: function () {
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


