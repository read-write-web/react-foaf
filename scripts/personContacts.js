/** @jsx React.DOM */

var PersonContacts = React.createClass({
    getInitialState: function() {
        return {
            filterText:""
        }
    },

    handleUserInput: function(text) {
        console.log("handleUserInput");
        this.replaceState({
            filterText: text
        });
    },

    render: function () {
        var self = this;
        console.log("rendering friends " + this.state.filterText);
        var foafs = _.chain([this.props.personPG])
            .map(function (friendPg) {
                return friendPg.jumpRel(FOAF("knows"))
            }).flatten().map(function (foafPg) {
                return (<PersonContactOnProfile personPG={foafPg} handlerClick={self.props.changeUser} filterText={self.state.filterText}/>)
            }).value();
        console.log(foafs)
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