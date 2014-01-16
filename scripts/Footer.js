/** @jsx React.DOM */

var Footer = React.createClass({

    // Render.
    render:function(){
        var self = this;
        console.log('Render Footer')
        console.log(this.props)

        var show = {display: (this.props.properties.isCurrentTab) ? 'none' : 'block'};

        return (
            <li className="footer-item float-left" style={show} onClick={this._handleClick}>
                <PersonPix getUserImg={this._getUserImg}/>
            </li>
        );
    },

    // Handler.
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
            return "img/friends_icon_blue.png";
        },
        person: function(prop) {
            var imgUrlList = foafUtils.getImg(prop.pointedGraphs);
            return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
        }
    }

});
