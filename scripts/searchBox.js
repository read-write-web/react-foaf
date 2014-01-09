/** @jsx React.DOM */

var SearchBox = React.createClass({
    getInitialState: function() {
        return {text: this.props.url};
    },

    handleSubmit: function(e) {
        this.props.onUserInput(
            this.state.text //this.refs.url.getDOMNode().value
        );
        return false; //don't send result to web server
    },

    onChange: function(e) {
        this.setState({text: e.target.value});
    },

    render: function() {
        return (
            <form id="search" onSubmit={this.handleSubmit}>
            <input type="text"
                placeholder="Enter URL of foaf profile..."
                value={this.state.url}
                width="100"
                ref="url"
                onChange={this.onChange}
            />
            <button type="submit" class="fontawesome-ok"></button>
            </form>
        );
    }
});