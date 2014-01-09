/** @jsx React.DOM */

var PersonContactOnProfileBasicInfo = React.createClass({

    render: function() {
        console.log('Render Basic info !!!!!!!!!!!!!');

        var personPgList = this.props.personPGs;
        console.log(personPgList);
        var names = foafUtils.getNames(personPgList);
        var companyList = foafUtils.getworkplaceHomepages(personPgList);
        var noValue = "...";
        console.log(names);
        console.log(companyList);
        var name = (names && names.name && names.name.length>0)? names.name[0]:noValue;
        var surname = (names && names.givenname && names.givenname.length>0)? names.givenname[0]:noValue;
        var company = (companyList && companyList.length>0)? companyList[0]:noValue;

        return (
            <div className="basic">
                <div className="name title-case">{name}</div>
                <div className="surname title-case">{surname}</div>
                <div className="company">{company}</div>
            </div>

            );
    }
});