/** @jsx React.DOM */


define(['react', 'mixins','appImages'], function (React, mixins, appImages) {

    var PersonContactOnProfilePix = React.createClass({

        render: function() {
            return (
                <div className="picture float-right">
                    <img src={this._getUserImg()} alt="Picture"/>
                </div>
                );
        },

        _getUserImg: function() {
            var personPGArray = this.props.personPG; // TODO remove when possible, this is an array :(
            return foafUtils.getFirstValidImg(personPGArray) || appImages.avatar;
        }

    });

    return PersonContactOnProfilePix;
});
