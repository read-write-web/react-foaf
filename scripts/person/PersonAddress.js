/** @jsx React.DOM */

var PersonAddress = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging, RdfLinkedPgMixin],
    componentName: "PersonAddress",

    getInitialState: function() {
        return {
            personPGCopy: this.props.personPG
        }
    },

    render: function() {
        // Get info of address.
        var address = this._getAddress();
        this.log(address);

        var viewTree =
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                {address["contact:street"]}<br/>
                {address["contact:postalCode"]}
                {address["contact:city"]}<br/>
                {address["contact:country"]}<br/>
                </div>
            </div>

        var viewTreeEdit =
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'contact:street')}/>
                    </form> <br/>
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'contact:postalCode')}/>
                    </form>
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'contact:city')}/>
                    </form><br/>
                    <form onSubmit={this._handleSubmit}>
                        <input type="text" valueLink={this.linkToPgLiteral(this.state.personPGCopy, 'contact:country')}/>
                    </form><br/>
                </div>
            </div>

        // Return depending on the mode.
        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition();
    },

    _getAddress: function(){
        var personPG = this.props.personPG;
        var streetList = foafUtils.getContactStreet(personPG);
        var postalCodeList = foafUtils.getContactPostalCode(personPG);
        var cityList = foafUtils.getContactCity(personPG);
        var countryList = foafUtils.getContactCountry(personPG);

        return {
            "contact:street": streetList[0],
            "contact:postalCode": postalCodeList[0],
            "contact:city": cityList[0],
            "contact:country": countryList[0]
        }
    }

});