/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons',
        'jsx!PersonContactOnProfileJumpWrapper',
        'jsx!SearchBox',
        'PGReact'
     ], function (React, mixins, ReactWithAddons, PersonContactOnProfileJumpWrapper, SearchBox,PGReact) {

var PersonContacts = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
    componentName: "PersonContacts",

    getInitialState: function() {
        return {
            filterText:""
        }
    },

    handleUserInput: function(text) {
        this.replaceState({
            filterText: text
        });
    },

    render: function () {
        var self = this;

        var titleClass = ReactWithAddons.addons.classSet({
             'hide': this.props.toolsBarVisible
        });

        if (!this.props.personPG) return (
            <div id="contacts" className="clearfix">
                <div class={titleClass}>Contacts</div>
                <ul className="clearfix span3"></ul>
            </div>
            );

        var foafs = _.chain(this.props.personPG.rel(FOAF("knows")))
            // TODO this is not good because it doesn't jump: the local friend info may not even contain the name...
            .filter(function(contactPG) {
                var name = foafUtils.getName([contactPG]);
                if (!name || name.length == 0) return true;
                return name[0].toLowerCase().indexOf(self.state.filterText) !== -1
            })
            .map(function (contactPG) {
                var onContactClick = function() {
                    if ( contactPG.isSymbolPointer() ) {
                        self.props.onContactSelected( contactPG.getSymbolPointerUrl() )
                    } else {
                        // TODO maybe we can click on a bnode or literal???
                        alert("Can only click on a Symbol pointer, not Bnode/Literal")
                    }
                }
                return (<PersonContactOnProfileJumpWrapper
                            key={PGReact.getPointerKeyForReact(contactPG)}
                            onPersonContactClick={onContactClick}
                            onAddContactClick={self.props.onAddContactClick}
                            personPG={contactPG}
                            filterText={self.state.filterText}/>)
            }).value();

        return (
            <div id="contacts" className="clearfix">
                <div className={titleClass}>
                    <div className="title center-text title-case">{this._getUsername()}'s contacts</div>
                    <SearchBox onUserInput={this._inputInSearchBox}/>
                </div>
                <ul className="clearfix span3">{ foafs }</ul>
            </div>
            );
    },

    _getUsername: function() {
        var userName = foafUtils.getName([this.props.personPG]);
        var noValue = "...";
        var name = (userName && userName.length>0)? userName[0]:noValue;
        // Only take the first name.
        return name.split(" ")[0];
    },

    _inputInSearchBox: function(filterText) {
        this.setState({
            filterText:filterText
        })
    }
});

return PersonContacts;

});