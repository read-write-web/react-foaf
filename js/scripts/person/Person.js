/** @jsx React.DOM */

define(['react', 'mixins',
    'jsx!Pix',
    'jsx!PersonBasicInfo',
    'jsx!PersonNotifications',
    'jsx!PersonMessage',
    'jsx!PersonMoreInfo',
    'jsx!PersonWebId',
    'jsx!PersonContacts',
    'appImages'],
    function (React, mixins,
              Pix,
              PersonBasicInfo,
              PersonNotifications,
              PersonMessage,
              PersonMoreInfo,
              PersonWebId,
              PersonContacts,
              appImages) {

        var Person = React.createClass({
            mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
            componentName: "Person",

            getInitialState: function() {
                return {
                    editText:"Edit"
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

                    return (
                        <div id="profile" className="clearfix center">
                            <div className="edit-profile" onClick={this._handleClickEditButton}>{this.state.editText}</div>
                            <Pix src={this._getUserImg()}/>
                            <PersonBasicInfo
                                personPG={this.props.personPG}
                                modeEdit={this.props.modeEdit}
                                submitEdition={this._submitEdition}/>
                            <PersonNotifications personPG={this.props.personPG}/>
                            <PersonMessage personPG={this.props.personPG} />
                            <PersonMoreInfo
                                personPG={this.props.personPG}
                                modeEdit={this.props.modeEdit}
                                submitEdition={this._submitEdition}/>
                            <PersonWebId personPG={this.props.personPG}/>
                            <PersonContacts
                                personPG={this.props.personPG}
                                currentUserPG={this.props.currentUserPG}
                                onContactSelected={this.props.onContactSelected}
                                onAddContact={this.props.onAddContact}
                                onRemoveContact={this.props.onRemoveContact}
                            />
                        </div>
                        );
                }
            },

            _isInitialized: function() {
                return this.props.personPG
            },

            _handleClickEditButton: function(e) {
                e.preventDefault();

                if (this.props.modeEdit) {
                    // Submit changes from user edit.
                    this._submitEdition(this.props.personPG);
                }
                else {
                    // Change state of parent and current component to reflect edit mode.
                    this._updateEditMode(true, "save");
                }
            },

            _submitEdition: function(personPG) {
                // Submit changes.
                this.props.submitEdition(personPG);

                // Change state of parent and current component to reflect edit mode.
                this._updateEditMode(false, "edit");

                // And return false.
                return false;
            },

            _updateEditMode: function(bool, textOnButton) {
                // Change edit mode on the parent.
                this.props.handleClickChangeModeEdit(bool);

                // Change text on edit button.
                this.setState({
                    editText:textOnButton
                });

            },

            _getUserImg: function() {
                var personPGArray = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
                return foafUtils.getFirstValidImg(personPGArray) || appImages.avatar;
            }

        });

        return Person
    });