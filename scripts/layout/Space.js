/** @jsx React.DOM */

var Space = React.createClass({

    render:function(){
        var self = this;
        console.log('Render space')
        //console.log(this.props)

        // Set css display properties.
        var show = {display: (this.props.properties.isCurrentTab) ? 'block' : 'none'};
        var styleTools = this._setCssForToolBar(self.props.properties);

        // Set component classes.
        var clazz = "space center " + this.props.properties.className;

        // Define the Html.
        var spaceTree =
            <div className={clazz} style={show}>
                <div className="space-bar clearfix">
                    <div className="space-title float-left title-case">"Test Title"</div>
                    <ul className="space-tools float-right">
                        <li className="space-options" style={styleTools}>
                            <i class="fa fa-cog"></i>
                        </li>
                        <li className="space-maximize" style={styleTools}>
                            <i class="fa fa-plus-circle"></i>
                        </li>
                        <li className="space-minimize" style={styleTools} onClick={this._handleClickMinimize}>
                            <i class="fa fa-minus-circle"></i>
                        </li>
                        <li className="space-close" style={styleTools} onClick={this._handleClickClose}>
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

    // Handlers.
    _handleClickMaximize: function(e) {
        this.props.maximizeTab(this.props.properties);
    },
    _handleClickMinimize: function(e) {
        this.props.minimizeTab(this.props.properties);
    },
    _handleClickClose: function(e) {
        this.props.closeTab(this.props.properties);
    },

    _setCssForToolBar: function(properties) {
        return this._cssForToolBarMap[properties.type](properties);
    },

    _createSubComponent: function(properties) {
        return this._tabMap[properties.type](properties, this);
    },

    // Choose css style based on
    _cssForToolBarMap: {
        contacts: function(prop) {
            return {
                display: 'none'
            };
        },
        person: function(prop, ref) {
            return {
                display: 'inline-block'
            };
        }
    },

    // Choose html based on tab type.
    _tabMap: {
        contacts: function(prop, ref) {
            return <PersonContacts properties={prop} personPG={ref.props.personPG[0]} userName="Test" loadUserProfile={ref.props.loadUserProfile}/>
        },
        person: function(prop, ref) {
            return <Person
                properties={prop}
                personPG={ref.props.personPG}
                loadUserProfile={ref.props.loadUserProfile}
                submitEdition={ref.props.submitEdition}
            />
        }
    }
});

//<Person personPG={this.props.personPG} changeUser={this.props.changeUser}/>