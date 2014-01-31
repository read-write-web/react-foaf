/**
* @jsx React.DOM
*/
require(['jsx!scripts/App'], function (App) {



    var appComponent =  <App />;
    var mountNode = document.getElementById('container');

    window.onload = function startApplication() {
        React.renderComponent(appComponent,mountNode);
    };
});