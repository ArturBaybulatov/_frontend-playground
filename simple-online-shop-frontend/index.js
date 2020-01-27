(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;
    var handleRejection = util.handleRejection;


    var main = function() {
        var currentNotesPage = 1;

        renderNotesAsync(currentNotesPage)
            .catch(handleRejection("Couldn't render notes"));

        var $pagination = ensure.jqElement($('[js-pagination]'));
        var $page = ensure.jqElement($pagination.find('[js-page]'));

        var $nextBtn = ensure.jqElement($pagination.find('[js-next-btn]'));

        $nextBtn.on('click', function() {
            renderNotesAsync(++currentNotesPage)
                .then(function() { $page.text(currentNotesPage) })

                .catch(function(err) {
                    toastr.error("Couldn't render notes", err.message);
                    currentNotesPage--;
                    $page.text(currentNotesPage);
                });
        });

        var $prevBtn = ensure.jqElement($pagination.find('[js-prev-btn]'));

        $prevBtn.on('click', function() {
            if (currentNotesPage === 1) {
                toastr.info("Can't go before the first page");
                return;
            }

            renderNotesAsync(--currentNotesPage)
                .then(function() { $page.text(currentNotesPage) })

                .catch(function(err) {
                    toastr.error("Couldn't render notes", err.message);
                    currentNotesPage++;
                    $page.text(currentNotesPage);
                });
        });
    };


    var renderNotesAsync = function(pageNum) {
        return $.when().then(function() {
            ensure.number(pageNum);

            return getNotesAsync(pageNum)
                .then(function(notes) {
                    if (notes.length === 0) {
                        toastr.info('There are no notes');
                        return;
                    }

                    var fields = [
                        { name: 'id', caption: 'ID', type: 'number' },
                        { name: 'name', caption: 'Name', type: 'string' },
                        { name: 'private', caption: 'Private', type: 'boolean' },
                        { name: 'share_count', caption: 'Share count', type: 'number' },
                    ];

                    var $notesTable = ensure.jqElement($('[js-notes-table]'));
                    drawNotes(notes, fields, $notesTable);
                });
        });
    };


    var getNotesAsync = function(pageNum) {
        return $.when().then(function() {
            ensure.number(pageNum);

            return $.get('/notes/' + '?page=' + pageNum).then(function(res) {
                ensure.plainObject(res);
                var notes = res.results;
                ensure.array(notes);
                return notes;
            });
        });
    };


    var drawNotes = function(notes, fields, $notesTable) {
        ensure.nonEmptyArray(notes, fields);
        ensure.jqElement($notesTable);

        var $captions = ensure.jqElement($notesTable.find('[js-captions]'));

        $captions.html(fields.map(function(f) { return $('<th>', { text: f.caption }) }));

        var $filters = g.$filters = ensure.jqElement($notesTable.find('[js-filters]'));

        var fieldTypeToElementMap = {
            string: function() { return $('<input>') },
            number: function() { return $('<input>', { attr: { type: 'number' } }) },
            boolean: function() { return $('<input>', { attr: { type: 'checkbox' } }) },
            enum: function() { return $('<select>', { html: $('<option>') }) },
        };

        $filters.html(fields.map(function(f) {
            ensure.function(fieldTypeToElementMap[f.type]);
            var $element = ensure.jqElement(fieldTypeToElementMap[f.type]());
            $element.attr('name', f.name);
            return $('<th>', { html: $element })
        }));

        $filters.on('change', function($evt) {
            log(utilInspect($(this).find(':input').serializeArray()));
        });

        var $noteList = ensure.jqElement($notesTable.find('[js-note-list]'));

        $noteList.html(notes.map(function(note) {
            return $('<tr>', {
                html: fields.map(function(f) { return $('<td>', { text: note[f.name] }) }),
            });
        }));
    };


    main();
}());
