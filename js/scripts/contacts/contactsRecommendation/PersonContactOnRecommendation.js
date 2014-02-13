/** @jsx React.DOM */


define(['react', 'mixins', 'reactAddons', 'notify',
    'jsx!Pix',
    'jsx!Name',
    'jsx!Surname',
    'jsx!Company',
    'PGReact',
    'appImages',
    'appDefaultValues'
], function (React, mixins, ReactWithAddons, notify, Pix, Name, Surname, Company, PGReact, appImages, appDefaultValues) {

        var PersonContactOnRecommendation = React.createClass({
            mixins: [mixins.WithLogger, mixins.WithLifecycleLoggingLite],
            componentName: "PersonContactOnRecommendation",

            render: function() {
                var liClasses = ReactWithAddons.addons.classSet({
                    'contact': true,
                    'clearfix': true,
                    'float-left': true
                });

                // Return.
                return (
                    <li className={liClasses}>
                        <div className="loader"></div>
                        <Pix src={this._getUserImg()} className="float-right"/>
                        <div class="basic">
                            <Name name={this._getUserName()}/>
                            <Surname surname={this._getUserSurname()}/>
                            <Company company={this._getUserCompany()}/>
                        </div>
                        <div className="addAsContact" onClick={this._handleClick}><a href="#">Add as contact</a></div>
                    </li>
                    );
            },

            // TODO fixme HAfCK !!!
            // TODO fixme HACK !!!
            // TODO fixme HACK !!!
            // TODO fixme HACK !!!
            toPgArrayHack: function(pg) {
                return [pg];
            },

            _getUserImg: function() {
                var personPGArray = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
                return foafUtils.getFirstValidImg(personPGArray) || appImages.avatar;
            },

            _getUserName: function() {
                var personPGArray = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
                return foafUtils.getFirstValidName(personPGArray) || appDefaultValues.noValue
            },

            _getUserSurname: function() {
                var personPGArray = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
                return foafUtils.getFirstValidGivenName(personPGArray) || appDefaultValues.noValue
            },

            _getUserCompany: function() {
                var personPGArray = this.toPgArrayHack(this.props.personPG); // TODO remove when possible
                return foafUtils.getFirstValidworkplaceHomepage(personPGArray) || appDefaultValues.noValue
            },

            _handleClick: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var recommendedPGPointer = this.props.personPG.pointer;
                this.props.onAddContact(recommendedPGPointer);
            },
        });

        return PersonContactOnRecommendation;
    }
);