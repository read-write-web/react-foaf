/** @jsx React.DOM */

var PersonContactOnProfilePix = React.createClass({
    render: function() {
        var imgUrl = this.getUserImg();
        return (
            <div className="picture float-right">
                <img src={imgUrl} alt="Picture"/>
            </div>
            );
    },

	getUserImg: function() {
		var imgUrlList = foafUtils.getImg(this.props.personPGs);
		return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
	}


});

//<div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>