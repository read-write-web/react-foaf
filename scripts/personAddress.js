/** @jsx React.DOM */

var PersonAddress = React.createClass({

    render: function() {
        console.log("Render person Address");
        var address = this.props.getAddress();
        return (
            <div className="address">
                <div className="title-case">Address</div>
                <div className="content address-content">
                {address.street}<br/>
                {address.postalCode}
                {address.city}<br/>
                {address.country}<br/>
                </div>
            </div>
            );
    }
});