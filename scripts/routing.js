/*
function bindRouterToState(component) {
    var router = Router({
        '/': component.setState.bind(component, {nowShowing: ALL_TODOS}),
        '/active': component.setState.bind(component, {nowShowing: ACTIVE_TODOS}),
        '/completed': component.setState.bind(component, {nowShowing: COMPLETED_TODOS}),
        '/books/view/:bookId': function(bookId) {
            console.log("viewBook: bookId is populated: " + bookId);
        };
    });
    router.init();
}
*/