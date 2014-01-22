/** @jsx React.DOM */

var PersonContactOnProfile = React.createClass({
    mixins: [WithLogger,WithLifecycleLoggingLite],
    componentName: "PersonContactOnProfile",

    getInitialState: function() {
        return {
            jumpedPointedGraph: this.props.personPG.jump()
        }
    },

    componentDidMount: function () {
        var self = this;
        this.props.personPG.jumpAsync(false).then(
            function (jumpedPersonPG) {
			    self.debug("Setting jumpedPersonPG: ", self.state.jumpedPointedGraph.pointer.toNT(), "->", jumpedPersonPG);
                self.replaceState({
                    jumpedPointedGraph: jumpedPersonPG
                })
            },
            function (err) {
                self.error("error:", component.state.jumpedPointedGraph.pointer.toNT(), "->", err);
                self.replaceState({
						 jumpedPointedGraph: this.props.personPG,
						 error: err
					 })
            }
        )
    },

    handleClick: function(e) {
        // TODO maybe not appropriate?
		 if (this.state.jumpedPointedGraph) {
			 this.log("clicked on Person box info->");
             this.log(this.state.jumpedPointedGraph);
		 } else {
             this.log("graph not downloaded yet");
         }

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

    render: function() {
        // Check if user should be displayed.
        var show = {display: (this.displayUser()) ? 'block' : 'none'};

        // Set appropriate Pgs.
        var originalAndJumpedPG = _.compact([this.props.personPG, this.state.jumpedPointedGraph ]);

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
