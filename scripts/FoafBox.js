/** @jsx React.DOM */

var FoafBx = React.createClass({

    getInitialState: function() {
       return {
            primaryTopicsPointedGraphs: [],
            filterText: ''
       };
    },

	 componentDidMount: function() {
		 this.fetchURL(this.props.url);
	 },

    fetchURL: function(url) {
        if (!url) return;
        var component = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var future = fetcher.fetch(url, window.location);
        future.then(
            function (pg) {
                var pt = pg.rel(FOAF("primaryTopic"));
                component.replaceState({
						 primaryTopicsPointedGraphs: pt
					 });
                //need loading function to display advances in download
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
            })

    },

    changeUser: function(pg){
        this.replaceState({
            primaryTopicsPointedGraphs:[pg]
        });
		  return false;
    },

    handleUserInputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    render: function () {
        return (
            <div className="PersonalProfileDocument">
                <MainSearchBox filterText={this.state.filterText} personPG={this.state.primaryTopicsPointedGraphs} onUserInput={this.handleUserInputInSearchBox}/>
                <div id="actionNeeded">Action needed</div>
                <Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>
            </div>
            );
    }

    // Executed immediately after render.
    //componentDidMount: function() {}
});

//<Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>