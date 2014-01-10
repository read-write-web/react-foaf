/** @jsx React.DOM */

var FoafBxV2 = React.createClass({

    getInitialState: function() {
        return {
            //url : "http://bblfish.net/people/henry/card",
            //url : "https://my-profile.eu/people/tim/card",
            url:"https://my-profile.eu/people/deiu/card",
            //url:"https://my-profile.eu/people/mtita/card",// Not working
            //url:"http://presbrey.mit.edu/foaf",
            primaryTopicsPointedGraphs: [],
            filterText: ''
        };
    },

    // Executed immediately before render.
    componentWillMount: function() {
        url = this.state.url;
        this.fetchURL(url);
    },

    handleUserInput: function(filterText) {
        console.log("handle user input !!!")
        /*
         this.setState({
         filterText: filterText
         });
         */
    },

    fetchURL: function(url) {
        if (!url) return
        var component = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var future = fetcher.fetch(url, url);
        component.setState({url: url})
        future.then(
            function (pg) {
                var pt = pg.rel(FOAF("primaryTopic"))
                component.replaceState({
                    primaryTopicsPointedGraphs: pt,
                    url: url
                })
                //need loading function to display advances in download
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
                console.log(err)  //need error handling
            })

    },

    changeUser: function(pg){
        var firstCurrentPg = this.state.primaryTopicsPointedGraphs[0];
        this.replaceState({
            url:firstCurrentPg.pointer.value,
            primaryTopicsPointedGraphs:[firstCurrentPg]
        });
        //this.fetchURL(pg.pointer.value);
    },

    render: function () {
        var firstCurrentPg = this.state.primaryTopicsPointedGraphs[0];
        var UserName = foafUtils.getName(this.props.personPG);
        return (
            <div className="PersonalProfileDocument">
                <SearchBox filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                <div id="actionNeeded">Action needed</div>
                <PersonContacts personPG={firstCurrentPg} userName={UserName} changeUser={this.changeUser}/>
            </div>
            );
    }

    // Executed immediately after render.
    //componentDidMount: function() {}
});

//<Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>