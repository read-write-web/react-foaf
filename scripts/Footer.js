/** @jsx React.DOM */

var Footer = React.createClass({
    getInitialState: function(){

    },

    handleClick: function() {
        console.log('handle click  footer')
        console.log(this.props.personPG)
        console.log(this.props.properties)
        this.props.maximizeTab(this.props.properties);
    },

    render:function(){
        console.log('render footer')
        console.log(this.props.personPG);

        var show = {
            display: (this.props.properties.isCurrentTab) ? 'none' : 'block'
        };

        var toPrint = this.props.properties.pointedGraphs[0]? this.props.properties.pointedGraphs[0].pointer.value : "noValue";

        return (
            <li className="footer-item float-left" style={show} onClick={this.handleClick}>{toPrint}</li>
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
