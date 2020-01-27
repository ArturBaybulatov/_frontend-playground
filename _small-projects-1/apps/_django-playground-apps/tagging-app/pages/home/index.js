import './index.html';
import './index.less';

import { API_BASE_URL } from '../../variables.js';

import '../../modules/common';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const SynonymNotFoundError = _.tap(function(msg) { this.message = msg }, Err => Err.prototype = Object.create(Error.prototype));
const TagNotFoundError = _.tap(function(msg) { this.message = msg }, Err => Err.prototype = Object.create(Error.prototype));


const init = function() {
    const $searchForm = ensure.jqElement($('[js-search-form]'));

    $searchForm.on('submit', function($evt) {
        $evt.preventDefault();

        const $searchField = ensure.jqElement($searchForm.find('[js-search-field]'));

        try {
            const searchText = ensure.nonEmptyString($searchField.val());
            var terms = ensure.nonEmptyArray(_.uniq(searchText.toLowerCase().split(/\s+/)));
        } catch (err) {
            toastr.error(err.message, "Couldn't obtain search terms");
            return;
        }


        const $noteCount = ensure.jqElement($('[js-note-count]'));
        const $noteList = ensure.jqElement($('[js-note-list]'));

        $noteCount.empty();
        $noteList.empty();


        kendoUtil.blockUi();

        findSynonymAsync(terms[0])
            .always(kendoUtil.unblockUi)

            .then(function(synonym) {
                kendoUtil.blockUi();

                return getTagForSynonym(synonym)
                    .always(kendoUtil.unblockUi)
                    .catch(handleRejection("Couldn't get a tag for a synonym"))

                    .then(function(tag) {
                        $searchField.val(tag.name);


                        kendoUtil.blockUi();

                        return getNotesAsync(tag)
                            .always(kendoUtil.unblockUi)
                            .catch(handleRejection("Couldn't get notes"))

                            .then(function({ notes, count }) {
                                $noteCount.text(`${count} item(s)`);
                                renderNotes($noteList, notes, [tag]);
                            })

                    });
            })

            .catch(function(err) {
                if (!(err instanceof SynonymNotFoundError)) handleRejection("Couldn't find a synonym")(err);


                kendoUtil.blockUi();

                return findTagAsync(terms[0])
                    .always(kendoUtil.unblockUi)
                    .catch(handleRejection("Couldn't find a tag"))

                    .then(function(tag) {
                        $searchField.val(tag.name);


                        kendoUtil.blockUi();

                        return getNotesAsync(tag)
                            .always(kendoUtil.unblockUi)
                            .catch(handleRejection("Couldn't get notes"))

                            .then(function({ notes, count }) {
                                $noteCount.text(`${count} item(s)`);
                                renderNotes($noteList, notes, [tag]);
                            });
                    });
            })

            .always(() => $searchField.trigger('select'))
            .catch(console.error);
    });


    (function debug() {
        const $searchField = ensure.jqElement($searchForm.find('[js-search-field]'));
        $searchField.val('mammal');
        $searchForm.trigger('submit');
    }/*()*/);
};


const findSynonymAsync = function(term) {
    return $.when().then(function() {
        ensure.nonEmptyString(term);

        return $.get(`${API_BASE_URL}/synonyms/?name=${term}`) // TODO: Include tag type
            .catch(util.responseToError)

            .then(function(wrap) {
                const synonyms = ensure.array(ensure.plainObject(wrap).results);
                if (synonyms.length === 0) throw new SynonymNotFoundError();
                return synonyms[0];
            });
    });
};


const findTagAsync = function(term) {
    return $.when().then(function() {
        ensure.nonEmptyString(term);

        return $.get(`${API_BASE_URL}/tags/?name=${term}`) // TODO: Include tag type
            .catch(util.responseToError)

            .then(function(wrap) {
                const tags = ensure.array(ensure.plainObject(wrap).results);
                if (tags.length === 0) throw new TagNotFoundError();
                return tags[0];
            });
    });
};


const getTagForSynonym = function(synonym) {
    return $.when().then(function() {
        ensure.plainObject(synonym, synonym.master);
        ensure.nonNegativeInteger(synonym.master.id);

        return $.get(`${API_BASE_URL}/tags/${synonym.master.id}/`)
            .catch(util.responseToError)
            .then(tag => ensure.plainObject(tag));
    });
};


const getNotesAsync = function(tag) {
    return $.when().then(function() {
        ensure.plainObject(tag);

        const params = $.param([
            { name: 'tags__lft__gte', value: tag.lft },
            { name: 'tags__rght__lte', value: tag.rght },
            { name: 'tags__tree_id', value: tag.tree_id },
        ]);

        return $.get(`${API_BASE_URL}/notes/?${params}`)
            .catch(util.responseToError)

            .then(function(wrap) {
                ensure.plainObject(wrap);
                return { notes: wrap.results, count: ensure.nonNegativeInteger(wrap.count) };
            });
    });
};

const renderNotes = function($noteList, notes, tags) {
    ensure.jqElement($noteList);
    ensure.array(notes, tags);

    log(notes);
    log(tags);

    return $noteList.html(notes.map(note => renderNote($('<div>', { class: 'bgap note' }), note, tags)));
};

const renderNote = function($note, note, searchTags) {
    ensure.jqElement($note);
    ensure.plainObject(note);
    ensure.array(searchTags);

    return $note.html([
        $('<div>', { class: 'note__name', text: note.name }),

        $('<div>', { class: 'tags-wrap', html: note.tags.map(function(noteTag) {
            const $tag = $('<span>', { text: noteTag.name, class: 'tag rgap-s' });

            searchTags.forEach(function(searchTag) {
                if (noteTag.id === searchTag.id)
                    $tag.addClass('tag--highlighted-heavy');
                else if (noteTag.tree_id === searchTag.tree_id && noteTag.lft >= searchTag.lft && noteTag.rght <= searchTag.rght)
                    $tag.addClass('tag--highlighted');
            });

            return $tag;
        }) }),
    ]);
};


init();
