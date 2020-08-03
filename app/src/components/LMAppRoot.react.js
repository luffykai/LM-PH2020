'use strict';

function LMAppRoot() {
    return <div>LMAppRoot</div>;
}

let domContainer = document.querySelector('#lm_app_root');
ReactDOM.render(<LMAppRoot />, domContainer);
