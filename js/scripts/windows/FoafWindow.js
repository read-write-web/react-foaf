/** @jsx React.DOM */

define([
    'react',
    'mixins',
    'q',
    'director',
    'foafUtils',
    'PGUtils',
    'notify',
    'globalRdfStore',
    'jsx!ContentSpace',
    'jsx!MainSearchBox',
    'jsx!Person',
    'jsx!PersonContacts',
    'jsx!PersonContactsRecommendation',
    'jsx!FooterItem'
], function (React,
             mixins,
             Q,
             director,
             foafUtils,
             PGUtils,
             notify,
             globalRdfStore,
             ContentSpace,
             MainSearchBox,
             Person,
             PersonContacts,
             PersonContactsRecommendation,
             Footer) {


var FoafWindow = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "FoafWindow",

    getInitialState: function() {
        return {
            personPG: undefined,
            personPGDeepCopy: undefined,
            filterText: '',
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
                    self.debug("Router: Will init with going to home",self.props.url);
                    self._initState(self.props.url)
                } else {
                    self.debug("Router: Already initialialized: won't go to home");
                }
            },
            onVisitProfile : function(profileURL) {
                if ( !self._isInitialized() ) {
                    console.debug("Router: Will init with going to profileURL=",profileURL)
                    self._initState(self.props.url,profileURL);
                } else {
                    self.debug("Router: Already initialialized: won't go to profileURL=",profileURL);
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
                var content1 = <PersonContacts
                                    toolsBarVisible='true'
                                    personPG={this.state.personPG}
                                    currentUserPG={this.state.personPG}
                                    onContactSelected={this._loadOrMaximizeUserProfileFromUrl}
                                    onAddContact={this._addContact}
                                    onRemoveContact={this._removeContact}
                                />;
                var content2 = <PersonContactsRecommendation
                                    currentUserPG={this.state.personPG}
                                    onContactSelected={this._loadOrMaximizeUserProfileFromUrl}
                                    onAddContact={this._addContact}
                                />;
                contentSpace = <ContentSpace
                                    clazz="space center"
                                    isDefaultTab={this._isDefaultTab}
                                    uploadDroppedItems={this._uploadDroppedItems}>
                                    {content1}
                                    {content2}
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
                                    currentUserPG={this.state.personPG}
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

    _uploadDroppedItems: function(dataTransfer, onUserAddHimselfCallback, onUserAddContactTwiceCallback) {
        var r = _.chain(dataTransfer.types)
            .filter(function(type) {
                return type == 'text/uri-list'})
            .map(function(type) {
                return dataTransfer.getData(type)
            }).value();

        // TODO : The Uri is is a WEBID, is it a valid URi???
        // Add user as contact.
        this.log('_uploadDroppedItems : ' + r);
        if (r.length != 0) {
            var uriSym = new $rdf.sym(r[0]);

            // If contact is current user.
            if (this._isCurrentUser(uriSym)) {
                onUserAddHimselfCallback();
             };

            //If contactUri is already in the current user contact lists, cancel.
            if (this._isContactWithCurrentUser(uriSym)) {
                onUserAddContactTwiceCallback();
            };

            // Add contact.
            this._addContact(uriSym);
        };
    },

    _isCurrentUser: function(contactUriSym) {
        var currentUserPG = this.state.personPG;
        return (contactUriSym.value == currentUserPG.pointer.value);
    },

    _isContactWithCurrentUser: function(contactUriSym) {
        var currentUserPG = this.state.personPG;
        return currentUserPG.hasPointerTripleMatching( FOAF('knows'), contactUriSym); // TODO: not working ?!!!
    },

    _addContact: function(contactUriSym) {
        $rdf.PG.Utils.checkState( !this._isCurrentUser(contactUriSym) , "The user can't add himself as a contact!");
        $rdf.PG.Utils.checkState( !this._isContactWithCurrentUser(contactUriSym) , "The user can't add its contact as a contact!");
        var self = this;
        var currentUserPG = this.state.personPG;
        var currentUserUri = this.state.personPG.pointer.value;
        this.log("_addContact ");
        this.log(contactUriSym);

        // Create a deep copy of the current PG and update it with new contact.
        var personPGCopy = this.state.personPG.deepCopyOfGraph();
        PGUtils.addRel(personPGCopy, FOAF('knows'), contactUriSym);
        var dataToSend = new $rdf.Serializer(personPGCopy.store).toN3(personPGCopy.store);

        // PUT the changes to the server.
        currentUserPG.ajaxPut(currentUserUri, dataToSend,
            function success() {
                notify("success", "New contact saved.");
                // If success, update the current store.
                //TODO Restore current PG.
                currentUserPG.replaceStatements(personPGCopy);
                self.setState({personPG: currentUserPG});
            },
            function error(status, xhr) {
                notify("error", "Failed to save new contact. Try again later!");

                // If error, restore old store.
                //TODO Restore current PG ?.
                self.setState({personPG: currentUserPG});
            }
        )
    },

    _removeContact: function(contactUriSym) {
        $rdf.PG.Utils.checkState( !this._isCurrentUser(contactUriSym) , "The user can't remove himself as a contact!");
        var self = this;
        var currentUserPG = this.state.personPG;
        var currentUserUri = this.state.personPG.pointer.value;
        this.log("_removeContact : ");
        this.log(contactUriSym);

        // Create a deep copy of the current PG and update it with new contact.
        var personPGCopy = this.state.personPG.deepCopyOfGraph();
        PGUtils.removeRel(personPGCopy, FOAF('knows'), contactUriSym);
        var dataToSend = new $rdf.Serializer(personPGCopy.store).toN3(personPGCopy.store);

        // PUT the changes to the server.
        currentUserPG.ajaxPut(currentUserUri, dataToSend,
            function success() {
                notify("success", "Contact removed.");
                self.log("************** Success");
                // If success, update the current store.
                currentUserPG.replaceStatements(personPGCopy);
                self.setState({personPG: currentUserPG});
            },
            function error(status, xhr) {
                notify("error", "Failed to remove new contact. Try again later!");
                //TODO Restore current PG ?.
                self.log("************** Error");
                self.log(status);
                // If error, restore old store.
                self.setState({personPG: currentUserPG});
            }
        )
    },

    _submitEdition: function(personPG){
        var self = this;
        var currentTab = this._getCurrentTab();
        var currentTabPG = currentTab.personPG;
        var currentTabUri = currentTab.personPG.pointer.value;
        var data = new $rdf.Serializer(personPG.store).toN3(personPG.store);
        currentTabPG.ajaxPut(currentTabUri, data,
            function success() {
                self.log("************** Success");
                notify("success", "New information saved.");
                // Replace statements in current PG and change component state.
                currentTabPG.replaceStatements(personPG);
                self.setState({personPG: currentTabPG});
            },
            function error(status, xhr) {
                notify("error", "Failed to save information. Try again later!");
                //TODO Restore current PG ?.
                self.log("************** Error");
                self.log(status);
                self.setState({personPG: currentTabPG});
            }
        )

        // Return.
        return false;
    },

    _loadOrMaximizeUserProfileFromUrl: function(url) {
        console.log("************************")
        console.log("************************")
        console.log("************************")
        console.log("************************")
        console.log("************************")
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

