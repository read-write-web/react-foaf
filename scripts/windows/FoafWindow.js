/** @jsx React.DOM */

var FoafWindow = React.createClass({

    getInitialState: function() {
        // TODO this should not be seen as a tab, it's more like the uncloseable "background" that is shawn when there is no active tab
        var initialTab = {
            type:"contacts",
            className:"0",
            isCurrentTab:true,
            isDefaultTab:true
        };

        return {
            personPG: undefined,
            filterText: '',
            tabsList: {0:initialTab}
        };
    },

    componentDidMount: function() {
        this._fetchURL(this.props.url);
        // it is important to create the router after the fetching to open the tab
        // TODO there may be concurrency issues and maybe the 2 calls must be chained sequentially
        this._initRouter();
    },



    _initRouter : function() {
        var self = this;
        var onRouteChangeHandler = {
            onGoToHome: function() {
                self._fetchURL(self.props.url);
            },
            onVisitProfile : function(profileURL) {
                self._loadOrMaximizeUserProfileFromUrl(profileURL);
            }
        }
        return createRouter(onRouteChangeHandler)
    },


    render: function () {
        var self = this;
        console.log("render FoafWindow");
        console.log(this.state.tabsList);

        var tabs;
        var footerItems;
        if ( this.state.personPG ) {
            var personPG = this.state.personPG;
            tabs = _.map(this.state.tabsList, function (tab) {
                return self._createTab(tab);
            })
            footerItems = _.map(this.state.tabsList, function (tab) {
                return self._createFooter(tab);
            })
        } else {
            tabs = "LOADING"; // TODO fix this with a loading icon or something ?
            footerItems = "LOADING"; // TODO fix this with a loading icon or something ?
        }

        var foafBoxTree =
            <div className="PersonalProfileDocument">
                <MainSearchBox filterText={this.state.filterText} onUserInput={this._inputInSearchBox}/>
                <div id="actionNeeded">Action needed</div>
                <div className="tabs">{tabs}</div>
                <div className="footer">
                    <div className="footer-handle center-text title-case">Navigation</div>
                    <div className="footer-content">
                        <ul>{footerItems}</ul>
                    </div>
                </div>
            </div>;
        console.log(foafBoxTree);
        return foafBoxTree;
    },

    _fetchURL: function(url) {
        if (!url) return;
        var self = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var referer = window.location; // TODO rework the referer with the url of a foaf profile previously visited
        var future = fetcher.fetch(url, referer);
        future.then(
            function (pg) {
                console.log("Setting pg for " + url);
                console.log(pg);
                self.setState({
                    personPG: pg,
                    tabsList: self.state.tabsList
                });
                //self.forceUpdate(); // TODO temporary
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
            })

    },


    _submitEdition: function(data){
        var self = this;

        console.log('update profile');
        console.log(data);

        _.chain(data)
            .map(function (d) {
                console.log(d);
                // Test: Take the first graph to update.
                self.state.personPG.update(FOAF("name"), d.fVal, d.nVal);
            })
            .value()

        // Return.
        return false;
    },

    _loadOrMaximizeUserProfileFromUrl: function(url) {
        console.error("TODO _loadOrMaximizeUserProfileFromUrl");
        this._loadUserProfileFromUrl(url); // TODO bad, should maximize if it already exists in the tabs!
    },

    _loadUserProfileFromUrl: function(url) {
        var self = this;
        console.debug("_loadUserProfileFromUrl = " + url);
        var fetcher = $rdf.fetcher(store, 10000, true);
        var referer = window.location; // TODO rework the referer with the url of a foaf profile previously visited
        var future = fetcher.fetch(url, referer);
        future.then(function(pg) {
            self._loadUserProfile(pg);
        });
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
            personPG: pg,
            type:"person",
            className:(maxKey+1).toString(),
            isCurrentTab:true,
            isDefaultTab:false
        };

        // Update the list of tabs.
        this.state.tabsList[maxKey+1] = newTab;

        // Set state to render.
        this.setState({
            personPG: this.state.personPG,
            tabsList: this.state.tabsList
        });

        return false;
    },

    _inputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    _closeTab: function(tabProperties) {
        // Update its properties.
        delete this.state.tabsList[tabProperties.className]; // TODO should not use classname as tab index but id instead

        // Set initial tab as current tab.
        currentIndex = 0; // TODO should stack tabs instead of returned to 0 tab
        this.state.tabsList[currentIndex].isCurrentTab = true;

        // Change state to render.
        this.setState({
            tabsList: this.state.tabsList,
            personPG: this.state.personPG
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
            personPG: this.state.personPG
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
            personPG: this.state.personPG
        });
    },

    _createTab:function(tab) {
        return <Space
        properties={tab}
        personPG={this.state.personPG}
        loadUserProfile={this._loadUserProfile}
        closeTab={this._closeTab}
        minimizeTab={this._minimizeTab}
        submitEdition={this._submitEdition}
        />;
    },

    _createFooter:function(tab) {
        return <Footer
        properties={tab}
        maximizeTab={this._maximizeTab}
        />;
    }

});

