/** @jsx React.DOM */

var PersonWebId = React.createClass({

    render: function() {
        console.log('Render webId');
        var webId = this.props.getWebId();
        console.log(webId)
        return (
            <div id="webid" className="clearfix">
                <a href="https://edwardsilhol.com/me#card"><img src="img/webid.png" alt="Web ID logo" className="float-left"/></a>
                <div id="webid-address" class="float-left"><span className="title-case">Web ID </span> {webId.webId}</div>
            </div>
            );
    }
});