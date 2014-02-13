/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'notify',
    'jsx!PersonContactOnRecommendation',
    'jsx!SearchBox',
    'PGReact'
], function (React, mixins, ReactWithAddons, notify, PersonContactOnRecommendation, SearchBox,PGReact) {

    var PersonContactsRecommendation = React.createClass({
        mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
        componentName: "PersonContactsRecommendation",

        getInitialState: function() {
            return {
                pgList: []
            }
        },

        componentDidMount: function() {
            var self = this;
            this._printPotentialFriendNames(this.props.currentUserPG, function(pg) {
                self.setState({
                    pgList: _.union(pg, self.state.pgList)
                });
            });
        },

        componentWillReceiveProps: function(nextProps) {
            var self = this;
            this.state.pgList = [];
            this._printPotentialFriendNames(nextProps.currentUserPG, function(pg) {
                self.setState({
                    pgList: _.union(pg, self.state.pgList)
                });
            });
        },

        render: function () {
            var self = this;

            if (this.state.pgList.length == 0) {
                return (
                    <div id="contactsRecommendation" className="clearfix">
                        <div class="title center-text title-case">People you may know</div>
                    </div>
                    );
            }

            var foafRecommendation = _.chain(this.state.pgList)
                .map(function(pg) {
                    var onContactClick = function () {
                        if (pg.isSymbolPointer()) {
                            self.props.onContactSelected(pg.getSymbolPointerUrl())
                        } else {
                            notify("error", "Can only click on a Symbol pointer, not Bnode/Literal.");
                        }
                    }

                    return <PersonContactOnRecommendation
                        key={PGReact.getPointerKeyForReact(pg)}
                        currentUserPG={self.props.currentUserPG}
                        personPG={pg}
                        filterText={self.props.filterText}
                        onPersonContactClick={onContactClick}
                        onAddContact={self.props.onAddContact}
                    />
                }).value()

            return (
                <div id="contactsRecommendation" className="clearfix">
                    <div class="title center-text title-case">People you may know</div>
                    <ul className="clearfix span3">{ foafRecommendation }</ul>
                </div>
                );
        },

        _printPotentialFriendNames: function (personPg, callback) {
            var personDoesntKnowHimFilter = function (himPg) {
                var personKnowHim = personPg.hasPointerTripleMatching(FOAF("knows"), himPg.pointer);
                return !personKnowHim;
            };

            var personIsMeFilter = function (himPg) {
                return !(himPg.pointer.uri == personPg.pointer.uri);
            };

            var potentialFriendStream = personPg.followPath([FOAF("knows"), FOAF("knows")])
                .filter($rdf.PG.Filters.isSymbolPointer)
                .distinct(function (pg) {
                    return $rdf.PG.Transformers.symbolPointerToValue(pg);
                })
                .filter(personDoesntKnowHimFilter)
                .filter(personIsMeFilter)

            this._handleStream(potentialFriendStream, callback);
        },

        _handleStream: function(stream, callback) {
            var self = this;
            stream.subscribe(
                function(pg) {
                    self.log('success');
                    self.log(pg);
                    callback(pg);
                },
                function(error) {
                    self.log('error')
                    self.log(error)
                    console.error("Unexpected end of stream", error, error.stack);
                },
                function(r) {
                    self.log('end')
                    self.log(r)
                }
            );
        }
    });

    return PersonContactsRecommendation;

});