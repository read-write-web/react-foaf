/** @jsx React.DOM */

var Footer = React.createClass({
    // Render.
    render:function(){
        var self = this;
        //console.log('Render Footer')
        //console.log(this.props)

        var bool = ((this.props.properties.isCurrentTab) && (!this.props.properties.isDefaultTab));
        var show = {display: bool ? 'none' : 'block'};

        return (
            <li className="footer-item float-left" style={show} onClick={this._handleClick}>
                <Pix src={this._getUserImg()}/>
            </li>
        );
    },

    /*
     *  Start our own functions here.
     * */

    // Handlers.
    _handleClick: function() {
        this.props.maximizeTab(this.props.properties);
    },

    // Get image.
    _getUserImg: function() {
        return this._imageMap[this.props.properties.type](this.props.properties);
    },

    // Image depend on space type.
    _imageMap: {
        contacts: function(prop) {
            return "img/friends_icon_yellow.png";
        },
        person: function(prop) {
            var imgUrlList = foafUtils.getImg(prop.pointedGraphs);
            return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
        }
    }

});
