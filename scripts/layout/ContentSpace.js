/** @jsx React.DOM */

var ContentSpace = React.createClass({

    render:function(){

        var spaceTree =
            <div className="space center">
                <div className="space-bar clearfix">
                    <div className="space-title float-left title-case">"Test Title"</div>
                    <ul className="space-tools float-right">
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
            </div>

        return spaceTree;
    }


});
