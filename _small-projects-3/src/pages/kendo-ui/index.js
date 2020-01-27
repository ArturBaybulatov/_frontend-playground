import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';

import * as kendoUtil from '../../lib/baybulatov-kendo-util-0.4.0-beta';
import '../../lib/baybulatov-kendo-util-0.4.0-beta/index.less';

import { id } from '../../modules/common';

import './index.html';
import './index.less';


const { ensure } = util;


const init = function() {
    const kExampleSelect = ensure.jqElement($('[js-example-select]')).kendoDropDownList({
        dataValueField: 'id',
        dataTextField: 'name',
        autoWidth: true,
        dataSource: generateData(),
    }).getKendoDropDownList();

    kExampleSelect.bind('change', () => toastr.info(null, 'Example select changed'));


    setTimeout(() => {
        kExampleSelect.setDataSource(generateData());
        kExampleSelect.select(0);
        kExampleSelect.trigger('change');
    }, 1000);


    const $openPopupBtn = ensure.jqElement($('[js-open-popup-btn]'));

    $openPopupBtn.on('click', () => {
        const kPopup = kendoUtil.popup({
            title: 'Lorem ipsum dolor sit amet',
            content: `<div class="pad">${ _.times(10, () => `<div class="bgap">${ util.lorem(1, _.random(50, 200)) }</div>`).join('') }</div>`,
            maxWidth: 800,
            maxHeight: 600,
            close: () => toastr.info(null, 'Popup closed'),

            actions: [
                { text: 'OK', primary: true, action: () => { toastr.info(null, 'OK button clicked'); kPopup.__destroy(); return false } },
                { text: 'Cancel' },
            ],
        }).open();
    });
};


const generateData = () => _.times(10, () => ({ id: id(), name: util.lorem(1, _.random(3, 5)) }));


init();
