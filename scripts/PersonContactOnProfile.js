/** @jsx React.DOM */

var PersonContactOnProfile = React.createClass({
    getInitialState: function() {
        return {
            jumpedPointedGraph:undefined,
            error: undefined
        }
    },

    componentWillMount: function () {
        var component = this;
        console.log("in componentWillMount for MiniPerson( " + component.props.personPG.pointer + ")");
        component.props.personPG.jumpAsync(false).then(
            function (jumpedPG) {
                console.log("MiniPerson.  PG(_," + component.props.personPG.pointer + ","
                    + component.props.personPG.webGraph + ",_).jumpAsync=PG(_," + jumpedPG.pointer + "," + jumpedPG.webGraph + ",_)");
                component.setState({
                    jumpedPointedGraph: jumpedPG
                })
            },
            function (err) {
                console.log("MiniPerson. error in PG(_," + component.props.personPG.pointer + "," +
                    component.props.personPG.webGraph + ",_).jumpAsync=" + err);
                component.setState({error: err})
            }
        )
    },

    handlerClick: function() {
        return this.props.handlerClick(this.state.jumpedPointedGraph);
    },

    setElementClasses: function() {
        var loadingStr = "";
        var info = undefined;
        if (this.props.personPG.isLocalPointer()) {
            console.log("this.props.personPG.isLocalPointer() TRUEEEEEE")
            if (this.props.personPG.pointer.termType == "bnode") {
                info = (<p>not a webid</p>)
            } else if (this.props.personPG.pointer.termType == "literal") {
                info = (<p>a literal!!!</p>)
            } else {
                info = (<p>locally defined</p>)
            }
        } else {
            jumpedState = this.state.jumpedPointedGraph;
            if (jumpedState) {
                if (!jumpedState.isLocalPointer()) {
                    info = (<p>there was not definitional info in the remote graph</p>)
                } else {
                    info = (<p>definitional info, page was loaded</p>)
                }
            } else {
                console.log("LOADINGGGGGGG")
                info = (<p>no remote info yet</p>)
                loadingStr = "loading"
            }
        }
        console.log("built up info about mini agent:");
        console.log(info);

        // Set appropriate class of li items.
        return "contact clearfix float-left "+ loadingStr + ((this.state.error)?" error":"");
    },

    render: function() {
        console.log('render profile $$$$$$$$$$$$$$$$$$$$$$$$$$')
        var originalAndJumpedPG =  _.compact([this.props.personPG, this.state.jumpedPointedGraph ])
        console.log(originalAndJumpedPG);

        // Define appropriate class for the view.
        var clazz = this.setElementClasses();
        console.log(clazz);

        return (
            <li className={clazz} onClick={this.handlerClick}>
                <div className="loader"></div>
                <div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>
                <PersonContactOnProfileBasicInfo personPGs={originalAndJumpedPG}/>
                <PersonContactOnProfileNotifications personPGs={originalAndJumpedPG}/>
                <PersonContactOnProfileMoreInfo personPGs={originalAndJumpedPG}/>
            </li>

            );
    }
});