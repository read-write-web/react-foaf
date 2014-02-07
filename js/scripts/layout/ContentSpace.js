/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons'], function (React, mixins, ReactWithAddons) {

    var ContentSpace = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
    componentName: "ContentSpace",

    getInitialState: function () {
        return {
            showOverlay: false
        };
    },

    render:function(){
        var ulClasses = ReactWithAddons.addons.classSet({
            'hide': this.props.isDefaultTab(), // Hide space tools if default tab.
            'space-tools': true,
            'float-right': true
        });

        var layerClass = ReactWithAddons.addons.classSet({
            'dropOverlay': true,
            'hideVisibility': (this.state.showOverlay)?false:true
        });

        var spaceTree =
            <div className="space center" onDragEnter={this._handleDragEnter}>
                <div className="space-bar clearfix">
                    <div className="space-title float-left title-case">"Test Title"</div>
                    <ul className={ulClasses}>
                        <li className="space-options" style={{display: "inline-block"}}>
                            <i class="fa fa-cog"></i>
                        </li>
                        <li className="space-maximize" style={{display: "inline-block"}}>
                            <i class="fa fa-plus-circle"></i>
                        </li>
                        <li className="space-minimize" style={{display: "inline-block"}} onClick={this.props.onMinimize}>
                            <i class="fa fa-minus-circle"></i>
                        </li>
                        <li className="space-close" style={{display: "inline-block"}} onClick={this.props.onClose}>
                            <i className="fa fa-times-circle"></i>
                        </li>
                    </ul>
                </div>
                <div className="space-content clearfix">{this.props.children}</div>
                <div className={layerClass} onDrop={this._handleDrop} onDragLeave={this._handleDragLeave} onDragExit={this._handleDragLeave}>
                    <div className="dropOverlayInner"></div>
                    <div className="dropText">Drop Uri to add contact</div>
                </div>
            </div>

        return spaceTree;
    },

    _handleDragEnter: function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.showOverlay) {
            this.setState({showOverlay:true});
        }
    },

    _handleDragLeave: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({showOverlay:false});
    },

    _handleDrop: function(e) {
        e.preventDefault();
        var dataTransfer = e.nativeEvent.dataTransfer;

        // Upload the dropped item.
        if (dataTransfer && dataTransfer.types.length) {
            this.props.uploadDroppedItems(dataTransfer);
        }

        // Change state to hide overlay.
        this.setState({showOverlay:false});
        //this.props.removeOverlay();
    }
});

    return ContentSpace;
});