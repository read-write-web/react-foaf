/** @jsx React.DOM */

var Person = React.createClass({
    getInitialState: function() {
        return {
            modeEdit:false,
            editText:"Edit"}
    },

    render: function () {
        console.log('Render Person')
        console.log(this.props)
        console.log(this.state.modeEdit)

        // Set user name.
        var userName = foafUtils.getName(this.props.personPG);

        var currentPg = this.props.personPG;
        if (currentPg && currentPg.length > 0) {
            var firstPg = currentPg[0];
            return (
                <div id="profile" className="clearfix center">
                    <div className="edit-profile" onClick={this._handleClickEdit}>{this.state.editText}</div>
                    <Pix src={this._getUserImg()}/>
                    <PersonBasicInfo
                        modeEdit={this.state.modeEdit}
                        submitEdition={this._submitEdition}
                        basicInfo={this._getBasicInfo()}/>
                    <PersonNotifications notifications={this._getNotifications}/>
                    <PersonMessage userName={userName} lastMessage={this._getMessage()}/>
                    <PersonMoreInfo
                        modeEdit={this.state.modeEdit}
                        moreInfo={this._getMoreInfo()}
                        submitEdition={this._submitEdition}
                        address={this._getAddress()}/>
                    <PersonWebId getWebId={this.getWebId}/>
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

    _handleClickEdit: function(e) {
        console.log('Edit !!! ');
        this.setState({
            modeEdit:true,
            editText:"save"
        });
    },

    _submitEdition: function(data) {
        console.log("_submitEdition ");
        console.log(data);

        // Update relative PG.
        this.props.submitEdition(data);

        // Cancel Edit mode.
        this.setState({
            modeEdit:false,
            editText:"edit"
        });
    },

    _getUserImg: function() {
        var imgUrlList = foafUtils.getImg(this.props.personPG);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    },

    _getBasicInfo: function() {
        var noValue = "...";
        var nameList=foafUtils.getName(this.props.personPG);
        var givenNameList=foafUtils.getGivenName(this.props.personPG);
        var familyNameList=foafUtils.getFamilyName(this.props.personPG);
        var firstNameList=foafUtils.getFirstName(this.props.personPG);
        var workPlaceHomepageList = foafUtils.getworkplaceHomepages(this.props.personPG);

        return {
            name: nameList,
            givenname: givenNameList,
            lastname: familyNameList,
            firstname: firstNameList,
            workPlaceHomepage: workPlaceHomepageList
        }
    },

    _getAddress: function(){
        //var addressList = foafUtils.getContactHome(this.props.personPG);
        var streetList = foafUtils.getContactStreet(this.props.personPG);
        var postalCodeList = foafUtils.getContactPostalCode(this.props.personPG);
        var cityList = foafUtils.getContactCity(this.props.personPG);
        var countryList = foafUtils.getContactCountry(this.props.personPG);

        //var address = ( addressList &&  addressList.address && addressList.address.length>0)? addressList.address[0]:null;
        console.log(streetList)
        return {
            street: streetList,
            postalCode: postalCodeList,
            city: cityList,
            country: countryList
        }
    },

    _getNotifications: function() {
        return {
            nbNewMessages:0,
            nbRecentInteraction:0,
            nbUpdates:0
        }
    },

    _getMessage: function() {
        var noValue = "";
        return {
            lastMessageDate:noValue,
            lastMessage:"No message"
        }
    },

    _getMoreInfo: function() {
        var emailList = foafUtils.getEmails(this.props.personPG);
        var phoneList = foafUtils.getPhones(this.props.personPG);
        var homepageList = foafUtils.getHomepages(this.props.personPG);

        // Return.
        return {
            email:emailList,
            phone:phoneList,
            homepage:homepageList
        };
    },

    getWebId: function() {
        var value = this.props.personPG[0].pointer.value;
        return {
            webId:value
        };
    }

});