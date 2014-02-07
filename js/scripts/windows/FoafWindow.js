/** @jsx React.DOM */

define([
    'react',
    'mixins',
    'q',
    'director',
    'globalRdfStore',
    'jsx!ContentSpace',
    'jsx!MainSearchBox',
    'jsx!Person',
    'jsx!PersonContacts',
    'jsx!FooterItem'
], function (React,
             mixins,
             Q,
             director,
             globalRdfStore,
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
            personPGDeepCopy: undefined,
            filterText: '',
            showOverlay:false,
            modeEdit: false,
            tabs: [], // unordered
            activeTabs: [] // first element is the displayed one: it's a stack
        };
    },

    componentWillMount: function() {
        var self = this;

        // Cancel drag and drop event default behavior on the body.
        $("body").bind({"dragenter dragover dragexit dragleave drop":
            function (e) {
                e.preventDefault();
            }
        });
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
        globalRdfStore.fetcher.fetch(profileURL)
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
                var content = <PersonContacts
                                toolsBarVisible='true'
                                personPG={this.state.personPG}
                                currentUserPG={this.state.personPG}
                                onContactSelected={this._loadOrMaximizeUserProfileFromUrl}
                                onAddContact={this._addContact}
                                onRemoveContact={this._removeContact}
                                />;
                contentSpace = <ContentSpace
                                clazz="space center"
                                isDefaultTab={this._isDefaultTab}
                                uploadDroppedItems={this._uploadDroppedItems}>{content}
                                </ContentSpace>;
            }
            else {
                //var currentTab = this._getCurrentTab()
                this.debug("Active tabs have been found, will display tab:",currentTab);
                var minimizeCurrentTab = this._minimizeTab.bind(this,currentTab);
                var closeCurrentTab = this._closeTab.bind(this,currentTab);
                if (!this.state.modeEdit) {
                    var content = <Person
                                    personPG={currentTab.personPG}
                                    currentUserPG={this.state.personPG}
                                    modeEdit={this.state.modeEdit}
                                    submitEdition={this._submitEdition}
                                    onContactSelected={this._loadOrMaximizeUserProfileFromUrl}
                                    onAddContact={this._addContact}
                                    onRemoveContact={this._removeContact}
                                    handleClickChangeModeEdit={this._handleClickChangeModeEdit}/>
                } else {
                    var content = <Person
                                    personPG={this.state.personPGDeepCopy}
                                    modeEdit={this.state.modeEdit}
                                    submitEdition={this._submitEdition}
                                    onContactSelected={this._loadOrMaximizeUserProfileFromUrl}
                                    handleClickChangeModeEdit={this._handleClickChangeModeEdit}/>
                }
                contentSpace = <ContentSpace
                                onMinimize={minimizeCurrentTab}
                                onClose={closeCurrentTab}
                                isDefaultTab={this._isDefaultTab}
                                uploadDroppedItems={this._uploadDroppedItems}>{content}
                                </ContentSpace>;
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
                    <div className="tabs">
                        {contentSpace}
                    </div>
                    <Footer
                        activeTabs={this.state.activeTabs}
                        tabs={this.state.tabs}
                        onTabClicked={this._toggleTab}
                        minimizeAllTabs={this._minimizeAllTabs}
                        closeAllTabs={this._closeAllTabs}
                    />
                </div>;
            return foafBoxTree;
        } //onDrop={this._handleDrop}
    },

    _handleClickChangeModeEdit: function(bool) {
        this.log("_handleClickChangeModeEdit");

        // Create a deep copy of the current PG is needed.
        var personPGCopy = (bool)? this.state.personPG.deepCopyOfGraph():undefined;

        // Render component with new state.
        this.setState({
            modeEdit:bool,
            personPGDeepCopy:personPGCopy
        });
    },

    _uploadDroppedItems: function(dataTransfer) {
        var r = _.chain(dataTransfer.types)
            .filter(function(type) {
                return type == 'text/uri-list'})
            .map(function(type) {
                return dataTransfer.getData(type)
            }).value();

        // TODO : The Uri is is a WEBID, is it a valid URi???
        // Add user as contact.
        this.log('_uploadDroppedItems : ' + r);
        if (r.length != 0) this._addContact(r[0]);
    },

    _addContact: function(contactUri) {
        var self = this;
        var currentUserPG = this.state.personPG;
        var baseUri = this.state.personPG.pointer.value;
        var contactUriSym = $rdf.sym(contactUri);

        // If contactUri is the current user, cancel.
        if (contactUri == currentUserPG.pointer.value) return;

        // If contactUri is already in the current user contact lists, cancel.
        var existCheck = currentUserPG.isStatementExist(currentUserPG.pointer, FOAF('knows'), contactUriSym, currentUserPG.namedGraphFetchUrl);
        if (existCheck) return;

        this.log("_addContact : " + contactUri);

        // Create a deep copy of the current PG and update it with new contact.
        var personPGCopy = this.state.personPG.deepCopyOfGraph();
        personPGCopy.addNewStatement(currentUserPG.pointer, FOAF('knows'), contactUriSym, currentUserPG.namedGraphFetchUrl);
        var dataToSend = new $rdf.Serializer(personPGCopy.store).toN3(personPGCopy.store);

        // PUT the changes to the server.
        currentUserPG.ajaxPut(baseUri, dataToSend,
            function success() {
                self.log("************** Success");
                // If success, update the current store.
                currentUserPG.replaceStatements(personPGCopy);
                self.setState({
                    personPG: currentUserPG,
                    showOverlay:false
                });
            },
            function error(status, xhr) {
                //TODO Restore current PG ?.
                self.log("************** Error");
                self.log(status);
                self.setState({
                    showOverlay:false
                });
            }
        )
    },

    _removeContact: function(contactUri) {
        var self = this;
        var currentUserPG = this.state.personPG;
        var baseUri = this.state.personPG.pointer.value;
        var contactUriSym = $rdf.sym(contactUri);
        this.log("_removeContact : " + contactUri);
        return;

    },

    _submitEdition: function(personPG){
        var self = this;
        var currentTab = this._getCurrentTab();
        var currentTabPG = currentTab.personPG;
        var baseUri = currentTab.personPG.pointer.value;
        var data = new $rdf.Serializer(personPG.store).toN3(personPG.store);
        currentTabPG.ajaxPut(baseUri, data,
            function success() {
                self.log("************** Success");
                // Replace statements in current PG and change component state.
                currentTabPG.replaceStatements(personPG);
                self.setState({
                    personPG: currentTabPG
                });
            },
            function error(status, xhr) {
                //TODO Restore current PG ?.
                self.log("************** Error");
                self.log(status);
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
        this.log("_createNewUserTabFromUrl ",url);
        var self = this;
        globalRdfStore.fetcher.fetch(url)
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

