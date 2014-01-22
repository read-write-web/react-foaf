/** @jsx React.DOM */

var PersonAddress = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "PersonAddress",

    getInitialState: function() {
        return {
            street: this.props.address.street,
            postalCode: this.props.address.postalCode,
            city: this.props.address.city,
            country: this.props.address.country
        }
    },

    render: function() {
        var address = this._getAddress();

        var viewTree =
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                {address.street}<br/>
                {address.postalCode}
                {address.city}<br/>
                {address.country}<br/>
                </div>
            </div>

        var viewTreeEdit =
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                    <form onSubmit={this._handleSubmit}>
                        <input id="street"
                        type="text"
                        defaultValue={address.street}
                        onChange={this._onChange}
                        />
                    </form> <br/>
                    <form onSubmit={this._handleSubmit}>
                        <input id="postalCode"
                        type="text"
                        defaultValue={address.postalCode}
                        onChange={this._onChange}
                        />
                    </form>
                    <form onSubmit={this._handleSubmit}>
                        <input id="city"
                        type="text"
                        defaultValue={address.city}
                        onChange={this._onChange}
                        />
                    </form><br/>
                    <form onSubmit={this._handleSubmit}>
                        <input id="country"
                        type="text"
                        defaultValue={address.country}
                        onChange={this._onChange}
                        />
                    </form><br/>
                </div>
            </div>

        // Return depending on the mode.
        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    _handleSubmit: function() {
        this.log('Submit')
        this.props.submitEdition(this.state);
        return false;
    },

    _onChange: function(e) {
        this._infoMap[e.target.id](e.target.value, this);
    },

    _getAddress: function() {
        var noValue = "...";

        // Format info if needed.
        var street = (this.state.street["1"] && this.state.street["1"].length>0)? this.state.street["1"][0]:noValue;
        var postalCode = (this.state.postalCode["1"] && this.state.postalCode["1"].length>0)? this.state.postalCode["1"][0]:noValue;
        var city = (this.state.city["1"] && this.state.city["1"].length>0)? this.state.city["1"][0]:noValue;
        var country = (this.state.country["1"] && this.state.country["1"].length>0)? this.state.country["1"][0]:noValue;

        return {
            street: street,
            postalCode: postalCode,
            city: city,
            country:country
        }
    },

    _infoMap: {
        street: function(value, ref) {
            ref.state.street["1"][0] = value;
            return ref.setState({street: ref.state.street});
        },
        postalCode: function(value, ref) {
            ref.state.postalCode["1"][0] = value;
            return ref.setState({postalCode: ref.state.postalCode});
        },
        city: function(value, ref) {
            ref.state.city["1"][0] = value;
            return ref.setState({city: ref.state.city});
        },
        country: function(value, ref) {
            ref.state.country["1"][0] = value;
            return ref.setState({country: ref.state.country});
        }
    }

});