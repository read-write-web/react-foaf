/** @jsx React.DOM */

var PersonBasicInfo = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging, RdfLinkedPgMixin],
    componentName: "PersonBasicInfo",

    getInitialState: function() {
        return {
            personPG: undefined
        }
    },

    render: function() {
        var personPG = this.props.personPG; // // TODO: Test presence of PG.

        // Get info.
        var info = this._getBasicInfo();
        this.log(info);

        // Define Html.
        var viewTree;
        if (!this.props.modeEdit) {
            viewTree =
            <div className="basic">
                <div className="name title-case">{info["foaf:name"]}</div>
                <div className="surname title-case">{info["foaf:givenname"]}</div>
                <div className="company">{info["foaf:workplaceHomepage"]}</div>
            </div>
        }
        else {
            viewTree =
            <div className="basic">
                <div className="name title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(personPG, 'foaf:name')} />
                    </form>
                </div>
                <div className="surname title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(personPG, 'foaf:givenname')} />
                    </form>
                </div>
                <div className="company">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(personPG, 'foaf:workplaceHomepage')} />
                    </form>
                </div>
            </div>
        }

        // Return.
        return viewTree;
    },

    /*
    *  Start our own functions here.
    * */
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    toPgArrayHack: function(pg) {
        return [pg];
    },

     _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition(this.props.personPG);
    },

    _getBasicInfo: function() {
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        var nameList=foafUtils.getName(personPG);
        var givenNameList=foafUtils.getGivenName(personPG);
        var familyNameList=foafUtils.getFamilyName(personPG);
        var firstNameList=foafUtils.getFirstName(personPG);
        var workplaceHomepageList = foafUtils.getworkplaceHomepage(personPG);

        return {
            "foaf:name": nameList[0],
            "foaf:givenname": givenNameList[0],
            "foaf:lastname": familyNameList[0],
            "foaf:firstname": firstNameList[0],
            "foaf:workplaceHomepage": workplaceHomepageList[0]
        }
    }
});