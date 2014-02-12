/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'notify',
    'jsx!PersonContactOnProfileJumpWrapper',
    'jsx!SearchBox',
    'PGReact'
], function (React, mixins, ReactWithAddons, notify, PersonContactOnProfileJumpWrapper, SearchBox,PGReact) {

    var PersonContactsRecommendation = React.createClass({
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

            var foafs =
                _.chain(this.props.personPG.rel(FOAF("knows")))
                    .map(function (contactPG) {
                        var onContactClick = function () {
                            if (contactPG.isSymbolPointer()) {
                                self.props.onContactSelected(contactPG.getSymbolPointerUrl())
                            } else {
                                // TODO maybe we can click on a bnode or literal???
                                notify("error", "Can only click on a Symbol pointer, not Bnode/Literal.");
                                //alert("Can only click on a Symbol pointer, not Bnode/Literal")
                            }
                        }

                        return (<PersonContactOnProfileJumpWrapper
                        key={PGReact.getPointerKeyForReact(contactPG)}
                        onPersonContactClick={onContactClick}
                        onAddContact={self.props.onAddContact}
                        onRemoveContact={self.props.onRemoveContact}
                        personPG={contactPG}
                        currentUserPG={self.props.currentUserPG}
                        filterText={self.state.filterText}/>)
                    }).value();

            return (
                <div id="contactsRecommendation" className="clearfix">
                    <div class="title center-text title-case">People you may know</div>
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

    return PersonContactsRecommendation;

});