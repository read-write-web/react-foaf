/** @jsx React.DOM */

var PersonContactOnProfilePix = React.createClass({
    render: function() {
        return (
            <div className="picture float-right">
                <img src={this._getUserImg()} alt="Picture"/>
            </div>
            );
    },

	_getUserImg: function() {
        var personPG = this.props.personPG; // TODO remove when possible
        var imgUrlList = foafUtils.getImg(personPG);
        if (!imgUrlList || imgUrlList.length == 0) return "img/avatar.png";
        var imgUrlListCheck = _.chain(imgUrlList)
            .filter(function(url) {
                // TODO: temporary, need to check the validity of img Url.
                return httpUtils.checkImgURL(url);
            })
            .value();
        return (imgUrlListCheck.length !== 0) ? imgUrlListCheck[0]:"img/avatar.png";
    }

});

//<div className="picture float-right"><img src="img/avatar.png" alt="Picture"/></div>