/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var SearchBox = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "SearchBox",

    getInitialState: function() {
        return {filterText: this.props.filterText};
    },

    render: function() {
        return (
            <form class="filterContacts" onSubmit={this._handleSubmit}>
            <input type="text"
                placeholder="Filter your contacts"
                value={this.state.text}
                width="100"
                ref="url"
                onChange={this._onChange}
            />
            <button type="submit" class="fontawesome-ok" onClick={this._handleSubmit}></button>
            </form>
        );
    },

    _handleSubmit: function(e) {
        e.preventDefault();
    },

    _onChange: function(e) {
        e.preventDefault();
        this.log("user input: ",e);
        this.setState({text: e.target.value});
        this.props.onUserInput(e.target.value);
    },
});

    return SearchBox;
});