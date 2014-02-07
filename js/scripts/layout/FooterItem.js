/** @jsx React.DOM */

define(['react', 'mixins', 'reactAddons', 'jsx!Pix','PGReact','appImages'], function (React, mixins, ReactWithAddons, Pix, PGReact, appImages) {

    var Footer = React.createClass({
        mixins: [mixins.WithLogger, mixins.WithLifecycleLogging],
        componentName: "Footer",

        render: function() {
            var self = this;

            var allTabs = this.props.tabs;
            var activeTabs = this.props.activeTabs;
            var minimizedTabs = _.difference(allTabs,activeTabs);
            var currentTab = _.first(activeTabs); // can be undefined if no active tab

            var desktopItem = <FooterItem key="desktopButton" imgSrc={appImages.friendIcon} onFooterItemClick={this.props.minimizeAllTabs}/>;

            var tabsFooterItems = _.map(allTabs, function(tab) {
                var img = self._getUserImg(tab.personPG);
                var onClick = function() {
                    self.props.onTabClicked(tab);
                };
                var active = _.contains(activeTabs,tab);
                var minimized = _.contains(minimizedTabs,tab);
                var current = (currentTab === tab);
                return <FooterItem key={PGReact.getPointerKeyForReact(tab.personPG)} imgSrc={img} onFooterItemClick={onClick} isActiveTab={active} isMinimizedTab={minimized} isCurrentTab={current} />;
            });

            var globalCloseItemArray = [];
            if ( !_.isEmpty(this.props.tabs) ) {
                var globalCloseItem = <FooterItem key="globalCloseButton" imgSrc={appImages.closeIcon} onFooterItemClick={this.props.closeAllTabs}/>;
                globalCloseItemArray.push(globalCloseItem);
            }


            var footerItems = _.union([desktopItem],tabsFooterItems,[globalCloseItemArray]);

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
            var personPGArray = [pg]; // TODO should not be an array: hack
            return foafUtils.getFirstValidImg(personPGArray) || appImages.avatar;
        }

    });


    var FooterItem = React.createClass({

        render: function() {
            var liClasses = ReactWithAddons.addons.classSet({
                'footer-item': true,
                'float-left': true,
                'minimized-tab': this.props.isMinimizedTab,
                'active-tab': this.props.isActiveTab,
                'current-tab': this.props.isCurrentTab
            });
            return (
                <li className={liClasses} onClick={this.props.onFooterItemClick}>
                    <Pix src={this.props.imgSrc}/>
                </li>
                );
        }

    });

    return Footer;
});