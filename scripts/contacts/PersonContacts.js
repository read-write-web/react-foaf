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

        var foafs = _.chain(this.props.personPG.rel(FOAF("knows")))
            .map(function (contactPG) {
                var contactURL = contactPG.pointer.value;
                var onContactClick = function() {
                    self.props.onContactSelected(contactURL);
                }
                return (<PersonContactOnProfile
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

