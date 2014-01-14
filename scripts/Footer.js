/** @jsx React.DOM */

var Footer = React.createClass({
    getInitialState: function(){

    },

    render:function(){
        return (
            <div className="footer clearfix center">
                <div className="footer-bar">
                    <div className="footer-title float-left title-case">Title of the open window ...</div>
                    <ul className="footer-items float-right">
                        <li className="footer-item1"><i class="fa fa-plus-circle"></i></li>
                        <li className="footer-item2"><i class="fa fa-plus-circle"></i></li>
                    </ul>
                </div>
            </div>
            );
    }
});
