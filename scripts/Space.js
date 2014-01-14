/** @jsx React.DOM */

var Space = React.createClass({
    getInitialState: function(){

    },
    handleClickMaximize: function(e) {
        console.log('Click to Maximized ' + e);
        this.props.maximizeTab(this.props.properties);
    },
    handleClickMinimize: function(e) {
        console.log('Click to Minimized ' + e);
        this.props.minimizeTab(this.props.properties);
    },
    handleClickClose: function(e) {
        console.log('Click to close ' + e);
        this.props.closeTab(this.props.properties);
    },

    render:function(){
        console.log('Render space')
        console.log(this.props.properties)
        // Check user and filter.
        var show = {
            display: (this.props.properties.isCurrentTab) ? 'block' : 'none'
        };

        // Check user and filter.
        var clazz = "space center " + this.props.properties.className;

        return (
            <div className={clazz} style={show}>
                <div className="space-bar clearfix">
                    <div className="space-title float-left title-case">"Test Title"</div>
                    <ul className="space-tools float-right">
                        <li className="space-options">
                            <i class="fa fa-cog"></i>
                        </li>
                        <li className="space-maximize" onClick={this.handleClickMaximize}>
                            <i class="fa fa-plus-circle"></i>
                        </li>
                        <li className="space-minimize" onClick={this.handleClickMinimize}>
                            <i class="fa fa-minus-circle"></i>
                        </li>
                        <li className="space-close" onClick={this.handleClickClose}>
                            <i className="fa fa-times-circle"></i>
                        </li>
                    </ul>
                </div>
                <div className="space-content clearfix"></div>
                <Person personPG={this.props.personPG} changeUser={this.props.changeUser}/>
            </div>
            );
    }
});