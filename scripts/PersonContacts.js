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
        var foafs = _.chain(this.props.personPG.rel(FOAF("knows"))).map(function (foafPg) {
            console.log("Foaf knows !!!!!!!!")
            console.log(foafPg)
                return (<PersonContactOnProfile personPG={foafPg} changeUser={self.props.changeUser} filterText={self.state.filterText}/>)
            }).value();
        return (
            <div id="contacts">
                <div className="title center-text title-case">{this.props.userName}'s contacts</div>
                <SearchBox filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                <ul className="clearfix span3">
                    { foafs }
                </ul>
            </div>
            );
    }
});


//<PersonContacts personPG={firstCurrentPg} userName={UserName} changeUser={this.changeUser}/>