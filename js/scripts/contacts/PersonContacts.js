/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'notify',
    'jsx!PersonContactOnProfileJumpWrapper',
    'jsx!SearchBox',
    'PGReact'
], function (React, mixins, ReactWithAddons, notify, PersonContactOnProfileJumpWrapper, SearchBox,PGReact) {

    var PersonContacts = React.createClass({
        mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
        componentName: "PersonContacts",

        getInitialState: function() {
            return {
                filterText:"",
                seeAlsoPersonPGList: []
            }
        },

        handleUserInput: function(text) {
            this.replaceState({
                filterText: text
            });
        },

        componentDidMount: function() {
            this.loadSeeAlso(this.props.personPG);
        },
        componentWillReceiveProps: function(nextProps) {
            this.loadSeeAlso(nextProps.personPG);
        },


        loadSeeAlso: function(personPG) {
            var self = this;
            self.setState({
                seeAlsoPersonPGList: [] // reinit the list
            });
            personPG.jumpRelObservable(RDFS("seeAlso")).subscribe(
                function(seeAlsoPg) {
                    self.error("Found seeAlso!!!");
                    var seeAlsoPersonPG = seeAlsoPg.withPointer(personPG.pointer);
                    self.debug("rdfs:seeAlso found -> ",seeAlsoPg.printSummary());
                    var seeAlsoPersonPGList = self.state.seeAlsoPersonPGList;
                    seeAlsoPersonPGList.push(seeAlsoPersonPG);
                    self.setState({
                        seeAlsoPersonPGList: seeAlsoPersonPGList
                    });
                },
                function(seeAlsoError) {
                    self.error("rdfs:seeAlso fetch error:",seeAlsoError);
                },
                function() {
                    self.debug("No more seeAlso!");
                    if (  self.state.seeAlsoPersonPGList.length > 0 ) {
                        self.debug("No more rdfs:seeAlso. Total seeAlso fetched successfully = "+self.state.seeAlsoPersonPGList.length);
                    } else {
                        self.debug("No rdfs:seeAlso");
                    }
                }
            );
        },


        getPersonContactPGList: function() {
            // We look for friends in the original PG
            var pgArray = this.props.personPG.rel(FOAF("knows"));
            // ... but also in the seeAlso documents!
            _.each(this.state.seeAlsoPersonPGList,function(seeAlsoPersonPG) {
                var pgArrayInSeeAlso = seeAlsoPersonPG.rel(FOAF("knows"));
                pgArray.push.apply(pgArray,pgArrayInSeeAlso);
            });
            return pgArray;
        },

        render: function () {
            var self = this;
            var titleClass = ReactWithAddons.addons.classSet({
                'hide': this.props.toolsBarVisible
            });

            if ( !this.props.personPG ) {
                return (
                    <div id="contacts" className="clearfix">
                        <div class={titleClass}>Contacts</div>
                        <ul className="clearfix span3"></ul>
                    </div>
                    );
            }

            var foafs =
                _.chain( this.getPersonContactPGList() )
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