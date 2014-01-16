/** @jsx React.DOM */

var PersonContactOnProfileBasicInfo = React.createClass({

    render: function() {


        // Get info.
        var names = this.getBasicInfo();

        return (
            <div className="basic">
                <div className="name title-case">{names.name}</div>
                <div className="surname title-case">{names.givenname}</div>
                <div className="company">{names.company}</div>
            </div>
            );
    },

	getBasicInfo: function () {
		var names = foafUtils.getNames(this.props.personPGs);
		var companyList = foafUtils.getworkplaceHomepages(this.props.personPGs);
		var noValue = "...";

		return names = {
			name: (names && names.name && names.name.length > 0) ? names.name[0] : noValue,
			givenname: (names && names.givenname && names.givenname.length > 0) ? names.givenname[0] : noValue,
			lastname: (names && names.family_name && names.family_name.length > 0) ? names.family_name[0] : noValue,
			firstname: (names && names.lastname && names.firstname.length > 0) ? names.lastname[0] : noValue,
			company: (companyList && companyList.length > 0) ? companyList[0] : noValue
		};
	}

});