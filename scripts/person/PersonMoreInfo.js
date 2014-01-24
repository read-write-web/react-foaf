/** @jsx React.DOM */

var PersonMoreInfo = React.createClass({
    mixins: [WithLogger,WithLifecycleLogging],
    componentName: "PersonMoreInfo",

    // TODO: described as bad practice to put props data in state
    getInitialState: function() {
        return {
            "foaf:mbox": this.props.moreInfo["foaf:mbox"],
            "foaf:phone": this.props.moreInfo["foaf:phone"],
            "foaf:homepage": this.props.moreInfo["foaf:homepage"]
        }
    },

    render: function() {
        var self = this;

        // Get more info.
        var moreInfo = this._getMoreInfo();
        this.log(moreInfo)
        // Define Html.
        var viewTree =
            <div id="details">
            <div className="title center-text title-case">DETAILS</div>
            <ul className="clearfix span3">
                <li className="float-left">
                    <div className="email">
                        <div className="title-case">Email</div>
                        <div className="content email-content">{moreInfo["foaf:mbox"]}</div>
                    </div>
                    <div className="phone">
                        <div className="title-case">Phone</div>
                        <div className="content email-content">{moreInfo["foaf:phone"]}</div>
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
                            <a href="https://stample.co" target="_blank">{moreInfo["foaf:homepage"]}</a>
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
                            <input id="foaf:mbox"
                            type="text"
                            defaultValue={moreInfo["foaf:mbox"]}
                            onChange={this._onChange}
                            />
                        </form>
                        </div>
                    </div>
                    <div className="phone">
                        <div className="title-case">Phone</div>
                        <div className="content email-content">
                            <form onSubmit={this._handleSubmit}>
                                <input id="foaf:phone"
                                type="text"
                                defaultValue={moreInfo["foaf:phone"]}
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
                                    <input id="foaf:homepage"
                                    type="text"
                                    defaultValue={moreInfo["foaf:homepage"]}
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

    _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition();
    },

    _onChange: function(e) {
        var id = e.target.id;
        var oldValue = this.props.moreInfo[id][0];
        var newValue = e.target.value;
        this.props.updatePersonInfo(id, newValue, oldValue);
        this._infoMap[id](e.target.value, this);
    },

    _getMoreInfo: function() {
        var noValue = "...";
        return {
            "foaf:mbox": (this.state["foaf:mbox"] && this.state["foaf:mbox"].length>0)? this.state["foaf:mbox"][0]:noValue,
            "foaf:phone": (this.state["foaf:phone"] && this.state["foaf:phone"].length>0)? this.state["foaf:phone"][0]:noValue,
            "foaf:homepage": (this.state["foaf:homepage"] && this.state["foaf:homepage"].length>0)? this.state["foaf:homepage"][0]:noValue
        }
    },

    _infoMap: {
        "foaf:mbox": function(value, ref) {
            ref.state["foaf:mbox"][0] = value;
            return ref.setState({"foaf:mbox": ref.state["foaf:mbox"]});
        },
        "foaf:phone": function(value, ref) {
            ref.state["foaf:phone"][0] = value;
            return ref.setState({"foaf:phone": ref.state["foaf:phone"]});
        },
        "foaf:homepage": function(value, ref) {
            ref.state["foaf:homepage"][0] = value;
            return ref.setState({"foaf:homepage": ref.state["foaf:homepage"]});
        }
    }

});