import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    log(_.shuffle('abcdefghij'));
};


init();
