/** @jsx React.DOM */


//$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
$rdf.Fetcher.onlyUseProxy = true;

var foafSpec = "http://xmlns.com/foaf/spec/";
var store = new $rdf.IndexedFormula();

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }


var SimpleAttribute = React.createClass({
	render: function () {
		return (
			<tr>
				<td></td>
				<td></td>
			</tr>
			)
	}
});

var AttributeRel = React.createClass({
	render: function () {
		var values = _.map(this.props.pg.rel(this.props.rel),
			function (pg) {
				return (
					<tr>
						<td>{pg.pointer.value}</td>
					</tr>
					)
			});
		console.log("in render of AttributeRel for rel=" + this.props.rel + " and values=>");
		console.log(values);
		return (
			<tr>
				<td>{ foafAttributeName(this.props.rel) }</td>
				<td>
					<table>{values}</table>
				</td>
			</tr>
			)
	}
});

var foafSimpleRels = [ FOAF("name"), FOAF("nick"), FOAF("weblog") ];

function foafAttributeName(uri) {
	return _.map(new $rdf.PointedGraph(store, uri, $rdf.sym(foafSpec)).rel(RDFS("label")),
		function (valpg) {
			console.log("foafAttributeName(" + uri + ")=" + valpg.pointer.value);
			return valpg.pointer.value
		}
	)[0]; //foaf has labels for all its concepts. Todo: internationalisation
}

var IMG = React.createClass({
	render: function () {
		return (<img height="300px" width="300px"src={this.props.url}/>)
	}
});

var Friends = React.createClass({
	getInitialState: function () {
		return {
			foaf: []
		}
	},

	render: function () {
		console.log("rendering friends ");
		console.log(this.props);
		var foafs = _.chain(this.props.primaryTopicsPointedGraphs)
			.map(function (friendPg) {
				return friendPg.jumpRel(FOAF("knows"))
			}).flatten().map(function (foafPg) {
				return (<MiniPerson personPointedGraph={foafPg}/>)
			}).value();

		console.log("rendering theses friends");
		console.log(foafs);
		return (
			<div className="contacts clearfix">
				<ul className="clearfix">
			    { foafs }
			   </ul>
			</div>
			);
	}

});

/**
 *  not such a good idea to pass a list
 * @type {*}
 */
var MiniPersonPix = React.createClass({

	render: function() {
		console.log("in Mini Person Pix with ");

		var personPGs = this.props.personPGs;
		console.log(personPGs)

		var pixSyms = _.chain(personPGs).map(function (pg) {
			return pg.rels(FOAF("logo"), FOAF("img"), FOAF("depiction"))
		}).flatten().map(
			function (imgPG) {
				var thumbs = _.chain(imgPG.rel(FOAF("thumbnail"))).map(function (thumbPG) {
					return (thumbPG.pointer.termType == "symbol") ? [thumbPG.pointer] :
						(imgPG.pointer.termType == "symbol") ? [imgPG.pointer] : []

				}).flatten().value()
				return (thumbs.length == 0) ? [imgPG.pointer] : thumbs
			}
		).flatten().value();
		console.log("pixSyms:");
		console.log(pixSyms);

		var pix = (pixSyms && pixSyms.length > 0) ?
			(<img src={pixSyms[0].value} alt="Picture"/>):
			(<img src="img/avatar.png" alt="Picture"/>);

		return ( <div className="picture">
		        { pix }
		       </div>);
	}
});

var MiniPerson = React.createClass({

	getInitialState: function () {
		return {
			jumpedPointedGraph: undefined,
			error: undefined
		}
	},


	componentWillMount: function () {
		var component = this;
		console.log("in componentWillMount for MiniPerson( " + component.props.personPointedGraph.pointer + ")");
		this.props.personPointedGraph.jumpAsync(false).then(
			function (jumpedPG) {
				console.log("MiniPerson.  PG(_," + component.props.personPointedGraph.pointer + ","
					+ component.props.personPointedGraph.webGraph + ",_).jumpAsync=PG(_," + jumpedPG.pointer + "," + jumpedPG.webGraph + ",_)");
				component.replaceState({
					jumpedPointedGraph: jumpedPG,
				})
			},
			function (err) {
				console.log("MiniPerson. error in PG(_," + component.props.personPointedGraph.pointer + "," +
					component.props.personPointedGraph.webGraph + ",_).jumpAsync=" + err);
				component.setState({error: err})
			}
		)
	},

	render: function () {

		var personPg = this.props.personPointedGraph;
		var relLiteral = function (relSym) {
			return _.chain(personPg.rels(relSym)).map(
				function (litPG) {
					return (litPG.pointer.termType === "literal") ? [ litPG.pointer.value ] : []
				}).flatten().value();
		};

		var name = { name: relLiteral(FOAF("name")),
			givenName: relLiteral(FOAF("givenName")),
			lastName: relLiteral(FOAF("lastName")),
			firstName: relLiteral(FOAF("firstName"))
		};

		var nameInfo = _.chain(_.keys(name))
			.filter(function(key) { return !!name[key] })
			.map(function(key) {
				// note: className is the JSX equivalent for the html class= to avoid name clashes
				return ( <div className={key}>{name[key]}</div> )
			}).value()

		console.log("displaying mini person");
		console.log(nameInfo);

		var loadingStr=""
		var info = undefined;
		if (this.props.personPointedGraph.isLocalPointer()) {
			if (this.props.personPointedGraph.pointer.termType == "bnode") {
				info = (<p>not a webid</p>)
			} else if (this.props.personPointedGraph.pointer.termType == "literal") {
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
				info = (<p>no remote info yet</p>)
				loadingStr = "loading"
			}
		}
		console.log("built up info about mini agent:");
		console.log(info);

	   var clazz = "contact clearfix "+loadingStr+((this.state.error)?" error":"");
		console.log(clazz);
		var originalAndJumpedPG =  _.compact([this.props.personPointedGraph, this.state.jumpedPointedGraph ])
		console.log(originalAndJumpedPG)
		return (
			<li className={clazz}>
			  <MiniPersonPix personPGs={ originalAndJumpedPG } />
			  {nameInfo}
			</li>
			)
	}

});

var Name = React.createClass({
	render: function () {
		console.log("in render Name");
		return (
			<p>
			{this.props.names ? (this.props.names.name + "") : "nothing"}
			</p>
			)
	}
});

var PersonOld = React.createClass({

    render: function () {
        console.log("in Person render with pgs=");
        console.log(this.props.personPG);
        if (this.props.personPG && this.props.personPG.length > 0) {
            console.log("about to display content of pg for person");
            var pg = this.props.pgs[0];
//			var depictions = pg.rel(FOAF("depiction"))
            var atts = _.map(foafSimpleRels, function (rel) {
                return ( <AttributeRel rel={rel} pg={pg}/> )
            });
            console.log(atts);
            return (
                <span>
                    <table>
					{ atts }
                    </table>
                </span>
                );
        } else {
            return (<span>nothing</span>);
        }
    }
});

var PersonPix = React.createClass({
    getInitialState: function() {
        return {
            imgUrl: "img/avatar.png"
        };
    },

    // Executed immediately before render.
    componentWillMount: function() {
        var personPg = this.props.personPG;
        var imgUrlList = foafUtils.getImg([personPg]);
        if (imgUrlList && imgUrlList.length>0) {this.setState({ imgUrl: imgUrlList[0]});}
    },

    render: function() {
        console.log("Render Person Pix")
        return (
            <div className="picture float-right">
                <img src={this.state.imgUrl} alt="Picture"/>
            </div>
        );
    }
});

var PersonBasicInfo = React.createClass({
    // .
    getInitialState: function() {
        return {
            name:"Empty",
            givenname:"Empty",
            lastName:"Empty",
            firstName:"Empty",
            company:"Empty"
        }
    },

    // Executed immediately before render.
    componentWillMount: function() {
        var personPg = this.props.personPG;
        var names = foafUtils.getNames([personPg]);
        var companyList = foafUtils.getworkplaceHomepages([personPg]);
        var noValue = "...";

        // Set various states.
        this.setState({
            name:(names && names.name && names.name.length>0)? names.name[0]:noValue,
            givenname:(names && names.givenname && names.givenname.length>0)? names.givenname[0]:noValue,
            lastname:(names && names.family_name && names.family_name.length>0)? names.family_name[0]:noValue,
            firstname:(names && names.lastname && names.firstname.length>0)? names.lastname[0]:noValue,
            company:(companyList && companyList.length>0)? companyList[0]:noValue
        });
    },

    // Render.
    render: function() {
        console.log("Render the person Info");
        return (
            <div className="basic">
                <div className="name title-case">{this.state.name}</div>
                <div className="surname title-case">{this.state.givenname}</div>
                <div className="company">{this.state.company}</div>
            </div>
            );
    }

    // Executed immediately after render.
    //componentDidMount: function() {}
});

var PersonNotifications = React.createClass({
    getInitialState: function() {
        return {
        nbnewMessages:0,
        nbRecentInteraction:0,
        nbUpdates:0
        }
    },

    render: function() {
        return (
            <div className="notifications">
                <div className="newMessages float-left">{this.state.nbnewMessages}</div>
                <div className="recentInteractions float-left">{this.state.nbRecentInteraction}</div>
                <div className="updates float-left">{this.state.nbUpdates}</div>
            </div>
        );
    }
});

var PersonMessage = React.createClass({
    getInitialState: function() {
        return {
            lastMessageDate:"",
            lastMessage:"No message"
        }
    },

    render: function() {
        return (
            <div className="moreInfo">
                <div className="lastInteraction">Last message from Edward: <span>{this.state.lastMessageDate}</span></div>
                <div className="message">{this.state.lastMessage}</div>
                <div className="nextStep"><a href="#">Write back</a></div>
            </div>
        );
    }
});

var PersonAddress = React.createClass({
    getInitialState: function() {
        return {
            street:"",
            postalCode:"",
            city:"",
            country:""
        }
    },

    parseAddress: function(addressList) {
        var address = ( addressList &&  addressList.address && addressList.address.length>0)? addressList.address[0]:"Empty";
        return address.street + "\n" +address.postalCode + " "+ address.city + "\n" + address.country;
    },

    componentWillMount: function() {
        var personPg = this.props.personPG;
        var addressList = foafUtils.getContactHome([personPg]);
        var address = ( addressList &&  addressList.address && addressList.address.length>0)? addressList.address[0]:null;
        if (!address) return;

        this.setState({
            street:address.street,
            postalCode:address.postalCode,
            city:address.city,
            country:address.country
        })
    },

    render: function() {
        return (
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                {this.state.street}<br/>
                {this.state.postalCode}
                {this.state.city}<br/>
                {this.state.country}<br/>
                </div>
            </div>
        );
    }
});

var PersonMoreInfo = React.createClass({
    getInitialState: function() {
        return {
            email:"...",
            phone:"...",
            homepage:"..."
        }
    },

    componentWillMount: function() {
        var personPg = this.props.personPG;
        var emailList = foafUtils.getEmails([personPg]);
        var phoneList = foafUtils.getPhones([personPg]);
        var homepageList = foafUtils.getHomepages([personPg]);
        var noValue = "...";

        // Set various states.
        this.setState({
            email:(emailList && emailList.length>0)? emailList[0]:noValue,
            phone:(phoneList && phoneList.length>0)? phoneList[0]:noValue,
            homepage:(homepageList && homepageList.length>0)? homepageList[0]:noValue
        });
    },

    render: function() {
        var personPg = this.props.personPG;
        return (
            <div id="details">
                <div className="title center-text title-case">DETAILS</div>

                <ul className="clearfix span3">
                    <li className="float-left">
                        <div className="email">
                            <div className="title-case">Email</div>
                            <div className="content email-content">{this.state.email}</div>
                        </div>
                        <div className="phone">
                            <div className="title-case">Phone</div>
                            <div className="content email-content">{this.state.phone}</div>
                        </div>
                    </li>
                    <li className="float-left">
                        <PersonAddress personPG={personPg}/>
                    </li>
                    <li className="float-left">
                                <div className="website">
                                    <div className="title-case">Website</div>
                                    <div className="content website-content">
                                        <a href="https://stample.co" target="_blank">{this.state.homepage}</a>
                                    </div>
                                </div>
                    </li>
                </ul>
            </div>
        );
    }
});

var PersonWebId = React.createClass({
    getInitialState: function() {
        return {
            webId:""
        }
    },

    componentWillMount: function() {
        var personPg = this.props.personPG;
        var webId = personPg.pointer.value;
        this.setState({webId:webId});
    },

    render: function() {
        return (
            <div id="webid" className="clearfix">
                <a href="https://edwardsilhol.com/me#card"><img src="img/webid.png" alt="Web ID logo" className="float-left"/></a>
                <div id="webid-address" class="float-left"><span className="title-case">Web ID </span> {this.state.webId}</div>
            </div>
        );
    }
});

var PersonContactOnProfileBasicInfo = React.createClass({

    render: function() {
        console.log('Render Basic info !!!!!!!!!!!!!');

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

        return (
            <div className="basic">
                <div className="name title-case">{name}</div>
                <div className="surname title-case">{surname}</div>
                <div className="company">{company}</div>
            </div>

            );
    }
});

var PersonContactOnProfileNotifications = React.createClass({
    getInitialState: function() {
        return {
            nbNewMessages:"0",
            nbRecentNotifications:"0",
            nbUpdates:"0"
        }
    },

    render: function() {
        return (
            <div className="notifications">
                <div className="newMessages float-left">{this.state.nbNewMessages}</div>
                <div className="recentInteractions float-left">{this.state.nbRecentNotifications}</div>
                <div className="updates float-left">{this.state.nbUpdates}</div>
            </div>
            );
    }
});

var PersonContactOnProfileMoreInfo = React.createClass({
    getInitialState: function() {
        return {
            lastMessage:"..."
        }
    },

    render: function() {
        return (
            <div className="moreInfo">
                <div className="lastInteraction"><span>{this.state.lastMessage}</span></div>
                <div className="nextStep"><a href="#">Start the conversation</a></div>
            </div>
            );
    }
});

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

    handleClick: function() {
        console.log("Clickkkkkkk")
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
            <li className={clazz} onClick={this.handleClick}>
                <div className="loader"></div>
                <div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>
                <PersonContactOnProfileBasicInfo personPGs={originalAndJumpedPG}/>
                <PersonContactOnProfileNotifications personPGs={originalAndJumpedPG}/>
                <PersonContactOnProfileMoreInfo personPGs={originalAndJumpedPG}/>
            </li>

            );
    }
});

var PersonContacts = React.createClass({
    getInitialState: function () {
        return {
            //foaf: []
        }
    },

    render: function () {
        console.log("rendering friends ");
        console.log(this.props.personPG);
        var foafs = _.chain([this.props.personPG])
            .map(function (friendPg) {
                return friendPg.jumpRel(FOAF("knows"))
            }).flatten().map(function (foafPg) {
                return (<PersonContactOnProfile personPG={foafPg}/>)
            }).value();

        console.log("rendering theses friends");
        console.log(foafs);
        return (
            <div id="contacts">
                <div className="title center-text title-case">Edward's contacts</div>
                <ul className="clearfix span3">
                    { foafs }
                </ul>
            </div>
            );
    }
});

var Person = React.createClass({

    render: function () {
        console.log("in Person render with pgs=");
        console.log(this.props.personPG);
        if (this.props.personPG && this.props.personPG.length > 0) {
            console.log("about to display content of pg for person");
            var pg = this.props.personPG[0];
            return (
                <div id="profile" className="clearfix center">
                    <PersonPix personPG={pg}/>
                    <PersonBasicInfo personPG={pg}/>
                    <PersonNotifications personPG={pg}/>
                    <PersonMessage personPG={pg}/>
                    <PersonMoreInfo personPG={pg}/>
                    <PersonWebId personPG={pg}/>
                    <PersonContacts personPG={pg}/>
                </div>
            );
        }
        else {
            return (
                <div id="profile" className="clearfix center">
                    <span>Loading ...</span>
                </div>
            );
        }
    }
});

var FoafBx = React.createClass({

	getInitialState: function() {
		return {
			url : "http://bblfish.net/people/henry/card",
            //url : "https://my-profile.eu/people/tim/card",
            //url:"https://my-profile.eu/people/deiu/card",
            //url:"https://my-profile.eu/people/mtita/card",// Not working
            //url:"http://presbrey.mit.edu/foaf",
			primaryTopicsPointedGraphs: []
		};
	},

   componentWillMount: function() {
		console.log("in FoafBx.componentWillMount");
        url = this.state.url;
	    console.log("this.props.url="+url);
		this.fetchURL(url);
	},

	fetchURL: function(url) {
        console.log("in FoafBx.fetchURL");
		console.log("FoafBx.handleUserIntput("+url+")");
		if (!url) return
        var component = this;
        var fetcher = $rdf.fetcher(store, 10000, true);
		var future = fetcher.fetch(url, url);
		component.setState({url: url})
		future.then(
			function (pg) {
				console.log("received graph for url=" + url);
				var pt = pg.rel(FOAF("primaryTopic"))
				component.replaceState({
					primaryTopicsPointedGraphs: pt,
                    url: url
				})
				//need loading function to display advances in download
			},
			function (err) {
				console.log("returned from componentDidMount of " + url + " with error " + err);
				console.log(err)  //need error handling
			})

	},

   render: function () {
       console.log("rendering FoafBx with primarytopics");
       console.log(this.state.primaryTopicsPointedGraphs);

       //removed
       //				<Person pgs={this.state.primaryTopicsPointedGraphs}/>
       return (
           <div className="PersonalProfileDocument">
               <SearchBox url={this.state.url} onUserInput={this.fetchURL}/>
               <div id="actionNeeded">Action needed</div>
               <Person personPG={this.state.primaryTopicsPointedGraphs}/>
           </div>
           );
   }
});

//<!--Friends primaryTopicsPointedGraphs={this.state.primaryTopicsPointedGraphs}/-->


var SearchBox = React.createClass({
	getInitialState: function() {
		return {text: this.props.url};
	},
	handleSubmit: function(e) {
		this.props.onUserInput(
			this.state.text //this.refs.url.getDOMNode().value
		);
		return false; //don't send result to web server
	},
	onChange: function(e) {
		this.setState({text: e.target.value});
	},
	render: function() {
		return ( <form id="search" onSubmit={this.handleSubmit}>
			<div id="add">+</div>
			<input type="text"
			       placeholder="Enter URL of foaf profile..."
			       value={this.state.url}
			       width="100"
			       ref="url"
			       onChange={this.onChange}
			/>
			<button type="submit" class="fontawesome-ok"></button>
		</form> );


	}
});


// Application boots here.
React.renderComponent(
	<FoafBx/>,
	document.getElementById('container')
)



