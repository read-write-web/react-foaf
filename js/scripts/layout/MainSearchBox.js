/** @jsx React.DOM */

define(['react', 'mixins', 'foafUtils', 'jsx!Pix','appImages'], function (React, mixins, foafUtils, Pix,appImages) {

    var MainSearchBox = React.createClass({
        mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
        componentName: "MainSearchBox",

        getInitialState: function() {
            return {text: this.props.filterText};
        },

        render: function() {
            return (
                <form id="search" onSubmit={this._handleSubmit}>
                    <button type="submit" class="stample" onClick={this._loadHome}></button>
                    <button type="submit" class="add"></button>
                    <input type="text"
                    placeholder="What are you looking for?"
                    value={this.state.text}
                    width="100"
                    ref="url"
                    onChange={this._onChange}
                    />
                    <button type="submit" class="apps"></button>
                    <button type="submit" class="world" ></button>
                    <button type="submit" class="favourites" onClick={this._loadProfileFromUrl} >
                        <Pix src={this._getUserImg()}/>
                    </button>
                </form>
                );
        },

        //
        _loadProfileFromUrl: function() {
            var profileURL = this.props.currentUserPG.getSymbolPointerUrl();
            this.props.loadCurrentUserProfileFromUrl(profileURL);
        },

        _loadHome: function() {
            this.props.loadHome();
        },

        /*
         * Handlers.
         * Use e.preventDefault() or return false to : Cancel browser default behavior of submit.
         * */
        _handleSubmit: function(e) {
            e.preventDefault();
            //this.props.onUserInput(this.state.text);
        },

        _onChange: function(e) {
            e.preventDefault();
            this.setState({text: e.target.value});
        },

        _getUserImg: function() {
            var personPG = this.props.currentUserPG; // TODO remove when possible
            return foafUtils.getFirstValidImg([personPG]) || appImages.avatar;
        }

    });

    return MainSearchBox;
});