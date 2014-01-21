/** @jsx React.DOM */

var PersonContacts = React.createClass({
    getInitialState: function() {
        return {
            filterText:""
        }
    },

    handleUserInput: function(text) {
        this.replaceState({
            filterText: text
        });
    },

    render: function () {
        var self = this;
        console.log('Render PersonContacts')
        console.log(this.props);


        if (!this.props.personPG) return (
            <div id="contacts" className="clearfix">
                <ul className="clearfix span3">
                </ul>
            </div>
            );

        var foafs = _.chain(this.props.personPG.rel(FOAF("knows")))
            .map(function (foafPg) {
                return (<PersonContactOnProfile
                            personPG={foafPg}
                            filterText={self.state.filterText}/>)
            }).value();

        return (
            <div id="contacts" className="clearfix">
                <ul className="clearfix span3">
                    { foafs }
                </ul>
            </div>
            );
    }
});

