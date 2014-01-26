/** @jsx React.DOM */

var PersonBasicInfo = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging, RdfLinkedPgMixin],
    componentName: "PersonBasicInfo",

    getInitialState: function() {
        return {
            personPGCopy: this.props.personPG
        }
    },

    render: function() {
        var personPG = this.state.personPGCopy; // TODO remove when possible

        // TODO: Test presence of PG.

        // Get info.
        var info = this._getBasicInfo();
        this.log(info);

        // Define Html.
        var viewTree =
            <div className="basic">
                <div className="name title-case">{info["foaf:name"]}</div>
                <div className="surname title-case">{info["foaf:givenname"]}</div>
                <div className="company">{info["foaf:workplaceHomepage"]}</div>
            </div>

        var viewTreeEdit =
            <div className="basic">
                <div className="name title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'foaf:name')} />
                    </form>
                </div>
                <div className="surname title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'foaf:givenname')} />
                    </form>
                </div>
                <div className="company">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'foaf:workplaceHomepage')} />
                    </form>
                </div>
            </div>

        // Return depending on the mode.
        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    /*
    *  Start our own functions here.
    * */

    _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition();
    },

    _getBasicInfo: function() {
        var personPG = this.props.personPG;
        var nameList=foafUtils.getName(this.state.personPGCopy);
        var givenNameList=foafUtils.getGivenName(this.state.personPGCopy);
        var familyNameList=foafUtils.getFamilyName(this.state.personPGCopy);
        var firstNameList=foafUtils.getFirstName(this.state.personPGCopy);
        var workplaceHomepageList = foafUtils.getworkplaceHomepage(this.state.personPGCopy);

        return {
            "foaf:name": nameList[0],
            "foaf:givenname": givenNameList[0],
            "foaf:lastname": familyNameList[0],
            "foaf:firstname": firstNameList[0],
            "foaf:workplaceHomepage": workplaceHomepageList[0]
        }
    }
});