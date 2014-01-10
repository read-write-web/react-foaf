/** @jsx React.DOM */

var Person = React.createClass({

    render: function () {
        console.log("in Person render with pgs=");
        console.log(this.props.personPG);

        var UserName = foafUtils.getName(this.props.personPG);
        var currentPg = this.props.personPG;

        if (currentPg && currentPg.length > 0) {
            console.log("about to display content of pg for person");
            var firstPg = currentPg[0];
            return (
                <div id="profile" className="clearfix center">
                    <PersonPix personPG={firstPg} getUserImg={this.getUserImg}/>
                    <PersonBasicInfo personPG={firstPg} getBasicInfo={this.getBasicInfo}/>
                    <PersonNotifications personPG={firstPg} getNotifications={this.getNotifications}/>
                    <PersonMessage personPG={firstPg} userName={UserName} getMessage={this.getMessage}/>
                    <PersonMoreInfo personPG={firstPg} getMoreInfo={this.getMoreInfo} getAddress={this.getAddress}/>
                    <PersonWebId personPG={firstPg} getWebId={this.getWebId}/>
                    <PersonContacts personPG={firstPg} userName={UserName} changeUser={this.changeUser}/>
                </div>
                );
        }
        else {
            return (
                <div id="profile" className="clearfix center">
                    <span>Loading ...</span>
                </div>
                );
        }
    },

    changeUser: function(pg){
        console.log('Load other user &&&&&&&&&&');
        return this.props.changeUser(pg);
    },

    getUserImg: function() {
        var imgUrlList = foafUtils.getImg(this.props.personPG);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    },

    getBasicInfo: function() {
        var names = foafUtils.getNames(this.props.personPG);
        var companyList = foafUtils.getworkplaceHomepages(this.props.personPG);
        var noValue = "...";

        return names = {
            name:(names && names.name && names.name.length>0)? names.name[0]:noValue,
            givenname:(names && names.givenname && names.givenname.length>0)? names.givenname[0]:noValue,
            lastname:(names && names.family_name && names.family_name.length>0)? names.family_name[0]:noValue,
            firstname:(names && names.lastname && names.firstname.length>0)? names.lastname[0]:noValue,
            company:(companyList && companyList.length>0)? companyList[0]:noValue
        }
    },

    getAddress: function(){
        var addressList = foafUtils.getContactHome(this.props.personPG);
        var address = ( addressList &&  addressList.address && addressList.address.length>0)? addressList.address[0]:null;

        return addressRes = {
            street: (address)? address.street:"",
            postalCode: (address)? address.postalCode:"",
            city: (address)? address.city:"",
            country: (address)? address.country:""
        }
    },

    getNotifications: function() {
        return notifications = {
            nbNewMessages:0,
            nbRecentInteraction:0,
            nbUpdates:0
        }
    },

    getMessage: function() {
        return message = {
            lastMessageDate:"",
            lastMessage:"No message"
        }
    },

    getMoreInfo: function() {
        var emailList = foafUtils.getEmails(this.props.personPG);
        var phoneList = foafUtils.getPhones(this.props.personPG);
        var homepageList = foafUtils.getHomepages(this.props.personPG);
        var noValue = "...";

        // Set various states.
        return moreInfo = {
            email:(emailList && emailList.length>0)? emailList[0]:noValue,
            phone:(phoneList && phoneList.length>0)? phoneList[0]:noValue,
            homepage:(homepageList && homepageList.length>0)? homepageList[0]:noValue
        };
    },

    getWebId: function() {
        var value = this.props.personPG[0].pointer.value;
        return webId = {
            webId:value
        };
    }

});