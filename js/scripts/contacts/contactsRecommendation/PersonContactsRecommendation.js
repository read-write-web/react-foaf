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

            //this._printPotentialFriendNames(this.props.personPG);

            //if (!this.props.personPG)
                return (
                    <div id="contacts" className="clearfix">
                        <div class={titleClass}>Contacts</div>
                        <ul className="clearfix span3"></ul>
                    </div>
                );
            /*
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
                    </div>
                    <ul className="clearfix span3">{ foafs }</ul>
                </div>
                );
                */
        },

        _printPotentialFriendNames: function (personPg) {
            console.log("here")
            console.log(personPg)
            var personDoesntKnowHimFilter = function (himPg) {
                var personKnowHim = personPg.hasPointerTripleMatching(FOAF("knows"), himPg.pointer);
                return !personKnowHim;
            };
            console.log("here")
            var heKnowsPersonFilter = function (hePg) {
                return hePg.hasPointerTripleMatching(FOAF("knows"), personPg.pointer);
            };
            console.log("here")
            var potentialFriendStream = personPg.followPath([FOAF("knows"), FOAF("knows")])
                .filter($rdf.PG.Filters.isSymbolPointer)
                .distinct(function (pg) {
                    console.log("here")
                    console.log(pg)
                    return $rdf.PG.Transformers.symbolPointerToValue(pg);
                })
                .filter(personDoesntKnowHimFilter)
                .filter(heKnowsPersonFilter);
            console.log(potentialFriendStream)
            var potentialFriendNameStream = potentialFriendStream.flatMap(function (potentialFriendPg) {
                return potentialFriendPg.followPath([FOAF("name")]).take(1);
            });

            this._handleNameStream(potentialFriendNameStream);
        },

        _handleNameStream: function(nameStream) {
            nameStream.subscribe(
            function(namePg) {
                var friendFriendName = namePg.pointer.toString();
                $("#friendList").append("<li>"+friendFriendName+" ("+namePg.getCurrentDocumentUrl()+")</li>")
            },
            function(error) {
                console.error("Unexpected end of stream",error, error.stack);
            },
            function() {
                $("#end").html(" -> End");
            }
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