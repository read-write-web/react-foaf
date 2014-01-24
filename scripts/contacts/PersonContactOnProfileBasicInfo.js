/** @jsx React.DOM */

var PersonContactOnProfileBasicInfo = React.createClass({

    render: function() {
        // Get info.
        var names = this._getBasicInfo();

        return (
            <div className="basic">
                <div className="name title-case">{names.name}</div>
                <div className="surname title-case">{names.givenname}</div>
                <div className="company">{names.company}</div>
            </div>
            );
    },

    _getBasicInfo: function() {
        var noValue = "...";
        var nameList=foafUtils.getName(this.props.personPGs);
        var givenNameList=foafUtils.getGivenName(this.props.personPGs);
        var familyNameList=foafUtils.getFamilyName(this.props.personPGs);
        var firstNameList=foafUtils.getFirstName(this.props.personPGs);
        var workPlaceList = foafUtils.getworkplaceHomepage(this.props.personPGs);

        var name = (nameList && nameList.length>0)? nameList[0]:noValue;
        var givenName = (givenNameList && givenNameList.length>0)? givenNameList[0]:noValue;
        var familyName = (familyNameList && familyNameList.length>0)? familyNameList[0]:noValue;
        var firstName = (firstNameList && firstNameList.length>0)? firstNameList[0]:noValue;
        var workPlace = (workPlaceList && workPlaceList.length>0)? workPlaceList[0]:noValue;

        return names = {
            name: name,
            givenname: givenName,
            lastname:familyName,
            firstname:firstName,
            company:workPlace
        }
    }

});