/** @jsx React.DOM */

var PersonContactOnProfile = React.createClass({
    getInitialState: function() {
        return {
            jumpedPointedGraph: this.props.personPG.jump()
        }
    },

    componentDidMount: function () {
        //console.log('In componentDidMount of PersonContactOnProfile !!!!!!!!!! ********** ************');
        //console.log(this.props.personPG)
        var component = this;
        this.props.personPG.jumpAsync(false).then(
            function (jumpedPersonPG) {
				//console.log("Success");
			    //console.log("Change:", component.state.jumpedPointedGraph.pointer.toNT(), "->", jumpedPersonPG);
                //console.log(jumpedPersonPG);
                component.replaceState({
                    jumpedPointedGraph: jumpedPersonPG
                })
            },
            function (err) {
                console.error(err);
					//console.log("error:", component.state.jumpedPointedGraph.pointer.toNT(), "->", err);
                component.replaceState({
						 jumpedPointedGraph: this.props.personPG,
						 error: err
					 })
            }
        )
    },

    handleClick: function(e) {
		 var component = this;
        // TODO maybe not appropriate?
		 if (this.state.jumpedPointedGraph) {
			 console.log("clicked on Person box info->");
			 console.log(this.state.jumpedPointedGraph);
		 } else console.log("graph not downloaded yet");

        // ?
		if ( ! ( this.state.jumpedPointedGraph.pointer.isBlank || this.state.jumpedPointedGraph.pointer.isVar)) {
            var personContactUrl = this.props.personPG.pointer.value;
            this.props.onPersonContactClick();
        }
		return true;
	 },

    setElementClasses: function() {
        var loadingStr = "";
        var info = undefined;
        if (this.props.personPG.isLocalPointer()) {
            if (this.props.personPG.pointer.termType === "bnode") {
                info = (<p>not a webid</p>)
            } else if (this.props.personPG.pointer.termType === "literal") {
                info = (<p>a literal!!!</p>)
            } else {
                info = (<p>locally defined</p>)
            }
        } else {
            jumpedState = this.state.jumpedPointedGraph;
            if (jumpedState) {
					if (jumpedState.isLocalPointer()) {
						info = (<p>definitional info, page was loaded</p>)
					} else {
						info = (<p>there was not definitional info in the remote graph</p>)
					}
            } else {
                info = (<p>no remote info yet</p>);
                loadingStr = "loading"
            }
        }

        // Set appropriate class of li items.
        return "contact clearfix float-left "+ loadingStr + ((this.state.error)?" error":"");
    },

    componentWillReceiveProps: function(newProps) {
        /*console.log('componentWillReceiveProps !!!!!!! *************** ****************')
        console.log(this.state.jumpedPointedGraph)
        console.log(newProps)*/

        /*
        this.setState({
            jumpedPointedGraph:newProps.personPG
        });
        */

        /*
        var component = this;
        newProps.personPG.jumpAsync(false).then(
            function (jumpedPersonPG) {
                //console.log("Change:", component.state.jumpedPointedGraph.pointer.toNT(), "->", jumpedPersonPG);
                console.log("success")
                console.log(jumpedPersonPG)
                component.replaceState({
                    jumpedPointedGraph: jumpedPersonPG
                })
            },
            function (err) {
                console.log("error")
                //console.log("error:", component.state.jumpedPointedGraph.pointer.toNT(), "->", err);
                component.replaceState({
                    jumpedPointedGraph: this.props.personPG,
                    error: err
                })
            }
        )
        */

    },

    render: function() {
        //console.log("Render PersonContactOnProfile")
        // Check if user should be displayed.
        var show = {display: (this.displayUser()) ? 'block' : 'none'};

        // Set appropriate Pgs.
        var originalAndJumpedPG = _.compact([this.props.personPG, this.state.jumpedPointedGraph ]);
        //console.log(originalAndJumpedPG);

        // Define appropriate class for the view.
        var clazz = this.setElementClasses();

        // Return.
        return (
            <li className={clazz} style={show} onClick={this.handleClick}>
                <div className="loader"></div>
                <PersonContactOnProfilePix personPGs={originalAndJumpedPG} />
                <PersonContactOnProfileBasicInfo personPGs={originalAndJumpedPG} />
                <PersonContactOnProfileNotifications personPGs={originalAndJumpedPG} getNotifications={this.getNotifications}/>
                <PersonContactOnProfileMessage personPG={originalAndJumpedPG}/>
            </li>
            );
    },

    displayUser: function() {
        var originalAndJumpedPG = _.compact([this.props.personPG, this.state.jumpedPointedGraph ]);
        var userName = foafUtils.getName(originalAndJumpedPG).toString().toLowerCase();
        var filterText = this.props.filterText;
        if (!filterText) return true;
        else {
            filterText = filterText.toString().toLowerCase();
            return (userName.indexOf(filterText) != -1) && (userName.indexOf(filterText) == 0);
        }
    }

});