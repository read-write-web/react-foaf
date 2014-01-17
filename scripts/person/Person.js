/** @jsx React.DOM */

var Person = React.createClass({
    getInitialState: function() {
        return {
            modeEdit:false,
            editText:"Edit"}
    },

    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    toPgArrayHack: function(pg) {
        return [pg];
    },

    render: function () {
        console.log('Render Person')
        console.log(this.props)
        console.log(this.state.modeEdit)



        if ( this.props.personPG ) {
            var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
            // Set user name.
            var userName = foafUtils.getName(personPG);

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
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        var imgUrlList = foafUtils.getImg(personPG);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    },

    _getBasicInfo: function() {
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        var nameList=foafUtils.getName(personPG);
        var givenNameList=foafUtils.getGivenName(personPG);
        var familyNameList=foafUtils.getFamilyName(personPG);
        var firstNameList=foafUtils.getFirstName(personPG);
        var workPlaceHomepageList = foafUtils.getworkplaceHomepages(personPG);

        return {
            name: nameList,
            givenname: givenNameList,
            lastname: familyNameList,
            firstname: firstNameList,
            workPlaceHomepage: workPlaceHomepageList
        }
    },

    _getAddress: function(){
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        //var addressList = foafUtils.getContactHome(personPG);
        var streetList = foafUtils.getContactStreet(personPG);
        var postalCodeList = foafUtils.getContactPostalCode(personPG);
        var cityList = foafUtils.getContactCity(personPG);
        var countryList = foafUtils.getContactCountry(personPG);

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
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        var emailList = foafUtils.getEmails(personPG);
        var phoneList = foafUtils.getPhones(personPG);
        var homepageList = foafUtils.getHomepages(personPG);

        // Return.
        return {
            email:emailList,
            phone:phoneList,
            homepage:homepageList
        };
    },

    getWebId: function() {
        var value = this.props.personPG.pointer.value;
        return {
            webId:value
        };
    }

});