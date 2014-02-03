/** @jsx React.DOM */

define(['react', 'mixins',
    'jsx!Pix',
    'jsx!PersonBasicInfo',
    'jsx!PersonNotifications',
    'jsx!PersonMessage',
    'jsx!PersonMoreInfo',
    'jsx!PersonWebId',
    'jsx!PersonContacts'],
    function (React, mixins,
              Pix,
              PersonBasicInfo,
              PersonNotifications,
              PersonMessage,
              PersonMoreInfo,
              PersonWebId,
              PersonContacts) {

    var Person = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
    componentName: "Person",

    getInitialState: function() {
        return {
            modeEdit:false,
            editText:"Edit",
            personPGCopy: undefined
        }
    },

    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    // TODO fixme HACK !!!
    toPgArrayHack: function(pg) {
        return [pg];
    },

    render: function () {
        if (!this._isInitialized()) {
            return (
                <div id="profile" className="clearfix center">
                    <span>Loading...</span>
                </div>
                );
        }
        else {
            this.debug("Rendering person");
            var personPG;
            if (!this.state.modeEdit) {
                personPG = this.props.personPG;
            }
            else {
                personPG = this.props.personPG.deepCopyOfGraph()
            }

            return (
                <div id="profile" className="clearfix center">
                    <div className="edit-profile" onClick={this._handleClickEdit}>{this.state.editText}</div>
                    <Pix src={this._getUserImg()}/>
                    <PersonBasicInfo
                        personPG={personPG}
                        modeEdit={this.state.modeEdit}
                        submitEdition={this._submitEdition}/>
                    <PersonNotifications personPG={personPG}/>
                    <PersonMessage personPG={personPG}/>
                    <PersonMoreInfo
                        personPG={personPG}
                        modeEdit={this.state.modeEdit}
                        submitEdition={this._submitEdition}/>
                    <PersonWebId personPG={personPG}/>
                    <PersonContacts personPG={personPG} onContactSelected={this.props.onContactSelected}/>
                </div>
                );
        }
    },

    _isInitialized: function() {
        return this.props.personPG
    },

    _handleClickEdit: function(e) {
        this.log('_handleClickEdit');

        if (this.state.modeEdit) {
            this._submitEdition();
        }
        else {
            this.setState({
                modeEdit:true,
                editText:"save"
            });
        }
    },

    _submitEdition: function(personPG) {
        this.log('***************************************************');
        this.log('***************************************************');
        this.log('***************************************************');
        this.log('_submitEdition');
        console.log(personPG);
        // Submit changes.
        this.props.submitEdition(personPG);

        // Cancel Edit mode.
        this.setState({
            modeEdit:false,
            editText:"edit"
        });

        // And return false.
        return false;
    },

    _getUserImg: function() {
        var personPG = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
        var imgUrlList = foafUtils.getImg(personPG);
        if (!imgUrlList || imgUrlList.length == 0) return avatar;
        var imgUrlListCheck = _.chain(imgUrlList)
            .filter(function(img) {
                // TODO: temporary, need to check the validity of img Url.
                return img.indexOf("http") !== -1
            })
            .value();
        return imgUrlListCheck[0];
    }

});

    return Person
});