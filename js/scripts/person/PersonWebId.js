/** @jsx React.DOM */


define(['react', 'mixins', 'jsx!Pix','appImages'], function (React, mixins, Pix, appImages) {

var PersonWebId = React.createClass({

    render: function() {
        var webId = this._getWebId();
        return (
            <div id="webid" className="clearfix">
                <a href="https://edwardsilhol.com/me#card">
                    <Pix src={appImages.webIdIcon} alt="Web ID logo" className="float-left"/>
                </a>
                <div id="webid-address" class="float-left"><span className="title-case">Web ID </span> {webId.webId}</div>
            </div>
            );
    },

    _getWebId: function() {
        var value = this.props.personPG.pointer.value;
        return {
            webId:value
        };
    }
});

    return PersonWebId;

});