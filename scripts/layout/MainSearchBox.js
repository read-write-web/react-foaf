/** @jsx React.DOM */

var MainSearchBox = React.createClass({
    getInitialState: function() {
        return {text: this.props.filterText};
    },

    render: function() {
        return (
            <form id="search" onSubmit={this._handleSubmit}>
                <input type="text"
                placeholder="Search your contacts"
                value={this.state.text}
                width="100"
                ref="url"
                onChange={this._onChange}
                />
                <button type="submit"  class="fontawesome-ok"></button>
                <button type="submit" onClick={routeHelper.goToHome} class="fontawesome-ok">
                    <Pix src={this._getUserImg()}/>
                </button>
            </form>
            );
    },

     /*
     *  Start our own functions here.
     * */

     // Handlers.
     _handleSubmit: function(e) {
        //console.log("user submit !!!" + this.state.text);
        //this.props.onUserInput(this.state.text);
        return false; //don't send result to web server
    },

    _onChange: function(e) {
        //console.log("user input !!! : " + e.target.value);
        //this.props.onUserInput(e.target.value);
        this.setState({text: e.target.value});
    },

    // Get image.
    _getUserImg: function() {
        var imgUrlList = foafUtils.getImg(this.props.personPGs);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    }
});

