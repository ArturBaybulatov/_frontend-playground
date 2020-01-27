import './index.html';
import './index.less';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const kDatepicker = ensure.jqElement($('[js-datepicker]')).kendoDatePicker({
        //format: 'dd.MM.yyyy', // Already set by localization
        dateInput: true,
        value: new Date(),
        min: new Date('2018-01-01'),
        max: new Date(),
    }).data('kendoDatePicker');

    kDatepicker.bind('change', function() { log(this.value()) });
};


init();
