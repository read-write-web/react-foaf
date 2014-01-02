/** @jsx React.DOM */


function FOAF(name) {return $rdf.sym("http://xmlns.com/foaf/0.1/"+name)}

var Person = React.createClass({
	render: function () {
		if (this.props.pg && this.props.pg.length > 0) {
			var pg = this.props.pg[0]
			var name = pg.rel(FOAF("name"))
			var depictions = pg.rels(FOAF("depiction"), FOAF("img"))
			return (
				<span>
					<p>{name[0].pointer.value}</p>
					<img src={depictions[0].pointer.value}/>
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
		var store = new $rdf.IndexedFormula()
		var fetcher =  $rdf.fetcher(store,10000,true)
		var future = fetcher.fetch(url,url,false)
		var self = this
		future.then(
			function (pg) {
				var pt = pg.rel(FOAF("primaryTopic"))
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


React.renderComponent(
	<FoafBx url="http://bblfish.net/people/henry/card"/>,
	document.getElementById('container')
);
