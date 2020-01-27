import './index.html';

import { API_BASE_URL } from '../../variables.js';

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

        getNotesAsync(--currentPage)
            .always(kendoUtil.unblockUi)
            .catch(err => { ++currentPage; handleRejection("Couldn't get data")(err) })
            .then(items => renderTable(ensure.jqElement($('[js-table]')), items))
            .catch(console.error);
    });


    const $nextBtn = ensure.jqElement($('[js-next-btn]'));

    $nextBtn.on('click', function() {
        kendoUtil.blockUi();

        getNotesAsync(++currentPage)
            .always(kendoUtil.unblockUi)
            .catch(err => { --currentPage; handleRejection("Couldn't get data")(err) })
            .then(items => renderTable(ensure.jqElement($('[js-table]')), items))
            .catch(console.error);
    });


    const kCategorySelect = ensure.jqElement($('[js-category-select]')).kendoDropDownList({
        dataTextField: 'name',
        dataValueField: 'id',
        autoWidth: true,
        filter: 'contains',
    }).data('kendoDropDownList');

    kCategorySelect.bind('change', () => log(kCategorySelect.dataItem())); // Debug


    const $noteCreationForm = ensure.jqElement($('[js-note-creation-form]'));
    const $noteNameField = ensure.jqElement($noteCreationForm.find('[js-name-field]'));


    $noteCreationForm.on('submit', function($evt) {
        $evt.preventDefault();


        const $form = $(this);

        const $noteShareCountField = ensure.jqElement($form.find('[js-share-count-field]'));

        try {
            var newNoteData = {
                name: ensure.nonEmptyString($noteNameField.val()),
                share_count: ensure.nonNegativeInteger(Number(ensure.numeric($noteShareCountField.val()))),
                category_id: Number(ensure.numeric(kCategorySelect.value())),
            };
        } catch (err) {
            toastr.error(err.message, 'Please, check if fields are correctly filled in');
            $noteNameField.trigger('select');
            return;
        }


        kendoUtil.blockUi();

        createNoteAsync(newNoteData)
            .always(kendoUtil.unblockUi)

            .then(function(note) {
                toastr.success($('<div>', { text: JSON.stringify(note, null, 4), css: { whiteSpace: 'pre' } }), 'Item created');
                $form.trigger('reset');
                location.reload(); // TODO: Enhance
            })

            .catch(handleRejection("Couldn't create an item"));
    });


    kendoUtil.blockUi();

    $.when(getNotesAsync(currentPage), getCategoriesAsync(1))
        .always(kendoUtil.unblockUi)
        .catch(handleRejection("Couldn't get data"))

        .then(function(notes, categories) {
            log(notes);
            log(categories);

            renderTable(ensure.jqElement($('[js-table]')), notes);
            kCategorySelect.setDataSource(categories);
        })

        .catch(console.error);


    setTimeout(() => $noteNameField.trigger('select'), 100);
};


const getNotesAsync = function(page) {
    return $.when().then(function() {
        ensure.positiveInteger(page);

        return $.get(`${API_BASE_URL}/notes/?page=${page}&ordering=-id`)
            .catch(util.responseToError)
            .then(wrap => ensure.array(ensure.plainObject(wrap).results));
    });
};

const createNoteAsync = function(noteData) {
    return $.when().then(function() {
        try {
            ensure.nonEmptyString(global.login, global.password);
            var authHeader = `Basic ${btoa(`${global.login}:${global.password}`)}`;
        } catch (err) {
            var authHeader = '';
        };

        ensure.plainObject(noteData);

        return $.post({
            url: `${API_BASE_URL}/notes/`,
            headers: { 'Authorization': authHeader },
            data: noteData,
        })
            .catch(util.responseToError)
            .then(note => ensure.plainObject(note));
    });
};


init();
