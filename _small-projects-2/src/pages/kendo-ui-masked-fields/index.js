import './index.html';
import './index.less';


const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


kendo.bind(document.body);


const $numberInputs = ensure.nonEmptyJqCollection($('[js-number-input]'));
$numberInputs.val(1234567.89);
