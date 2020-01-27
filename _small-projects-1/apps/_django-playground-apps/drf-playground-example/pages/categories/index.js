import './index.html';

import {
    getCategoriesAsync,
    renderTable,
} from '../../modules/common';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    let currentPage = 1;


    const $prevBtn = ensure.jqElement($('[js-prev-btn]'));

    $prevBtn.on('click', function() {
        if (currentPage === 1) return;


        kendoUtil.blockUi();

        getCategoriesAsync(--currentPage)
            .always(kendoUtil.unblockUi)
            .catch(err => { ++currentPage; handleRejection("Couldn't get data")(err) })
            .then(items => renderTable(ensure.jqElement($('[js-table]')), items))
            .catch(console.error);
    });


    const $nextBtn = ensure.jqElement($('[js-next-btn]'));

    $nextBtn.on('click', function() {
        kendoUtil.blockUi();

        getCategoriesAsync(++currentPage)
            .always(kendoUtil.unblockUi)
            .catch(err => { --currentPage; handleRejection("Couldn't get data")(err) })
            .then(items => renderTable(ensure.jqElement($('[js-table]')), items))
            .catch(console.error);
    });


    kendoUtil.blockUi();

    getCategoriesAsync(currentPage)
        .always(kendoUtil.unblockUi)
        .catch(handleRejection("Couldn't get data"))
        .then(items => renderTable(ensure.jqElement($('[js-table]')), items))
        .catch(console.error);
};


init();
