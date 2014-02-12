/** @jsx React.DOM */

define(['react', 'mixins',
    'jsx!PersonContactOnProfile','PGReact'], function (React, mixins, PersonContactOnProfile,PGReact) {

var PersonContactOnProfileJumpWrapper = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
    componentName: "PersonContactOnProfileJumpWrapper",

    propTypes: {
        onPersonContactClick: React.PropTypes.func.isRequired,
        personPG: React.PropTypes.instanceOf($rdf.PointedGraph).isRequired,
        filterText: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            jumpedPersonPG: undefined,
            seeAlsoPersonPGList: []
        }
    },

    componentDidMount: function() {
        var self = this;
        this.props.personPG.jumpAsync()
            .then(function(pg) {
                self.setState({
                    jumpedPersonPG: pg
                });
                self.loadSeeAlso(pg);
            })
            .fail(function(err) {
                self.warn("Can't jump pg prout:",err.message);
                self.setState({
                    jumpError: err
                });
            });
    },

    loadSeeAlso: function(jumpedPersonPG) {
        var self = this;
        jumpedPersonPG.jumpRelObservable(RDFS("seeAlso")).subscribe(
        function(seeAlsoPg) {
            var seeAlsoPersonPG = seeAlsoPg.withPointer(jumpedPersonPG.pointer);
            self.debug("rdfs:seeAlso found -> ",seeAlsoPersonPG.printSummary());
            var seeAlsoPersonPGList = self.state.seeAlsoPersonPGList || []
            seeAlsoPersonPGList.push(seeAlsoPersonPG);
            self.setState({
                seeAlsoPersonPGList: seeAlsoPersonPGList
            });
        },
        function(seeAlsoError) {
            self.error("rdfs:seeAlso fetch error:",seeAlsoError);
        },
        function() {
            if (  self.state.seeAlsoPersonPGList.length > 0 ) {
                self.debug("No more rdfs:seeAlso. Total seeAlso fetched successfully = "+self.state.seeAlsoPersonPGList.length);
            } else {
                self.debug("No rdfs:seeAlso");
            }
        }
      );
    },

    render: function() {
        return (
            <PersonContactOnProfile
                key={PGReact.getPointerKeyForReact(this.props.personPG)}
                onPersonContactClick={this.props.onPersonContactClick}
                onAddContact={this.props.onAddContact}
                onRemoveContact={this.props.onRemoveContact}
                personPG={this.props.personPG}
                currentUserPG={this.props.currentUserPG}
                jumpedPersonPG={this.state.jumpedPersonPG}
                jumpError={this.state.jumpError}
                seeAlsoPersonPGList={this.state.seeAlsoPersonPGList}
                filterText={this.props.filterText}/>
            )
    }


});

    return PersonContactOnProfileJumpWrapper;

});