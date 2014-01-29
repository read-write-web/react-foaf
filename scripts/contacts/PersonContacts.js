/** @jsx React.DOM */

var PersonContacts = React.createClass({
    mixins: [WithLogger,WithLifecycleLoggingLite],
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

        var titleClass = React.addons.classSet({
             'hide': this.props.toolsBarVisible
        });

        if (!this.props.personPG) return (
            <div id="contacts" className="clearfix">
                <div class={titleClass}>Contacts</div>
                <ul className="clearfix span3"></ul>
            </div>
            );

        var foafs = _.chain(this.props.personPG.rel(FOAF("knows")))
            .filter(function(contactPG) {
                var name = foafUtils.getName([contactPG]);
                if (!name || name.length == 0) return true;
                return name[0].toLowerCase().indexOf(self.state.filterText) !== -1
            })
            .map(function (contactPG) {
                var onContactClick = function() {
                    var contactURL = contactPG.getPointerUrl();
                    if ( contactURL ) {
                        self.props.onContactSelected(contactURL)
                    } else {
                        // TODO maybe we can click on a bnode???
                        alert("Can only click on a Symbol pointer, not Bnode/Literal")
                    }
                }
                return (<PersonContactOnProfileJumpWrapper
                            key={contactPG.getPointerKeyForReact()}
                            onPersonContactClick={onContactClick}
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

