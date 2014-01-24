/** @jsx React.DOM */

var PersonContactOnProfileJumpWrapper = React.createClass({
    mixins: [WithLogger,WithLifecycleLoggingLite,WithEmptyInitialState],
    componentName: "PersonContactOnProfileJumpWrapper",

    propTypes: {
        onPersonContactClick: React.PropTypes.func.isRequired,
        personPG: React.PropTypes.instanceOf($rdf.PointedGraph).isRequired,
        filterText: React.PropTypes.string.isRequired
    },


    componentDidMount: function() {
        var self = this;
        // TODO maybe in this case jumpAsync would work better?
        var jumpedPersonPG = this.props.personPG.jumpNowOrLater();
        if ( Q.isPromise(jumpedPersonPG) ) {
            jumpedPersonPG.then(
                function(pg) {
                    self.debug("Person PG has been jumped later successfully. Jumped pg:",pg);
                    self.replaceState({
                        jumpedPersonPG: pg
                    });
                },
                function(err) {
                    self.error("Can't jump pg:",err);
                    self.replaceState({
                        jumpFailure: true
                    });
                }
            )
        }
        else {
            self.debug("Person PG has been jumped immediately successfully. Jumped pg:",jumpedPersonPG);
            self.replaceState({
                jumpedPersonPG: jumpedPersonPG
            });
        }
    },

    render: function() {
        return (
            <PersonContactOnProfile
            onPersonContactClick={this.props.onPersonContactClick}
            personPG={this.props.personPG}
            jumpedPersonPG={this.state.jumpedPersonPG}
            jumpFailure={this.state.jumpFailure}
            filterText={this.props.filterText}/>
            )
    }


});
