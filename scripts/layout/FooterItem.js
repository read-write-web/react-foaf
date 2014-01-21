/** @jsx React.DOM */

// TODO, actually this is a FooterItem, and there is one per open tab

var FooterItem = React.createClass({
    // Render.
    render:function(){
        console.log('Render Footer')
        console.log(this.props)
        var show = {display: 'block'};

        return (
            <li className="footer-item float-left" style={show} onClick={this._handleClick}>
                <Pix src={this._getUserImg()}/>
            </li>
            );
    },


    // Handlers.
    _handleClick: function() {
        var personContactUrl = this.props.tab.personPG.pointer.value;
        routeHelper.visitProfile(personContactUrl);
    },


    // Get image.
    _getUserImg: function() {
        console.log("In footer -> _getUserImg")
        var personPGArray = [this.props.tab.personPG]; // TODO should not be an array: hack
        var imgUrlList = foafUtils.getImg(personPGArray);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    }


    // return "img/friends_icon_yellow.png";

});
