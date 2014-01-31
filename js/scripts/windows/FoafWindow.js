/** @jsx React.DOM */

define([
    'react',
    'mixins',
    'q',
    'director',
    'preconditions',
    'pointedGraph',
    'fetcherWithPromise',
    'StampleRdfibutils',
    'jsx!scripts/layout/ContentSpace',
    'jsx!scripts/layout/MainSearchBox',
    'jsx!scripts/person/Person',
    'jsx!scripts/contacts/PersonContacts',
    'jsx!scripts/layout/FooterItem'
], function (React,
             mixins,
             Q,
             director,
             preconditions,
             pointedGraph,
             fetchWithPromise,
             StampleRdfibutils,
             ContentSpace,
             MainSearchBox,
             Person,
             PersonContacts,
             Footer) {


var FoafWindow = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "FoafWindow",

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


    _isDefaultTab: function() {
        var currentTab = this._getCurrentTab();
        return (!currentTab)? true:false;
    },

    _initRouter: function() {
        var self = this;
        var onRouteChangeHandler = {
            onGoToHome: function() {
                if ( !self._isInitialized() ) {
                    self._initState(self.props.url)
                }
            },
            onVisitProfile : function(profileURL) {
                if ( !self._isInitialized() ) {
                    self._initState(self.props.url,profileURL);
                }
            }
        }
        createRouter(onRouteChangeHandler)
    },

    _initState: function(profileURL,openContactProfileURL) {
        var self = this;
        var lastAction = (openContactProfileURL ? this._loadOrMaximizeUserProfileFromUrl.bind(this,openContactProfileURL) : undefined);
        store.fetcher.fetch(profileURL)
            .then(function (pg) {
                self.setState({
                    personPG: pg
                });
            })
            .then(lastAction);
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
        this.log("render FoafWindow",this.state,this.props);
        if ( !this._isInitialized() ) {
            return <div>{'LOADING'}</div>;
        }
        else {
            var contentSpace;
            var currentTab = this._getCurrentTab();
            this._updateRouteToCurrentState();
            if ( !currentTab ) {
                this.debug("No active tab, will display PersonContacts");
                var content = <PersonContacts toolsBarVisible='true' personPG={this.state.personPG} onContactSelected={this._loadOrMaximizeUserProfileFromUrl}/>;
                contentSpace = <ContentSpace clazz="space center" isDefaultTab={this._isDefaultTab}>{content}</ContentSpace>;
            }
            else {
                //var currentTab = this._getCurrentTab()
                this.debug("Active tabs have been found, will display tab:",currentTab);
                var minimizeCurrentTab = this._minimizeTab.bind(this,currentTab);
                var closeCurrentTab = this._closeTab.bind(this,currentTab);
                var content = <Person personPG={currentTab.personPG} submitEdition={this._submitEdition} onContactSelected={this._loadOrMaximizeUserProfileFromUrl}/>
                contentSpace = <ContentSpace onMinimize={minimizeCurrentTab} onClose={closeCurrentTab} isDefaultTab={this._isDefaultTab}>{content}</ContentSpace>;
            }

            var foafBoxTree =
                <div className="PersonalProfileDocument">
                    <MainSearchBox
                    personPG={this.state.personPG}
                    filterText={this.state.filterText}
                    onUserInput={this._inputInSearchBox}
                    loadCurrentUserProfileFromUrl={this._loadOrMaximizeUserProfileFromUrl}
                    />
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

    _submitEdition: function(personPG){
        var self = this;
        var currentTab = this._getCurrentTab();
        var currentTabPG = currentTab.personPG;
        var baseUri = currentTab.personPG.pointer.value;
        var data = new $rdf.Serializer(personPG.store).toN3(personPG.store);
        currentTabPG.ajaxPut(baseUri, data,
            function success() {
                console.log("************** Success");
                // Replace statements in current PG and change component state.
                currentTabPG.replaceStatements(personPG);
                self.setState({
                    personPG: currentTabPG
                });
            },
            function error(status, xhr) {
                //TODO Restore current PG.
                console.log("************** Error");
                console.log(status)
                console.log(xhr)
            }
        )

        // Return.
        return false;
    },

    _loadOrMaximizeUserProfileFromUrl: function(url) {
        this.log("_loadOrMaximizeUserProfileFromUrl ",url);
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
        store.fetcher.fetch(url)
            .then(function(pg) {
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
        this.log("Maximizing tab:",tab);
        var tempActiveTabs = _.without(this.state.activeTabs,tab);
        var newActiveTabs = _.union([tab],tempActiveTabs);
        this.setState({
            activeTabs: newActiveTabs
        });
    },

    _getTabOpenForUrl: function(url) {
        this.debug("Tabs = "+this.state.tabs);
        return _.find(this.state.tabs, function(tab) {
            return tab.personURL == url;
        });
    }

});

return FoafWindow;

});

