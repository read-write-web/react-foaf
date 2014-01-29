/** @jsx React.DOM */

var PersonContacts = React.createClass({
    mixins: [WithLogger,WithLifecycleLoggingLite],
    componentName: "PersonContacts",

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

        if (!this.props.personPG) return (
            <div id="contacts" className="clearfix">
                <ul className="clearfix span3">
                </ul>
            </div>
            );
        console.log(this.props.personPG)
        var foafs = _.chain(this.props.personPG.rel(FOAF("knows")))
            .map(function (contactPG) {
                var onContactClick = function() {
                    var contactURL = contactPG.getPointerUrl();
                    if ( contactURL ) {
                        self.props.onContactSelected(contactURL)
                    } else {
                        // TODO maybe we can click on a bnode???
                        alert("Can only click on a Symbol pointer, not Bnode/Literal")
                    }
                }
                console.log("*********************")
                console.log("*********************")
                console.log("*********************")
                console.log(contactPG)
                return (<PersonContactOnProfileJumpWrapper

                            onPersonContactClick={onContactClick}
                            personPG={contactPG}
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

