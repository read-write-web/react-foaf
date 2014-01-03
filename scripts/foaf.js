/** @jsx React.DOM */


var foafSpec = "http://xmlns.com/foaf/spec/"
var store = new $rdf.IndexedFormula()

function FOAF(name) { return $rdf.sym("http://xmlns.com/foaf/0.1/"+name) }
function RDFS(name) { return $rdf.sym("http://www.w3.org/2000/01/rdf-schema#"+name) }




var SimpleAttribute = React.createClass({
	render: function ()  {
	  return (
		  <tr>
			  <td></td>
			  <td></td>
			</tr>
		  )
	}
})

var AttributeRel = React.createClass({
	render: function() {
		var values = _.map(this.props.pg.rel(this.props.rel),
			function (pg) {
				return (
					<tr>
						<td>{pg.pointer.value}</td>
					</tr>
					)
			})
		console.log("in render of AttributeRel for rel="+this.props.rel +" and values=>")
		console.log(values)
		return (
			<tr>
				<td>{ foafAttributeName(this.props.rel) }</td>
				<td>
					<table>{values}</table>
				</td>
			</tr>
			)
	}
})

var foafSimpleRels = [ FOAF("name"), FOAF("nick"), FOAF("weblog") ]

function foafAttributeName(uri) {
	return _.map(new $rdf.PointedGraph(store, uri,$rdf.sym(foafSpec)).rel(RDFS("label")),
			function(valpg) {
				console.log("foafAttributeName("+uri+")="+valpg.pointer.value)
				return valpg.pointer.value
			}
	)[0] //foaf has labels for all its concepts. Todo: internationalisation
}

var IMG = React.createClass({
	render: function() {
		return (<img src={this.props.url}/>)
	}
})

var Person = React.createClass({
	render: function () {
		console.log("in Person render with pg=")
		console.log(this.props.pg)
		if (this.props.pg && this.props.pg.length > 0) {
			console.log("about to display content of pg for person")
			var pg = this.props.pg[0]
			var depictions = pg.rels(FOAF("depiction"), FOAF("img"))
			var atts = _.map( foafSimpleRels, function(rel) {
				 return ( <AttributeRel rel={rel} pg={pg}/> )
			})
			console.log(atts)
			return (
				<span>
					<IMG url={depictions[0].pointer.value}/>
					<table>
					{ atts }
					</table>
				</span>
				);
		} else {
			return (<span>nothing</span>);
		}
	}
})

var FoafBx = React.createClass({

	getInitialState: function() {
		return {
			primaryTopicPg: []
		};
	},

	componentDidMount: function() {
		var url = this.props.url
		console.log("in componentDidMount with url="+url)
		var fetcher =  $rdf.fetcher(store,10000,true)
		var future = fetcher.fetch(url,url,false)
		var self = this
		future.then(
			function (pg) {
				console.log("received graph for url="+url+" primary topics are:")
				var pt = pg.rel(FOAF("primaryTopic"))
				console.log(pt)
				self.setState({
					primaryTopicPg: pt
				})
			},
			function (err) {
				console.log("returned from componentDidMount of " + url + " with error " + err)
				console.log(err)
			})
	},

	render: function () {
		return (
			<div className="foaf">
				<h2 className="document">{this.props.url}</h2>
				<Person pg={this.state.primaryTopicPg}/>
			</div>
			);
	}
});

$rdf.fetcher(store,1000,true).fetch(foafSpec,foafSpec,false).then(
	function (pg) {
		console.log("received foaf")
		console.log(pg)
		React.renderComponent(
			<FoafBx url="http://bblfish.net/people/henry/card"/>,
			document.getElementById('container')
		)
	},
	function (err) {
		console.log(err)
	}
);
