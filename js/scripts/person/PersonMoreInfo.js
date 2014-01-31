/** @jsx React.DOM */

define(['react', 'mixins'], function (React, mixins) {

var PersonMoreInfo = React.createClass({
    mixins: [mixins.WithLogger, mixins.WithLifecycleLogging, mixins.RdfLinkedPgMixin],
    componentName: "PersonMoreInfo",

    getInitialState: function() {
        return {
            personPG: undefined
        }
    },

    render: function() {
        var personPG = this.props.personPG; // // TODO: Test presence of PG.

        // Get info.
        var moreInfo = this._getMoreInfo();
        this.log(moreInfo)

        // Define Html.
        var viewTree;
        if (!this.props.modeEdit) {
            viewTree =
                <div id="details">
                    <div className="title center-text title-case">DETAILS</div>
                    <ul className="clearfix span3">
                        <li className="float-left">
                            <div className="email">
                                <div className="title-case">Email</div>
                                <div className="content email-content">{moreInfo["foaf:mbox"]}</div>
                            </div>
                            <div className="phone">
                                <div className="title-case">Phone</div>
                                <div className="content email-content">{moreInfo["foaf:phone"]}</div>
                            </div>
                        </li>
                        <li className="float-left">
                            <PersonAddress
                            modeEdit={this.props.modeEdit}
                            personPG={this.props.personPG}
                            address={this.props.address}/>
                        </li>
                        <li className="float-left">
                            <div className="website">
                                <div className="title-case">Website</div>
                                <div className="content website-content">
                                    <a href="https://stample.co" target="_blank">{moreInfo["foaf:homepage"]}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
        }
        else {
            viewTree =
                <div id="details">
                    <div className="title center-text title-case">DETAILS</div>

                    <ul className="clearfix span3">
                        <li className="float-left">
                            <div className="email">
                                <div className="title-case">Email</div>
                                <div className="content email-content">
                                    <form onSubmit={this._handleSubmit}>
                                        <input type="text"
                                        valueLink={this.linkToPgLiteral(personPG, 'foaf:mbox')} />
                                    </form>
                                </div>
                            </div>
                            <div className="phone">
                                <div className="title-case">Phone</div>
                                <div className="content email-content">
                                    <form onSubmit={this._handleSubmit}>
                                        <input type="text"
                                        valueLink={this.linkToPgLiteral(personPG, 'foaf:phone')} />
                                    </form>
                                </div>
                            </div>
                        </li>
                        <li className="float-left">
                            <PersonAddress
                            modeEdit={this.props.modeEdit}
                            personPG={this.props.personPG}
                            submitEdition={this.props.submitEdition}/>
                        </li>
                        <li className="float-left">
                            <div className="website">
                                <div className="title-case">Website</div>
                                <div className="content website-content">
                                    <form onSubmit={this._handleSubmit}>
                                        <input type="text"
                                        valueLink={this.linkToPgLiteral(personPG, 'foaf:homepage')} />
                                    </form>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
        }

        // Return.
        return viewTree;
    },

    _handleSubmit: function(e) {
        e.preventDefault();
        this.props.submitEdition(this.props.personPG);
    },

    _getMoreInfo: function() {
        var personPG = this.props.personPG;
        var emailList = foafUtils.getEmails([personPG]);
        var phoneList = foafUtils.getPhones([personPG]);
        var homepageList = foafUtils.getHomepages([personPG]);

        // Return.
        return {
            "foaf:mbox":emailList[0],
            "foaf:phone":phoneList[0],
            "foaf:homepage":homepageList[0]
        };
    }

});

    return PersonMoreInfo;
});