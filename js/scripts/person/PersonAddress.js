/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var PersonAddress = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging, mixins.RdfLinkedPgMixin],
    componentName: "PersonAddress",

    getInitialState: function() {
        return {
            personPG: undefined
        }
    },

    render: function() {
        var personPG = this.props.personPG; // TODO: Test presence of PG.

        // Get info.
        var address = this._getAddress();
        this.log(address);

        // Define HTML.
        var viewTree;
        if (!this.props.modeEdit) {
            viewTree =
                <div className="address">
                    <div className="title-case">Address</div>
                    <div className="content address-content">
                        {address["contact:street"]}
                        <br/>
                        {address["contact:postalCode"]}
                        {address["contact:city"]}
                        <br/>
                        {address["contact:country"]}
                        <br/>
                    </div>
                </div>
        }
        else {
            viewTree =
                <div className="address">
                    <div className="title-case">Address</div>
                    <div className="content address-content">
                        <form onSubmit={this._handleSubmit}>
                            <input type="text" valueLink={this.linkToPgLiteral(personPG, 'contact:street')}/>
                        </form>
                        <br/>
                        <form onSubmit={this._handleSubmit}>
                            <input type="text" valueLink={this.linkToPgLiteral(personPG, 'contact:postalCode')}/>
                        </form>
                        <form onSubmit={this._handleSubmit}>
                            <input type="text" valueLink={this.linkToPgLiteral(personPG, 'contact:city')}/>
                        </form>
                        <br/>
                        <form onSubmit={this._handleSubmit}>
                            <input type="text" valueLink={this.linkToPgLiteral(personPG, 'contact:country')}/>
                        </form>
                        <br/>
                    </div>
                </div>
        }

        // Return.
        return viewTree;
    },

    /*
     *  Start our own functions here.
     * */
    _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition(this.props.personPG);
    },

    _getAddress: function(){
        var personPG = this.props.personPG;
        var streetList = foafUtils.getContactStreet([personPG]);
        var postalCodeList = foafUtils.getContactPostalCode([personPG]);
        var cityList = foafUtils.getContactCity([personPG]);
        var countryList = foafUtils.getContactCountry([personPG]);

        return {
            "contact:street": streetList[0],
            "contact:postalCode": postalCodeList[0],
            "contact:city": cityList[0],
            "contact:country": countryList[0]
        }
    }

});

    return PersonAddress;
});