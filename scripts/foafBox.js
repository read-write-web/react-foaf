/** @jsx React.DOM */

var FoafBx = React.createClass({

    getInitialState: function() {
        return {
            url : "http://bblfish.net/people/henry/card",
            //url : "https://my-profile.eu/people/tim/card",
            //url:"https://my-profile.eu/people/deiu/card",
            //url:"https://my-profile.eu/people/mtita/card",// Not working
            //url:"http://presbrey.mit.edu/foaf",
            primaryTopicsPointedGraphs: []
        };
    },

    // Executed immediately before render.
    componentWillMount: function() {
        console.log("in FoafBx.componentWillMount");
        url = this.state.url;
        console.log("this.props.url="+url);
        this.fetchURL(url);
    },

    fetchURL: function(url) {
        console.log("in FoafBx.fetchURL");
        console.log("FoafBx.handleUserIntput("+url+")");
        if (!url) return
        var component = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var future = fetcher.fetch(url, url);
        component.setState({url: url})
        future.then(
            function (pg) {
                console.log("received graph for url=" + url);
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
        this.replaceState({
            url:pg.pointer.value,
            primaryTopicsPointedGraphs:[pg]
        });
        //this.fetchURL(pg.pointer.value);
    },

    render: function () {
        console.log("rendering FoafBx with primarytopics");
        console.log(this.state.primaryTopicsPointedGraphs);

        return (
            <div className="PersonalProfileDocument">
                <SearchBox url={this.state.url} onUserInput={this.fetchURL}/>
                <div id="actionNeeded">Action needed</div>
                <Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>
            </div>
            );
    }

    // Executed immediately after render.
    //componentDidMount: function() {}
});