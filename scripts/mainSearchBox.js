/** @jsx React.DOM */

var MainSearchBox = React.createClass({
    getInitialState: function() {
        return {text: this.props.filterText};
    },

    handleSubmit: function(e) {
        console.log("user submit !!!" + this.state.text);
        //this.props.onUserInput(this.state.text);
        return false; //don't send result to web server
    },

    onChange: function(e) {
        console.log("user input !!! : " + e.target.value);
        //this.props.onUserInput(e.target.value);
        this.setState({text: e.target.value});
    },

    render: function() {
        return (
            <form id="search" onSubmit={this.handleSubmit}>
                <input type="text"
                placeholder="Search your contacts"
                value={this.state.text}
                width="100"
                ref="url"
                onChange={this.onChange}
                />
                <button type="submit" class="fontawesome-ok"></button>
            </form>
            );
    }
});


//placeholder="Enter URL of foaf profile..." Search your contacts
//value={this.state.url}