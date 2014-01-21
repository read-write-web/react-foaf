/** @jsx React.DOM */

var Footer = React.createClass({
    render: function() {
        var self = this;

        var activeTabs = this.props.activeTabs;
        var allTabs = this.props.tabs;
        var inactiveTabs = _.difference(allTabs,activeTabs);


        var desktop = <FooterItem imgSrc={'img/friends_icon_yellow.png'} onFooterItemClick={this.props.minimizeAllTabs}/>;
        var tabsFooterItems = _.map(allTabs, function(tab) {
            var img = self._getUserImg(tab.personPG);
            var onClick = self.props.onTabClicked.bind(this, tab.personURL);
            return <FooterItem imgSrc={img} onFooterItemClick={onClick}/>;
        })

        var footerItems = _.union([desktop],tabsFooterItems);


        return (
            <div className="footer">
                <div className="footer-handle center-text title-case">Navigation</div>
                <div className="footer-content">
                    <ul>{footerItems}</ul>
                </div>
            </div>);
    },


    // Get image.
    _getUserImg: function(pg) {
        console.log("In footer -> _getUserImg")
        var personPGArray = [pg]; // TODO should not be an array: hack
        var imgUrlList = foafUtils.getImg(personPGArray);
        return (imgUrlList && imgUrlList.length>0)? imgUrlList[0]:"img/avatar.png";
    }

});


var FooterItem = React.createClass({

    render: function() {
        return (
            <li className="footer-item float-left" onClick={this.props.onFooterItemClick}>
                <Pix src={this.props.imgSrc}/>
            </li>
            );
    }

});
