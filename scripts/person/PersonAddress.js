/** @jsx React.DOM */

var PersonAddress = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "PersonAddress",

    getInitialState: function() {
        return {
            "contact:street": this.props.address["contact:street"],
            "contact:postalCode": this.props.address["contact:postalCode"],
            "contact:city": this.props.address["contact:city"],
            "contact:country": this.props.address["contact:country"]
        }
    },

    render: function() {
        // Get info of address.
        var address = this._getAddress();

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
                        <input id="contact:street"
                        type="text"
                        defaultValue={address["contact:street"]}
                        onChange={this._onChange}
                        />
                    </form> <br/>
                    <form onSubmit={this._handleSubmit}>
                        <input id="contact:postalCode"
                        type="text"
                        defaultValue={address["contact:postalCode"]}
                        onChange={this._onChange}
                        />
                    </form>
                    <form onSubmit={this._handleSubmit}>
                        <input id="contact:city"
                        type="text"
                        defaultValue={address["contact:city"]}
                        onChange={this._onChange}
                        />
                    </form><br/>
                    <form onSubmit={this._handleSubmit}>
                        <input id="contact:country"
                        type="text"
                        defaultValue={address["contact:country"]}
                        onChange={this._onChange}
                        />
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

    _onChange: function(e) {
        var id = e.target.id;
        var oldValue = this.props.address[id][0];
        var newValue = e.target.value;
        this.props.updatePersonInfo(id, newValue, oldValue);
        this._addressMap[id](e.target.value, this);
    },

    _getAddress: function() {
        var noValue = "...";
        return {
            "contact:street": (this.state["contact:street"] && this.state["contact:street"].length>0)? this.state["contact:street"][0]:noValue,
            "contact:postalCode": (this.state["contact:postalCode"] && this.state["contact:postalCode"].length>0)? this.state["contact:postalCode"][0]:noValue,
            "contact:city":  (this.state["contact:city"] && this.state["contact:city"].length>0)? this.state["contact:city"][0]:noValue,
            "contact:country": (this.state["contact:country"] && this.state["contact:country"].length>0)? this.state["contact:country"][0]:noValue
        }
    },

    _addressMap: {
        "contact:street": function(value, ref) {
            ref.state["contact:street"][0] = value;
            return ref.setState({"contact:street": ref.state["contact:street"]});
        },
        "contact:postalCode": function(value, ref) {
            ref.state["contact:postalCode"][0] = value;
            return ref.setState({"contact:postalCode": ref.state["contact:postalCode"]});
        },
        "contact:city": function(value, ref) {
            ref.state["contact:city"][0] = value;
            return ref.setState({"contact:city": ref.state["contact:city"]});
        },
        "contact:country": function(value, ref) {
            ref.state["contact:country"][0] = value;
            return ref.setState({"contact:country": ref.state["contact:country"]});
        }
    }

});