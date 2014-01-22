/** @jsx React.DOM */

var App = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "App",


    getInitialState: function() {
        var onlyHardcodedWindow = {
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
            return <Window windowType={window.windowType} windowProps={window.windowProps}/>;
        });
        return (
            <div className="app">
            {windows}
            </div>
            )
    }

});


