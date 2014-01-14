/** @jsx React.DOM */

var Footer = React.createClass({
    getInitialState: function(){

    },

    handleClick: function() {
        this.props.maximizeTab(this.props.properties);
    },

    render:function(){
        // Check user and filter.
        var show = {
            display: (this.props.properties.isCurrentTab) ? 'none' : 'block'
        };

        return (
            <li className="footer-item" style={show} onClick={this.handleClick}></li>
            );
    }

    /*
    render:function(){
        return (
            <div className="footer">
               <div className="footer-handle center-text title-case">Navigation</div>
               <div className="footer-content">
				   <ul>
					   <li className="footer-item"></li>
					   <li className="footer-item"></li>
					   <li className="footer-item"></li>
				   </ul>
			   </div>
            </div>
            );
    }*/

});
