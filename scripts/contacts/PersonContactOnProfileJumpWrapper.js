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
                    self.setState({
                        jumpedPersonPG: pg
                    });
                },
                function(err) {
                    self.error("Can't jump pg:",err);
                    self.setState({
                        jumpError: err
                    });
                }
            )
        }
        else {
            self.debug("Person PG has been jumped immediately successfully. Jumped pg:",jumpedPersonPG);
            self.setState({
                jumpedPersonPG: jumpedPersonPG
            });
        }
    },

    render: function() {
        return (
            <PersonContactOnProfile
            key={this.props.personPG.getPointerKeyForReact()}
            onPersonContactClick={this.props.onPersonContactClick}
            personPG={this.props.personPG}
            jumpedPersonPG={this.state.jumpedPersonPG}
            jumpError={this.state.jumpError}
            filterText={this.props.filterText}/>
            )
    }


});
