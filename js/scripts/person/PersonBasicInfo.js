/** @jsx React.DOM */


define(['react', 'mixins'], function (React, mixins) {

var PersonBasicInfo = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging, mixins.RdfLinkedPgMixin],
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
                <div className="name title-case" title={info["foaf:name"]}>{info["foaf:name"]}</div>
                <div className="surname title-case" title={info["foaf:givenname"]}>{info["foaf:givenname"]}</div>
                <div className="company" title={info["foaf:workplaceHomepage"]}>{info["foaf:workplaceHomepage"]}</div>
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
     _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition(this.props.personPG);
    },

    _getBasicInfo: function() {
        var noValue="...";
        var personPG = this.props.personPG;
        var nameList=foafUtils.getName([personPG]);
        var nickList=foafUtils.getNick([personPG]);
        var givenNameList=foafUtils.getGivenName([personPG]);
        var familyNameList=foafUtils.getFamilyName([personPG]);
        var firstNameList=foafUtils.getFirstName([personPG]);
        var workplaceHomepageList = foafUtils.getworkplaceHomepage([personPG]);

        var name = (nameList && nameList.length>0)? nameList[0]:noValue;
        var nick = (nickList && nickList.length>0)? nickList[0]:noValue;
        var givenName = (givenNameList && givenNameList.length>0)? givenNameList[0]:noValue;
        var familyName = (familyNameList && familyNameList.length>0)? familyNameList[0]:noValue;
        var firstName = (firstNameList && firstNameList.length>0)? firstNameList[0]:noValue;
        var workPlace = (workplaceHomepageList && workplaceHomepageList.length>0)? workplaceHomepageList[0]:noValue;

        return {
            "foaf:name": name,
            "foaf:nick": nick,
            "foaf:givenname": givenName,
            "foaf:lastname": familyName,
            "foaf:firstname": firstName,
            "foaf:workplaceHomepage": workPlace
        }
    }
});

    return PersonBasicInfo;
});