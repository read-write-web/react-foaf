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
        this.props.personPG.jumpAsync()
            .then(function(pg) {
                self.setState({
                    jumpedPersonPG: pg
                });
            })
            .fail(function(err) {
                self.warn("Can't jump pg:",err.message);
                self.setState({
                    jumpError: err
                });
            });
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
