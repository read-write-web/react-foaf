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
        var self = this;
        console.log('Render space')
        console.log(this.props.properties)
        console.log(this.props.personPG)

        // Check user and filter.
        var show = {
            display: (this.props.properties.isCurrentTab) ? 'block' : 'none'
        };

        // Check user and filter.
        var clazz = "space center " + this.props.properties.className;

        console.log(self._tabMap[this.props.properties.type])

        // Define the Html.
        var spaceTree =
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
                {
                    self._createSubComponent(self.props.properties)
                }
            </div>

        return spaceTree;
    },

    _createSubComponent: function(properties) {
        return this._tabMap[properties.type](properties, this);
    },

    // Choose html based on tab type.
    _tabMap: {
        contacts: function(prop, ref) {
            return <PersonContacts properties={prop} personPG={ref.props.personPG[0]} userName="Test" loadUserProfile={ref.props.loadUserProfile}/>
        },
        person: function(prop, ref) {
            return <Person properties={prop} personPG={ref.props.personPG} loadUserProfile={ref.props.loadUserProfile}/>
        }
    }
});

//<Person personPG={this.props.personPG} changeUser={this.props.changeUser}/>