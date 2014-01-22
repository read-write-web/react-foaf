/** @jsx React.DOM */

var PersonMoreInfo = React.createClass({
    getInitialState: function() {
        return {
            email: this.props.moreInfo.email,
            phone: this.props.moreInfo.phone,
            homepage: this.props.moreInfo.homepage
        }
    },

    render: function() {
        var self = this;

        // Get more info.
        var moreInfo = this._getMoreInfo();

        // Define Html.
        var viewTree =
            <div id="details">
            <div className="title center-text title-case">DETAILS</div>
            <ul className="clearfix span3">
                <li className="float-left">
                    <div className="email">
                        <div className="title-case">Email</div>
                        <div className="content email-content">{moreInfo.email}</div>
                    </div>
                    <div className="phone">
                        <div className="title-case">Phone</div>
                        <div className="content email-content">{moreInfo.phone}</div>
                    </div>
                </li>
                <li className="float-left">
                    <PersonAddress
                        modeEdit={this.props.modeEdit}
                        submitEdition={this.props.submitEdition}
                        personPG={this.props.personPG}
                        address={this.props.address}/>
                </li>
                <li className="float-left">
                    <div className="website">
                        <div className="title-case">Website</div>
                        <div className="content website-content">
                            <a href="https://stample.co" target="_blank">{moreInfo.homepage}</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        var viewTreeEdit =
            <div id="details">
            <div className="title center-text title-case">DETAILS</div>

            <ul className="clearfix span3">
                <li className="float-left">
                    <div className="email">
                        <div className="title-case">Email</div>
                        <div className="content email-content">
                        <form onSubmit={this._handleSubmit}>
                            <input id="email"
                            type="text"
                            defaultValue={moreInfo.email}
                            onChange={this._onChange}
                            />
                        </form>
                        </div>
                    </div>
                    <div className="phone">
                        <div className="title-case">Phone</div>
                        <div className="content email-content">
                            <form onSubmit={this._handleSubmit}>
                                <input id="phone"
                                type="text"
                                defaultValue={moreInfo.phone}
                                onChange={this._onChange}
                                />
                            </form>
                        </div>
                    </div>
                </li>
                <li className="float-left">
                    <PersonAddress
                        modeEdit={this.props.modeEdit}
                        submitEdition={this.props.submitEdition}
                        personPG={this.props.personPG}
                        address={this.props.address}/>
                </li>
                <li className="float-left">
                    <div className="website">
                        <div className="title-case">Website</div>
                        <div className="content website-content">
                                <form onSubmit={this._handleSubmit}>
                                    <input id="homepage"
                                    type="text"
                                    defaultValue={moreInfo.homepage}
                                    onChange={this._onChange}
                                    />
                                </form>

                        </div>
                    </div>
                </li>
            </ul>
        </div>

        // Return depending on the mode.
        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    _handleSubmit: function() {
        this.props.submitEdition(this.state, this.props.moreInfo);
        //this.props.submitEdition(this.state);
        return false;
    },

    _onChange: function(e) {
        this._infoMap[e.target.id](e.target.value, this);
    },

    _getMoreInfo: function() {
        var noValue = "...";

        // Format info if needed.
        var email = (this.state.email["1"] && this.state.email["1"].length>0)? this.state.email["1"][0]:noValue;
        if (email.indexOf("mailto:") != -1) email = email.split("mailto:")[1];

        var phone = (this.state.phone["1"] && this.state.phone["1"].length>0)? this.state.phone["1"][0]:noValue;
        if (phone.indexOf("tel:") != -1) phone = phone.split("tel:")[1];

        var homepage = (this.state.homepage["1"] && this.state.homepage["1"].length>0)? this.state.homepage["1"][0]:noValue;

        return {
            email: email,
            phone: phone,
            homepage: homepage
        }
    },

    _infoMap: {
        email: function(value, ref) {
            ref.state.email["1"][0] = value;
            return ref.setState({email: ref.state.email});
        },
        phone: function(value, ref) {
            ref.state.phone["1"][0] = value;
            return ref.setState({phone: ref.state.phone});
        },
        homepage: function(value, ref) {
            ref.state.homepage["1"][0] = value;
            return ref.setState({homepage: ref.state.homepage});
        }
    }
});