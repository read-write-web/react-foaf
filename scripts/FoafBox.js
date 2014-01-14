/** @jsx React.DOM */

var FoafBx = React.createClass({

    getInitialState: function() {
        var initialTab1 = {
            type:"contacts",
            className:"tab_0",
            isCurrentTab:true
        };

       return {
            primaryTopicsPointedGraphs: [],
            filterText: '',
            tabsList: {"tab_0":initialTab1}
       };
    },

	 componentDidMount: function() {
		 this.fetchURL(this.props.url);
	 },

    fetchURL: function(url) {
        if (!url) return;
        var component = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
        var future = fetcher.fetch(url, window.location);
        future.then(
            function (pg) {
                var pt = pg.rel(FOAF("primaryTopic"));
                component.setState({
						 primaryTopicsPointedGraphs: pt
					 });
                //need loading function to display advances in download
            },
            function (err) {
                console.log("returned from componentDidMount of " + url + " with error " + err);
            })

    },

    changeUser: function(pg){
        console.log("In foaf box ------->>>>> Change User")
        console.log(pg)
        this.setState({
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
        // Tab is not current the tab anymore.
        tabProperties.isCurrentTab = false;

        // Update its properties.
        this.state.tabsList[tabProperties.className] = tabProperties;

        // Change state to render.
        this.setState({tabsList: this.state.tabsList});
    },

    maximizeTab: function(tabProperties) {
        // Tab become the current tab.
        tabProperties.isCurrentTab = true;

        // Update its properties.
        this.state.tabsList[tabProperties.className] = tabProperties;

        // Change state to render.
        this.setState({tabsList: this.state.tabsList});
    },

    render: function () {
        var self = this;
        console.log("foafBof");
        console.log(this.state.tabsList);

        var spaceTree =
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


        console.log(spaceTree);

        /*var nospaceTree = <div class="shape-canvas no-shapes">No Shapes Found</div>;*/

        return spaceTree
    },

    _createShape: function(shape) {
        //return this._shapeMap[shape.type](shape);
    },

    _createTab:function(tab) {
        return <Space
            properties={tab}
            personPG={this.state.primaryTopicsPointedGraphs}
            changeUser={this.changeUser}
            closeTab={this.closeTab}
            minimizeTab={this.minimizeTab}
            />;
    },

    _createFooter2:function(tab) {
        return <Footer
            properties={tab}
            personPG={this.state.primaryTopicsPointedGraphs}
            changeUser={this.changeUser}
            closeTab={this.closeTab}
            />;
    },

    _createFooter:function(tab) {
        return <Footer
        properties={tab}
        personPG={this.state.primaryTopicsPointedGraphs}
        changeUser={this.changeUser}
        maximizeTab={this.maximizeTab}
        />;
    }

//<Space
//choice={this.state.tabChoice}
//show={this.state.tabShow}
//personPG={this.state.primaryTopicsPointedGraphs}
//changeUser={this.changeUser}
//closeTab={this.closeTab}/>
//<Footer
//show={this.state.show}
//personPG={this.state.primaryTopicsPointedGraphs}
//changeUser={this.changeUser}
//closeTab={this.closeTab}/>



});


//<Person personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>
//<Space personPG={this.state.primaryTopicsPointedGraphs} changeUser={this.changeUser}/>

