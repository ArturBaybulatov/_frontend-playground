import './index.html';
import './index.less';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug

const JQ_UI_SELECT_WIDTH = 250;


const init = function() {
    const $select = ensure.jqElement($('[js-select]'));
    $select.selectmenu({ width: JQ_UI_SELECT_WIDTH });

    $select.html($('<option>', { text: '', val: '' })).selectmenu('refresh');

    setTimeout(() => $select
        .html(['Foo', 'Bar', 'Baz'].map((x, i) => $('<option>', { text: x, val: i })))
        .selectmenu('refresh'), 1000);

    setTimeout(() => $select
        .html(['Lorem', 'Ipsum', 'Dolor'].map((x, i) => $('<option>', { text: x, val: i })))
        .selectmenu('refresh'), 3000);
};


init();
