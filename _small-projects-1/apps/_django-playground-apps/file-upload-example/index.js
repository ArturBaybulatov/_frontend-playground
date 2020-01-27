(function() {
    'use strict';

    var log = _.unary(console.log); // Debug

    var ensure = util.ensure;
    var handleRejection = util.handleRejection;


    var init = function() {
        var $document = $(document);

        $document.on('drag dragstart dragend dragover dragenter dragleave drop', function($evt) {
            $evt.preventDefault();
            $evt.stopPropagation();
        });

        var dragCounter = 0;

        $document.on('dragenter', function() {
            dragCounter++;
            util.showOverlay('Drop files here');
        });

        $document.on('dragleave', function() {
            dragCounter--;

            if (dragCounter === 0)
                util.hideOverlay();
        });

        var $fileList = ensure.jqElement($('[js-file-list]'));
        var allImages = [];

        $document.on('drop', function($evt) {
            var evt = $evt.originalEvent;
            dragCounter = 0;
            util.hideOverlay();
            var files = Array.from(evt.dataTransfer.files);
            var images = files.filter(function(f) { return f.type.startsWith('image/') });

            if (images.length === 0) {
                toastr.error('Only images allowed');
                return;
            }

            if (files.length !== images.length)
                toastr.warning('Only images were chosen');

            [].push.apply(allImages, images);
            updateFileListHtml($fileList, allImages);
        });


        $fileList.on('click', '[js-remove-btn]', function() {
            var $file = $(this).closest('[js-file]');
            allImages.splice($file.index(), 1);
            updateFileListHtml($fileList, allImages);
        });


        var $filesField = ensure.jqElement($('[js-files-field]'));

        $filesField.on('change', function() {
            var files = Array.from(this.files);

            if (files.length === 0)
                return; // Tmp IE fix

            var images = files.filter(function(f) { return f.type.startsWith('image/') });

            if (images.length === 0) {
                toastr.error('Only images allowed');
                return;
            }

            if (files.length !== images.length)
                toastr.warning('Only images were chosen');

            [].push.apply(allImages, images);
            updateFileListHtml($fileList, allImages);
            $(this).val(null);
        });


        var $uploadBtn = ensure.jqElement($('[js-upload-btn]'));

        $uploadBtn.on('click', function() {
            //var $form = $('[js-form]').first();
            //var formData = new FormData($form.get(0));
            //formData.append('metadata', 'Some extra metadata');

            if (!util.isNonEmptyArray(allImages)) {
                toastr.error('Please, choose some files');
                return;
            }

            util.showOverlay('Uploading...');

            uploadFilesAsync(allImages)
                .always(util.hideOverlay)

                .then(function() {
                    allImages = [];
                    toastr.success('Files successfully uploaded');
                    updateFileListHtml($fileList, allImages);
                })

                .catch(handleRejection('File upload failed'));
        });
    };

    var uploadFilesAsync = function(files) {
        return $.when().then(function() {
            ensure.nonEmptyArray(files);

            var formData = files.reduce(function(formData, file) {
                ensure.object(file);
                formData.append(file.name, file);
                return formData;
            }, new FormData());

            formData.append('metadata', JSON.stringify({ a: 'foo', b: 'bar' }));

            return $.post({
                url: '/file-upload',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
            }).catch(util.responseToError);
        });
    };

    var updateFileListHtml = function($fileList, files) {
        ensure.jqElement($fileList);
        ensure.array(files);

        $fileList.html(files.map(function(file) {
            ensure.object(file);
            var url = URL.createObjectURL(file);
            var $item = $('<div>', { class: 'file-list__item', attr: { 'js-file': '' } });

            var $itemPreview = $('<span>', {
                class: 'file-list__item-preview',
                css: { backgroundImage: 'url("' + url + '")' },
            });

            setTimeout(function() { URL.revokeObjectURL(url) }, 1000); // Garbage-collect
            var $itemName = $('<span>', { text: file.name, class: 'file-list__item-name' });

            var $itemRemoveBtn = $('<span>', {
                class: 'file-list__item-remove-btn',
                attr: { 'js-remove-btn': '' },
                html: '&times;',
            });

            return $item.html([$itemPreview, spacer(), $itemName, spacer(), $itemRemoveBtn]);

            function spacer() { return $('<span>', { class: 'file-list__item-spacer' }) }
        }));
    };


    init();
}());
