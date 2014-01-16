/** @jsx React.DOM */

var PersonBasicInfo = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            givenname: "",
            company: ""
        }
    },

    // Render.
    render: function() {
        // Get info.
        var names = this.props.getBasicInfo();

        var viewTree =
            <div className="basic">
                <div className="name title-case">{names.name}</div>
                <div className="surname title-case">{names.givenname}</div>
                <div className="company">{names.company}</div>
            </div>

        var viewTreeEdit =
            <div className="basic">
                <div className="name title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input id="name"
                        type="text"
                        />
                    </form>
                </div>
                <div className="surname title-case">
                    <form onSubmit={this._handleSubmit}>
                        <input id="givenname"
                        type="text"
                        defaultValue={names.givenname}
                        />
                    </form>
                </div>
                <div className="company">
                    <form onSubmit={this._handleSubmit}>
                        <input id="company"
                        type="text"
                        defaultValue={names.company}
                        />
                    </form>
                </div>
            </div>

        return (this.props.modeEdit)? viewTreeEdit: viewTree;
    },

    //onChange={this._onChange}

    _onChange: function(e) {
        console.log(e.target.id)
        this._infoMap[e.target.id](e.target.value, this);

        //this.setState({text: e.target.value});
        //this.props.onUserInput(e.target.value);s
    },

    _infoMap: {
        name: function(value, ref) {
            return ref.setState({name: value});
        },
        givenname: function(value, ref) {
            return ref.setState({test: value});
        },
        company: function(value, ref) {
            return ref.setState({test: value});
        }
    },
/*
    _onChange: function(e) {
        console.log("user input !!! : " + e.target.value);
        this.setState({text: e.target.value});
        this.props.onUserInput(e.target.value);
    },

    _onChange: function(e) {
        console.log("user input !!! : " + e.target.value);
        this.setState({text: e.target.value});
        this.props.onUserInput(e.target.value);
    }

*/

});