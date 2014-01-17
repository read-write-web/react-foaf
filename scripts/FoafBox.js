/** @jsx React.DOM */

var FoafBx = React.createClass({

    getInitialState: function() {
        var initialTab = {
            pointedGraphs:[],
            type:"contacts",
            className:"0",
            isCurrentTab:true,
            isDefaultTab:true
        };

       return {
            primaryTopicsPointedGraphs: [],
            testPg:[],
            filterText: '',
            tabsList: {0:initialTab}
       };
    },

	componentDidMount: function() {
		 this._fetchURL(this.props.url);
	 },

    render: function () {
        var self = this;
        console.log("render foafBof");
        console.log(this.state.tabsList);

        var foafBoxTree =
            <div className="PersonalProfileDocument">
                <MainSearchBox
                    filterText={this.state.filterText}
                    personPGs={this.state.primaryTopicsPointedGraphs}
                    onUserInput={this._inputInSearchBox}
                    loadCurrentUser={this._loadCurrentUser}
                    />
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

    _fetchURL: function(url) {
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
                    testPg:pt,
                    tabsList:self.state.tabsList
                });
                //need loading function to display advances in download
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
            })

    },

    _submitEdition: function(data){
        var self = this;

        console.log('update profile');
        console.log(this.state.primaryTopicsPointedGraphs)
        console.log(data);

        _.chain(data)
            .map(function (d) {
                console.log(d);
                // Test: Take the first graph to update.
                self.state.primaryTopicsPointedGraphs[0].update(FOAF("name"), d.fVal, d.nVal);
            })
            .value()

        // Return.
        return false;
    },

    _loadUserProfile: function(pg){
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
            isCurrentTab:true,
            isDefaultTab:false
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

    _loadCurrentUser: function() {
        this._loadUserProfile(this.state.testPg[0]);
    },

    _inputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    _closeTab: function(tabProperties) {
        // Update its properties.
        delete this.state.tabsList[tabProperties.className];

        // Set initial tab as current tab.
        currentIndex = 0;
        this.state.tabsList[currentIndex].isCurrentTab = true;

        // Change state to render.
        this.setState({
            tabsList: this.state.tabsList,
            primaryTopicsPointedGraphs:this.state.tabsList[currentIndex].pointedGraphs
        });
    },

    _minimizeTab: function(tabProperties) {
        //console.log('minimize');
        //console.log(tabProperties);

        // Tab is not current the tab anymore.
        tabProperties.isCurrentTab = false;

        // Update its properties.
        this.state.tabsList[tabProperties.className] = tabProperties;

        // Set initial tab as current tab.
        //var currentIndex = parseInt(tabProperties.className)-1;
        currentIndex = 0;
        this.state.tabsList[currentIndex].isCurrentTab = true;

        // Change state to render.
        this.setState({
            tabsList: this.state.tabsList,
            primaryTopicsPointedGraphs:this.state.tabsList[currentIndex].pointedGraphs
        });
    },

    _maximizeTab: function(tabProperties) {
        console.log('maximized');
        console.log(tabProperties)

        // Initialize all tabs.
        _.map(this.state.tabsList, function(tab) {
            tab.isCurrentTab = false
        });

        // Tab becomes the current tab.
        tabProperties.isCurrentTab = true;

        // Update its properties.
        var currentIndex = parseInt(tabProperties.className);
        this.state.tabsList[currentIndex] = tabProperties;

        // Change state to render.
        this.setState({
            tabsList: this.state.tabsList,
            primaryTopicsPointedGraphs:tabProperties.pointedGraphs
        });
    },

    // Methods not ReactJs should begin with _xxx (need to change it on all the app files).
    _createTab:function(tab) {
        return <Space
            personPG={this.state.primaryTopicsPointedGraphs}
            properties={tab}
            loadUserProfile={this._loadUserProfile}
            submitEdition={this._submitEdition}
            closeTab={this._closeTab}
            minimizeTab={this._minimizeTab}
            />;
    },

    _createFooter:function(tab) {
        return <Footer
        personPG={this.state.primaryTopicsPointedGraphs}
        properties={tab}
        maximizeTab={this._maximizeTab}
        />;
    }

});

//personPG={this.state.primaryTopicsPointedGraphs}
//<Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>
//<Space personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>

