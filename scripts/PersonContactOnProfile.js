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

        // Check user and filter.
        var show = {
            display: (this.displayUser()) ? 'block' : 'none'
        };

        var originalAndJumpedPG =  _.compact([this.props.personPG, this.state.jumpedPointedGraph ])
        console.log(originalAndJumpedPG);

        // Define appropriate class for the view.
        var clazz = this.setElementClasses();
        console.log(clazz);

        return (
            <li className={clazz} style={show} onClick={this.handlerClick}>
                <div className="loader"></div>
                <PersonContactOnProfilePix personPGs={originalAndJumpedPG}  getUserImg={this.getUserImg}/>
                <PersonContactOnProfileBasicInfo personPGs={originalAndJumpedPG}  getBasicInfo={this.getBasicInfo}/>
                <PersonContactOnProfileNotifications personPGs={originalAndJumpedPG} getNotifications={this.getNotifications}/>
                <PersonContactOnProfileMessage personPG={originalAndJumpedPG} getMessage={this.getMessage}/>
            </li>
            );
    },

    displayUser: function() {
        var originalAndJumpedPG =  _.compact([this.props.personPG, this.state.jumpedPointedGraph ])
        var userName = foafUtils.getName(originalAndJumpedPG).toString().toLowerCase();
        var filterText = this.props.filterText;
        if (!filterText) return true
        else {
            filterText = filterText.toString().toLowerCase();
            return (userName.indexOf(filterText) != -1) && (userName.indexOf(filterText) == 0);
        }
    },

    getUserImg: function() {
        console.log("Get user img !!!!!!!!!");
        console.log(this.props.personPG);
        var originalAndJumpedPG =  _.compact([this.props.personPG, this.state.jumpedPointedGraph ])
        var imgUrlList = foafUtils.getImg(originalAndJumpedPG);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    },

    getBasicInfo: function() {
        var originalAndJumpedPG =  _.compact([this.props.personPG, this.state.jumpedPointedGraph ])
        var names = foafUtils.getNames(originalAndJumpedPG);
        var companyList = foafUtils.getworkplaceHomepages(originalAndJumpedPG);
        var noValue = "...";

        /*
        var personPgList = this.props.personPGs;
        console.log(personPgList);
        var names = foafUtils.getNames(personPgList);
        var companyList = foafUtils.getworkplaceHomepages(personPgList);
        var noValue = "...";
        console.log(names);
        console.log(companyList);
        var name = (names && names.name && names.name.length>0)? names.name[0]:noValue;
        var surname = (names && names.givenname && names.givenname.length>0)? names.givenname[0]:noValue;
        var company = (companyList && companyList.length>0)? companyList[0]:noValue;
        */

        return names = {
            name:(names && names.name && names.name.length>0)? names.name[0]:noValue,
            givenname:(names && names.givenname && names.givenname.length>0)? names.givenname[0]:noValue,
            lastname:(names && names.family_name && names.family_name.length>0)? names.family_name[0]:noValue,
            firstname:(names && names.lastname && names.firstname.length>0)? names.lastname[0]:noValue,
            company:(companyList && companyList.length>0)? companyList[0]:noValue
        }
    },

    getNotifications: function() {
        return notifications = {
            nbNewMessages:0,
            nbRecentInteraction:0,
            nbUpdates:0
        }
    },

    getMessage: function() {
        return message = {
            lastMessageDate:"",
            lastMessage:"No message"
        }
    }

});
