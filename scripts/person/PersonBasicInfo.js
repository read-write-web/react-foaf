/** @jsx React.DOM */

var PersonBasicInfo = React.createClass({
    getInitialState: function() {
        return {
            name: this.props.basicInfo.name,
            givenname: this.props.basicInfo.givenname,
            company: this.props.basicInfo.workPlaceHomepage
        }
    },

    render: function() {
        // Get info.
        var info = this._getPersonInfo();

        // Define Html.
        var viewTree =
            <div className="basic">
                <div className="name title-case">{info.name}</div>
                <div className="surname title-case">{info.givenname}</div>
                <div className="company">{info.company}</div>
            </div>

        var viewTreeEdit =
            <div className="basic">
                <div className="name title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input id="name"
                        type="text"
                        defaultValue={info.name}
                        onChange={this._onChange}
                        />
                    </form>
                </div>
                <div className="surname title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input id="givenname"
                        type="text"
                        defaultValue={info.givenname}
                        onChange={this._onChange}
                        />
                    </form>
                </div>
                <div className="company">
                    <form onSubmit={this._handleSubmit}>
                        <input id="company"
                        type="text"
                        defaultValue={info.company}
                        onChange={this._onChange}
                        />
                    </form>
                </div>
            </div>

        // Return depending on the mode.
        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    /*
    *  Start our own functions here.
    * */

    _handleSubmit: function() {
        //this.props.submitEdition(this.state, this.props.basicInfo);
        this.props.submitEdition();
        return false;
    },

    _onChange: function(e) {
        this.props.updatePersonInfo(e.target.id, e.target.value);
        this._infoMap[e.target.id](e.target.value, this);
    },

    _getPersonInfo: function() {
        var noValue = "...";
        return {
            name: (this.state.name["1"] && this.state.name["1"].length>0)? this.state.name["1"][0]:noValue,
            givenname: (this.state.givenname["1"] && this.state.givenname["1"].length>0)? this.state.givenname["1"][0]:noValue,
            company: (this.state.company["1"] && this.state.company["1"].length>0)? this.state.company["1"][0]:noValue
        }
    },

    _infoMap: {
        name: function(value, ref) {
            ref.state.name["1"][0] = value;
            return ref.setState({name: ref.state.name});
        },
        givenname: function(value, ref) {
            ref.state.givenname["1"][0] = value;
            return ref.setState({givenname: ref.state.givenname});
        },
        company: function(value, ref) {
            ref.state.company["1"][0] = value;
            return ref.setState({company: ref.state.company});
        }
    }
});