/** @jsx React.DOM */

var Person = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
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

            // Set user name.
            var userName = foafUtils.getName([personPG]);

            return (
                <div id="profile" className="clearfix center">
                    <div className="edit-profile" onClick={this._handleClickEdit}>{this.state.editText}</div>
                    <Pix src={this._getUserImg()}/>
                    <PersonBasicInfo
                        personPG={personPG}
                        modeEdit={this.state.modeEdit}
                        submitEdition={this._submitEdition}/>
                    <PersonNotifications personPG={personPG}/>
                    <PersonMessage userName={userName} personPG={personPG}/>
                    <PersonMoreInfo
                        personPG={personPG}
                        modeEdit={this.state.modeEdit}
                        submitEdition={this._submitEdition}/>
                    <PersonWebId personPG={personPG}/>

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
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    }

});