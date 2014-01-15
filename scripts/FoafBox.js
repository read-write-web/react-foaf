/** @jsx React.DOM */

var FoafBx = React.createClass({

    getInitialState: function() {
        var initialTab = {
            pointedGraphs:[],
            type:"contacts",
            className:"0",
            isCurrentTab:true
        };

       return {
            primaryTopicsPointedGraphs: [],
            filterText: '',
            tabsList: {0:initialTab}
       };
    },

	 componentDidMount: function() {
		 this.fetchURL(this.props.url);
	 },

    fetchURL: function(url) {
        if (!url) return;
        var self = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var future = fetcher.fetch(url, window.location);
        future.then(
            function (pg) {
                var pt = pg.rel(FOAF("primaryTopic"));
                // Update the list of tabs.
                self.state.tabsList[0].pointedGraphs = pt;
                self.setState({
				    primaryTopicsPointedGraphs: pt,
                    tabsList:self.state.tabsList
			    });
                //need loading function to display advances in download
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
            })

    },

    loadUserProfile: function(pg){
        console.log("In foaf box ------->>>>> Change User")
        console.log(pg)

        // Initialize all tabs.
        _.map(this.state.tabsList, function(tab) {
            tab.isCurrentTab = false
        });

        // Select max index.
        var maxKey = _.chain(this.state.tabsList)
            .keys()
            .map(function(k) {return parseInt(k)})
            .max()
            .value()

        // Create a new tab.
        var newTab = {
            pointedGraphs:[pg],
            type:"person",
            className:(maxKey+1).toString(),
            isCurrentTab:true
        };

        // Update the list of tabs.
        this.state.tabsList[maxKey+1] = newTab;

        // Set state to render.
        this.setState({
            tabsList: this.state.tabsList,
            primaryTopicsPointedGraphs:[pg]
        });

		return false;
    },

    handleUserInputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    closeTab: function(tabProperties) {
        // Update its properties.
        delete this.state.tabsList[tabProperties.className]

        // Change state to render.
        this.setState({tabsList: this.state.tabsList});
    },

    minimizeTab: function(tabProperties) {
        console.log('minimize');
        console.log(tabProperties);

        // Tab is not current the tab anymore.
        tabProperties.isCurrentTab = false;

        // Update its properties.
        this.state.tabsList[tabProperties.className] = tabProperties;

        // Change state to render.
        this.setState({tabsList: this.state.tabsList});
    },

    maximizeTab: function(tabProperties) {
        console.log('maximized');
        console.log(tabProperties)

        // Initialize all tabs.
        _.map(this.state.tabsList, function(tab) {
            tab.isCurrentTab = false
        });

        // Tab become the current tab.
        tabProperties.isCurrentTab = true;

        // Update its properties.
        this.state.tabsList[tabProperties.className] = tabProperties;

        // Change state to render.
//        this.setState({tabsList: this.state.tabsList});
        // Set state to render.
        this.setState({
            tabsList: this.state.tabsList
            //primaryTopicsPointedGraphs:[pg]
        });

    },

    render: function () {
        var self = this;
        console.log("render foafBof");
        console.log(this.state.tabsList);

        var foafBoxTree =
            <div className="PersonalProfileDocument">
                <MainSearchBox filterText={this.state.filterText} personPG={this.state.primaryTopicsPointedGraphs} onUserInput={this.handleUserInputInSearchBox}/>
                <div id="actionNeeded">Action needed</div>
                {
                    _.map(this.state.tabsList, function (tab) {
                        return self._createTab(tab);
                    })
                }
                <div className="footer">
                    <div className="footer-handle center-text title-case">Navigation</div>
                    <div className="footer-content">
                        <ul>
                        {
                            _.map(this.state.tabsList, function (tab) {
                                return self._createFooter(tab);
                            })
                        }
                        </ul>
                    </div>
                </div>
            </div>;

        console.log(foafBoxTree);

        /*var nofoafBoxTree = <div class="shape-canvas no-shapes">No Shapes Found</div>;*/

        return foafBoxTree;
    },

    _createTab:function(tab) {
        return <Space
            personPG={this.state.primaryTopicsPointedGraphs}
            properties={tab}
            loadUserProfile={this.loadUserProfile}
            closeTab={this.closeTab}
            minimizeTab={this.minimizeTab}
            />;
    },

    _createFooter:function(tab) {
        return <Footer
        personPG={this.state.primaryTopicsPointedGraphs}
        properties={tab}
        maximizeTab={this.maximizeTab}
        />;
    }

});

//personPG={this.state.primaryTopicsPointedGraphs}
//<Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>
//<Space personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>

