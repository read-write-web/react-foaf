/** @jsx React.DOM */

var PersonMoreInfo = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "PersonMoreInfo",

    // TODO: described as bad practice to put props data in state
    getInitialState: function() {
        return {
            email: undefined,
            phone: undefined,
            homepage: undefined
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            email: _.first(nextProps.moreInfo.emails),
            phone: _.first(nextProps.moreInfo.phones),
            homepage: _.first(nextProps.moreInfo.homepages)
        });
    },

    render: function() {
        var self = this;

        // Define Html.
        var viewTree =
            <div id="details">
            <div className="title center-text title-case">DETAILS</div>
            <ul className="clearfix span3">
                <li className="float-left">
                    <div className="email">
                        <div className="title-case">Email</div>
                        <div className="content email-content">{this.state.email}</div>
                    </div>
                    <div className="phone">
                        <div className="title-case">Phone</div>
                        <div className="content email-content">{this.state.phone}</div>
                    </div>
                </li>
                <li className="float-left">
                    <PersonAddress
                        modeEdit={this.props.modeEdit}
                        personPG={this.props.personPG}
                        address={this.props.address}/>
                </li>
                <li className="float-left">
                    <div className="website">
                        <div className="title-case">Website</div>
                        <div className="content website-content">
                            <a href="https://stample.co" target="_blank">{this.state.homepage}</a>
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
                            defaultValue={this.state.email}
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
                                defaultValue={this.state.phone}
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
                        updatePersonInfo={this.props.updatePersonInfo}
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
                                    defaultValue={this.state.homepage}
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
        //this.props.submitEdition(this.state, this.props.moreInfo);
        this.props.submitEdition();
        return false;
    },

    _onChange: function(e) {
        this.props.updatePersonInfo(e.target.id, e.target.value);
        this._infoMap[e.target.id](e.target.value, this);
    },

    _infoMap: {
        email: function(value, ref) {
            return ref.setState({email: value});
        },
        phone: function(value, ref) {
            return ref.setState({phone: value});
        },
        homepage: function(value, ref) {
            return ref.setState({homepage: value});
        }
    }

});