/** @jsx React.DOM */

var Space = React.createClass({
    getInitialState: function(){

    },

    render:function(){
        return (
                <div className="space center">
                    <div className="space-bar clearfix">
                        <div className="space-title float-left title-case">"Test Title"</div>
                        <ul className="space-tools float-right">
                            <li className="space-options"><i class="fa fa-cog"></i></li>
                            <li className="space-maximize"><i class="fa fa-plus-circle"></i></li>
                            <li className="space-minimize"><i class="fa fa-minus-circle"></i></li>
                            <li className="space-close"><i className="fa fa-times-circle"></i></li>
                        </ul>
                    </div>
                    <div className="space-content clearfix"></div>
                    <Person personPG={this.props.personPG} changeUser={this.props.changeUser}/>
                </div>
            );
    }
});