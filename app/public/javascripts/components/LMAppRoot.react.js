'use strict';

function LMAppRoot() {
    return React.createElement(
        'div',
        null,
        'LMAppRoot'
    );
}

let domContainer = document.querySelector('#lm_app_root');
ReactDOM.render(React.createElement(LMAppRoot, null), domContainer);