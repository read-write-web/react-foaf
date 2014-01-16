/** @jsx React.DOM */

var PersonMoreInfo = React.createClass({
    render: function() {
        var self = this;
        var personPg = this.props.personPG;

        var moreInfo = this.props.getMoreInfo();
        return (
            <div id="details">
                <div className="title center-text title-case">DETAILS</div>

                <ul className="clearfix span3">
                    <li className="float-left">
                        <div className="email">
                            <div className="title-case">Email</div>
                            <div className="content email-content">{moreInfo.email}</div>
                        </div>
                        <div className="phone">
                            <div className="title-case">Phone</div>
                            <div className="content email-content">{moreInfo.phone}</div>
                        </div>
                    </li>
                    <li className="float-left">
                        <PersonAddress personPG={personPg} getAddress={this.props.getAddress}/>
                    </li>
                    <li className="float-left">
                        <div className="website">
                            <div className="title-case">Website</div>
                            <div className="content website-content">
                                <a href="https://stample.co" target="_blank">{moreInfo.homepage}</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            );
    }
});