import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const $menus = ensure.jqCollection($('[js-menu]'));

    kendo.bind($menus);
};


init();
