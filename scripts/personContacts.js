/** @jsx React.DOM */

var PersonContacts = React.createClass({
    getInitialState: function () {
        return {
            //foaf: []
        }
    },

    render: function () {
        var self = this;
        console.log("rendering friends ");
        var foafs = _.chain([this.props.personPG])
            .map(function (friendPg) {
                return friendPg.jumpRel(FOAF("knows"))
            }).flatten().map(function (foafPg) {
                return (<PersonContactOnProfile personPG={foafPg} handlerClick={self.props.showContact}/>)
            }).value();

        return (
            <div id="contacts">
                <div className="title center-text title-case">{this.props.userName}'s contacts</div>
                <ul className="clearfix span3">
                    { foafs }
                </ul>
            </div>
            );
    }
});