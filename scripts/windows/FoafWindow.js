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
        console.log("render FoafWindow with state");
        console.log(this.state);

        if ( !this.state.personPG ) {
            return <div>{'LOADING'}</div>;
        }
        else {
            var contentSpace;
            if ( _.isEmpty(this.state.activeTabs) ) {
                console.debug("No active tab, will display PersonContacts");
                var content = <PersonContacts personPG={this.state.personPG}/>;
                contentSpace = <ContentSpace clazz="space center">{content}</ContentSpace>;
            }
            else {
                var firstActiveTab = _.first(this.state.activeTabs);
                console.debug("Active tabs have been found, will display tab:");
                console.debug(firstActiveTab);
                var minimizeFirstTab = this._minimizeTab.bind(this,firstActiveTab);
                var closeFirstTab = this._closeTab.bind(this,firstActiveTab);
                var content = <Person personPG={firstActiveTab.personPG} submitEdition={this._submitEdition} />
                contentSpace = <ContentSpace onMinimize={minimizeFirstTab} onClose={closeFirstTab}>{content}</ContentSpace>;
            }

            var footerItems = _.map(this.state.tabs, function(tab) {
                return <FooterItem tab={tab} />;
            })

            var foafBoxTree =
                <div className="PersonalProfileDocument">
                    <MainSearchBox filterText={this.state.filterText} onUserInput={this._inputInSearchBox}/>
                    <div id="actionNeeded">Action needed</div>
                    <div className="tabs">{contentSpace}</div>
                    <div className="footer">
                        <div className="footer-handle center-text title-case">Navigation</div>
                        <div className="footer-content">
                            <ul>{footerItems}</ul>
                        </div>
                    </div>
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
        console.error("TODO _loadOrMaximizeUserProfileFromUrl");
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
        // Create a new tab.
        var newTab = {
            personPG: pg
        };

        /*
        this.setState({
            tabs: this.state.tabs.push(newTab),
            activeTabs: this.state.activeTabs.unshift(newTab)
        });
        */
        this.setState({
            tabs: _.union([newTab],this.state.tabs),
            activeTabs: _.union([newTab],this.state.activeTabs)
        })

        // False does not trigger web browser default action on submit event.
        return false;
    },

    _inputInSearchBox: function(text) {
        //this.setState({filterText:text});
    },

    _closeTab: function(tab) {
        this.setState({
            tabs: _.without(this.state.tabs,tab),
            activeTabs: _.without(this.state.activeTabs,tab)
        });
        if (_.isEmpty(this.state.activeTabs) ) {
            routeHelper.goToHome();
        }
    },

    _minimizeTab: function(tab) {
        console.log("_.without(this.state.activeTabs,tab) => ");
        console.log(this.state.activeTabs);
        console.log(tab);
        console.log(_.without(this.state.activeTabs,tab));
        this.setState({
            activeTabs: _.without(this.state.activeTabs,tab)
        });
        if (_.isEmpty(this.state.activeTabs) ) {
            routeHelper.goToHome();
        }
    },

    _maximizeTab: function(tab) {
        var newActiveTabs = _.unshift( _.without(this.state.activeTabs,tab),tab);
        this.setState({
            activeTabs: newActiveTabs
        });
    },

    _getTabOpenForUrl: function(url) {
        console.debug("Tabs = "+this.state.tabs);
        return _.find(this.state.tabs, function(tab) {
            return tab.personPG.pointer.value == url;
        });
    }

});

