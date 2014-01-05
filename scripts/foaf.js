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
		return (<img src={this.props.url}/>)
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
			<div className="foaf">
			{ foafs }
			</div>
			);
	}

});

var MiniPerson = React.createClass({

	getInitialState: function () {
		return {
			jumped: undefined,
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
				component.setState({jumped: jumpedPG })
			},
			function (err) {
				console.log("MiniPerson. error in PG(_," + component.props.personPointedGraph.pointer + "," +
					component.props.personPointedGraph.webGraph + ",_).jumpAsync=" + err);
				component.setState({error: err})
			}
		)
	},

	render: function () {
		var pix = ( <img/> );

		console.log("in mini person");
		if (this.state && this.state.jumped) {
			var jumpedPersonPg = this.state.jumped;
			console.log(jumpedPersonPg);
			var pixSyms = _.chain(jumpedPersonPg.rels(FOAF("logo"), FOAF("img"), FOAF("depiction"))).map(
				function (imgPG) {
					var thumbs = _.chain(imgPG.rel(FOAF("thumbnail"))).map(function (thumbPG) {
						return (thumbPG.pointer.termType == "symbol") ? [thumbPG.pointer] :
							(imgPG.pointer.termType == "symbol") ? [imgPG.pointer] : []

					}).flatten().value()
					return (thumbs.length == 0)?[imgPG.pointer]:thumbs
				}
			).flatten().value();
			console.log("pixSyms:");
			console.log(pixSyms);

			if (pixSyms && pixSyms.length > 0) {
				pix = ( <img src={pixSyms[0].value}/> )
			}
		}

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
		console.log("displaying mini person");
		console.log(name);


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
			jumpedState = this.state.jumped;
			if (jumpedState) {
				if (!jumpedState.isLocalPointer()) {
					info = (<p>we don't have definitional info yet</p>)
				} else {
					info = (<p>definitional info</p>)
				}
			} else {
				info = (<p>no remote info yet</p>)
			}
		}
		console.log("built up info about mini agent:");
		console.log(info);

		return (
			<span class="miniagent">
				{info}
				<Name names={name}/>
			   {pix}
			</span>
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
			primaryTopicsPointedGraphs: []
		};
	},

	componentWillMount: function() {
		console.log("in FoafBx.getInitialState");
		var url = this.props.url;
		var fetcher = $rdf.fetcher(store, 10000, true);
		var future = fetcher.fetch(url, url, true);
		var component = this;
		future.then(
			function (pg) {
				console.log("received graph for url=" + url);
				console.log(pg);
				// you only have 1 primary topic in a graph
				//if you have more then they are owl:sameAs each other
				//I'd deal with yet
				var primaryTopics = pg.rel(FOAF("primaryTopic"));
				console.log("primary topics are:");
				console.log(primaryTopics);
				component.setState({
					primaryTopicsPointedGraphs: primaryTopics
				})
			},
			function (err) {
				console.log("returned from componentDidMount of " + url + " with error " + err);
				console.log(err)
			})
	},

	render: function () {
	   console.log("rendering FoafBx with primarytopics");
		console.log(this.state.primaryTopicsPointedGraphs);
		return (
			<div className="PersonalProfileDocument">
				<h2 className="document">{this.props.url}</h2>
				<h3>Primary Topic</h3>
				<Person pgs={this.state.primaryTopicsPointedGraphs}/>
				<h3>Friends</h3>
				<Friends primaryTopicsPointedGraphs={this.state.primaryTopicsPointedGraphs}/>
			</div>
			);
	}
});

$rdf.fetcher(store,1000,true).fetch(foafSpec,foafSpec,true).then(
	function (pg) {
		console.log("received foaf");
		console.log(pg);
		React.renderComponent(
			<FoafBx url="http://bblfish.net/people/henry/card"/>,
			document.getElementById('container')
		)
	},
	function (err) {
		console.log(err)
	}
);
