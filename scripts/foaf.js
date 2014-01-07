/** @jsx React.DOM */


$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
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


var Person = React.createClass({

	render: function () {
		console.log("in Person render with pgs=");
		console.log(this.props.pgs);
		if (this.props.pgs && this.props.pgs.length > 0) {
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


var FoafBx = React.createClass({

	getInitialState: function() {
		return {
			url : "",
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
		console.log("FoafBx.handleUserIntput("+url+")");
		if (!url) return
		var fetcher = $rdf.fetcher(store, 10000, true);
		var future = fetcher.fetch(url, url);
		var component = this;
		component.setState({url: url})
		future.then(
			function (pg) {
				console.log("received graph for url=" + url);
				var pt = pg.rel(FOAF("primaryTopic"))
				component.replaceState({
					primaryTopicsPointedGraphs: pt
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
				<Friends primaryTopicsPointedGraphs={this.state.primaryTopicsPointedGraphs}/>
			</div>
			);
	}
});

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

//		return (
//			<form onSubmit={this.handleSubmit}>
//				<input
//				type="text"
//				placeholder="Enter URL of foaf profile..."
//				value={this.state.url}
//				width="100"
//				ref="url"
//			   onChange={this.onChange}
//				/>
//				<button>submit</button>
//		   </form>
//			)
	}
});



//$rdf.fetcher(store,1000,true).fetch(foafSpec).then(
//	function (pg) {
//		console.log("received foaf");
//		console.log(pg);
//	},
//	function (err) {
//		console.log(err)
//	}
//);

React.renderComponent(
	<FoafBx/>,
	document.getElementById('container')
)



