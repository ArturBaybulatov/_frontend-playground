import './index.html';

import { CSS_MOBILE_BREAKPOINT } from '../../variables.js';

import '../../modules/common'

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const $sidebar = ensure.jqElement($('[js-sidebar]'));

    $sidebar.append(_.range(50).map(() => $('<p>', { text: util.lorem(1, _.random(1, 5)) })));
    $sidebar.kendoResponsivePanel({ breakpoint: CSS_MOBILE_BREAKPOINT });


    const $content = ensure.jqElement($('[js-content]'));

    $content.append(_.times(10, () => $('<p>', { text: util.lorem() })));
};


init();
