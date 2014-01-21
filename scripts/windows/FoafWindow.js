/** @jsx React.DOM */

var FoafWindow = React.createClass({

    getInitialState: function() {
        return {
            personPG: undefined,
            filterText: '',
            tabs: [], // unordered
            activeTabs: [] // first element is the displayed one: it's a stack
        };
    },

    componentDidMount: function() {
        this._initRouter();
    },

    _isInitialized: function() {
        return this.state.personPG
    },

    _initRouter: function() {
        var self = this;
        var onRouteChangeHandler = {
            onGoToHome: function() {
                if ( !self._isInitialized() ) {
                    self._fetchURL(self.props.url);
                }
            },
            onVisitProfile : function(profileURL) {
                if ( !self._isInitialized() ) {
                    self._fetchURL(self.props.url);
                    self._loadOrMaximizeUserProfileFromUrl(profileURL);
                }
            }
        }
        createRouter(onRouteChangeHandler)
    },

    /**
     * The current tab on which we focus: the first of the active tabs
     * Can return undefined if we are on the "desktop"
     * @returns {*}
     * @private
     */
    _getCurrentTab: function() {
        return _.first(this.state.activeTabs);
    },

    _updateRouteToCurrentState: function() {
        var currentTab = this._getCurrentTab()
        if ( currentTab ) {
            routeHelper.visitProfile(currentTab.personURL);
        } else {
            routeHelper.goToHome();
        }
    },


    render: function () {
        var self = this;
        console.log("render FoafWindow with state");
        console.log(this.state);

        if ( !this._isInitialized() ) {
            return <div>{'LOADING'}</div>;
        }
        else {
            var contentSpace;
            var currentTab = this._getCurrentTab();
            this._updateRouteToCurrentState();
            if ( !currentTab ) {
                console.debug("No active tab, will display PersonContacts");
                var content = <PersonContacts personPG={this.state.personPG} onContactSelected={this._loadOrMaximizeUserProfileFromUrl}/>;
                contentSpace = <ContentSpace clazz="space center">{content}</ContentSpace>;
            }
            else {
                var currentTab = this._getCurrentTab()
                console.debug("Active tabs have been found, will display tab:");
                console.debug(currentTab);
                var minimizeCurrentTab = this._minimizeTab.bind(this,currentTab);
                var closeCurrentTab = this._closeTab.bind(this,currentTab);
                var content = <Person personPG={currentTab.personPG} submitEdition={this._submitEdition} />
                contentSpace = <ContentSpace onMinimize={minimizeCurrentTab} onClose={closeCurrentTab}>{content}</ContentSpace>;
            }

            var foafBoxTree =
                <div className="PersonalProfileDocument">
                    <MainSearchBox filterText={this.state.filterText} onUserInput={this._inputInSearchBox}/>
                    <div id="actionNeeded">Action needed</div>
                    <div className="tabs">{contentSpace}</div>
                    <Footer
                    activeTabs={this.state.activeTabs}
                    tabs={this.state.tabs}
                    onTabClicked={this._toggleTab}
                    minimizeAllTabs={this._minimizeAllTabs}
                    closeAllTabs={this._closeAllTabs}
                    />
                </div>;
            return foafBoxTree;
        }
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
                    personPG: pg
                });
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
        console.log("_loadOrMaximizeUserProfileFromUrl " + url);
        var maybeTab = this._getTabOpenForUrl(url);
        if ( maybeTab ) {
            this._maximizeTab(maybeTab); // it is not a problem to maximise an already active tab
        }
        else {
            this._createNewUserTabFromUrl(url);
        }
    },

    _createNewUserTabFromUrl: function(url) {
        var self = this;
        console.debug("_createNewUserTabFromUrl = " + url);
        var fetcher = $rdf.fetcher(store, 10000, true);
        var referer = window.location; // TODO rework the referer with the url of a foaf profile previously visited
        var future = fetcher.fetch(url, referer);
        future.then(function(pg) {
            self._createNewUserTab(pg);
        });
    },

    _createNewUserTab: function(pg){
        var newTab = {
            personURL: pg.pointer.value,
            personPG: pg
        };
        this.setState({
            tabs: _.union([newTab],this.state.tabs),
            activeTabs: _.union([newTab],this.state.activeTabs)
        })
    },

    _inputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    _toggleTab: function(tab) {
        if ( _.contains(this.state.activeTabs,tab) ) {
            this._minimizeTab(tab);
        }
        else {
            this._maximizeTab(tab);
        }
    },

    _closeTab: function(tab) {
        this.setState({
            tabs: _.without(this.state.tabs,tab),
            activeTabs: _.without(this.state.activeTabs,tab)
        });
    },

    _closeAllTabs: function() {
        this.setState({
            tabs: [],
            activeTabs: []
        });
    },

    _minimizeTab: function(tab) {
        this.setState({
            activeTabs: _.without(this.state.activeTabs,tab)
        });
    },

    _minimizeAllTabs: function() {
        this.setState({
            activeTabs: []
        });
    },

    _maximizeTab: function(tab) {
        console.log("Maximizing tab:",tab);
        var tempActiveTabs = _.without(this.state.activeTabs,tab);
        var newActiveTabs = _.union([tab],tempActiveTabs);
        this.setState({
            activeTabs: newActiveTabs
        });
    },

    _getTabOpenForUrl: function(url) {
        console.debug("Tabs = "+this.state.tabs);
        return _.find(this.state.tabs, function(tab) {
            return tab.personURL == url;
        });
    }

});

