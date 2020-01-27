(function() {
    'use strict';

    var ensure = util.ensure;
    var isNumber = util.isNumber;
    var isPositive = util.isPositive;
    var isNumeric = util.isNumeric;
    var isNonEmptyString = util.isNonEmptyString;
    var isNonEmptyArray = util.isNonEmptyArray;
    var isNonEmptyJqCollection = util.isNonEmptyJqCollection;
    var handleRejection = util.handleRejection;
    var confirm = util.confirm;
    var popup = util.popup;
    var block = util.block;
    var unblock = util.unblock;

    var FieldTypes = common.FieldTypes;
    var SpecialFieldIds = common.SpecialFieldIds;
    var baseRenderer = common.baseRenderer;
    var renderSelect = common.renderSelect;
    var getErrorMessages = common.getErrorMessages;

    var GLOBAL_SHEET_ERROR_ID = -100;
    var FIXED_COLUMN_COUNT = 5;

    var $toolbar = ensure.jqElement($('[js-toolbar]'));


    var init = function() {
        var $window = $(window);

        $window.on('beforeunload', function() { return true }); // Confirm page leave


        var $document = $(document);

        $document.tooltip(); // Pretty jQuery UI tooltips


        var $tabWidget = ensure.jqElement($('[js-tab-widget]'));
        initTabWidget($tabWidget);


        $document.on('drag dragstart dragend dragover dragenter dragleave drop', function($evt) {
            $evt.preventDefault();
            $evt.stopPropagation();
        });

        var dragCounter = 0;

        $document.on('dragenter', function() {
            dragCounter++;
            block('Перетащите файл сюда');
        });

        $document.on('dragleave', function() {
            dragCounter--;

            if (dragCounter === 0)
                unblock();
        });

        $document.on('drop', function($evt) {
            var evt = $evt.originalEvent;
            dragCounter = 0;
            unblock();

            if (evt.dataTransfer.files.length !== 1) {
                toastr.error('Пожалуйста, перетащите один файл для импорта');
                return;
            }

            prepareToImportFromExcel($tabWidget, evt.dataTransfer.files[0]);
        });


        var $openSpecCreationPopupBtn = ensure.jqElement($toolbar.find('[js-open-spec-creation-popup-btn]'));

        $openSpecCreationPopupBtn.on('click', function() {
            var $popup = $('<div>', {
                class: 'popup-content popup-content--narrow',

                html: $('<div>', {
                    class: 'popup-content__flex-row',
                    html: $('<input>', { class: 'popup-content__field', attr: { 'js-preorders': '' } }),
                }),
            });

            popup('Создать спецификацию для предзаказа', $popup, {
                ok: function() {
                    var $preorders = ensure.jqElement($popup.find('[js-preorders]'));
                    var preorderIds = parsePreordersInputOrNull($preorders.val());

                    if (!isNonEmptyArray(preorderIds)) {
                        toastr.error('Пожалуйста, введите ID предзаказа(ов)');
                        return;
                    }

                    block();

                    createSpecsAsync(preorderIds)
                        .always(unblock)

                        .then(function(specs) {
                            renderSpecs(specs, $tabWidget, true);
                            $popup.dialog('close');
                        })

                        .catch(handleRejection('Извините, не удалось получить спецификации'));
                },
            });
        });


        var $openSpecSelectionPopupBtn = ensure.jqElement($toolbar.find('[js-open-spec-selection-popup-btn]'));

        $openSpecSelectionPopupBtn.on('click', function() {
            var $popup = $(ensure.jqElement($('[js-spec-selection-popup-tpl]')).html());

            popup('Открыть существующую спецификацию', $popup, {
                open: function() {
                    var $specsContainer = ensure.jqElement($popup.find('[js-specs-container]'));

                    var selectFields = [
                        { name: 'predorders', title: 'Предзаказы' },
                        { name: 'descr', title: 'Описание', width: 'wide' },
                        { name: 'dt', title: 'Дата', width: 'medium' },
                        { name: 'specification_uid', title: 'Идентификатор', width: 'medium' },
                    ];

                    block();

                    getSpecListAsync()
                        .always(unblock)

                        .then(function(specs) {
                            if (specs.length === 0) {
                                toastr.info('Нет спецификаций для данного поставщика');
                                return;
                            }

                            var slzSelect = renderSelect(
                                specs,
                                $specsContainer,
                                null,
                                'specification_uid',
                                'predorders',
                                null,
                                true,
                                selectFields,
                                'row',
                                'col'
                            );

                            slzSelect.open();
                        })

                        .catch(handleRejection('Извините, не удалось получить список спецификаций'));

                    var $specsBySupplierWidget = ensure.jqElement($popup.find('[js-specs-by-supplier-widget]'));

                    if (_.get(window, ['serverData', 'userIsWbManager']) === true)
                        $specsBySupplierWidget.show();

                    var $loadSpecListBtn = ensure.jqElement($popup.find('[js-load-spec-list-btn]'));

                    $loadSpecListBtn.on('click', function() {
                        var $supplierId = ensure.jqElement($popup.find('[js-supplier-id]'));
                        var supplierId = $supplierId.val();

                        if (!isNumeric(supplierId)) {
                            toastr.error('Пожалуйста, введите ID поставщика, состоящий из цифр');
                            return;
                        }

                        renderSelect([], $specsContainer);
                        block();

                        getSpecListAsync(supplierId)
                            .always(unblock)

                            .then(function(specs) {
                                if (specs.length === 0) {
                                    toastr.info('Нет спецификаций для данного поставщика');
                                    return;
                                }

                                var slzSelect = renderSelect(
                                    specs,
                                    $specsContainer,
                                    null,
                                    'specification_uid',
                                    'predorders',
                                    null,
                                    true,
                                    selectFields,
                                    'row',
                                    'col'
                                );

                                slzSelect.open();
                            })

                            .catch(handleRejection('Извините, не удалось получить список спецификаций'));
                    });
                },

                ok: function() {
                    var $specsContainer = ensure.jqElement($popup.find('[js-specs-container]'));
                    var slzSpecs = ensure.object($specsContainer.data('slzSelect'));
                    var guid = slzSpecs.getValue();

                    if (!isNonEmptyString(guid)) {
                        toastr.error('Пожалуйста, выберите спецификацию');
                        return;
                    }

                    block();

                    getSpecAsync(guid)
                        .always(unblock) // Important: Comes before popup closing

                        .then(function(spec) {
                            renderSpecs(spec, $tabWidget);
                            $popup.dialog('close');
                        })

                        .catch(handleRejection('Извините, не удалось получить спецификации'));
                },
            });
        });


        var $loadSpecBtn = ensure.jqElement($toolbar.find('[js-load-spec-btn]'));

        $loadSpecBtn.on('click', function() {
            if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]'))) {
                toastr.error('Пожалуйста, создайте спецификацию или откройте существующую');
                return;
            }

            var $tabView = getActiveTab($tabWidget);
            var spec = ensure.plainObject($tabView.data('spec'));

            spec = JSON.parse(JSON.stringify(spec)); // Clone

            spec.Data = ungroupSpecItemsByFieldIds(spec.Data);

            confirm(
                'Вкладка будет закрыта. Вы уверены, что хотите отправить спецификацию на проверку?',

                function() {
                    block();

                    sendSpecAsync(spec)
                        .always(unblock)

                        .then(function(spec) {
                            if (isNonEmptyArray(spec.Errors)) {
                                toastr.error('Выявлены ошибки на стадии предварительной проверки');
                                renderSheet(spec, $tabView);
                            } else {
                                toastr.success('Спецификация успешно отправлена на проверку');
                                removeTab($tabWidget, $tabView.attr('id'));
                            }
                        })

                        .catch(handleRejection('Не удалось отправить спецификацию'));
                }
            );
        });


        var $jumpToNextErrBtn = ensure.jqElement($toolbar.find('[js-jump-to-next-err-btn]'));

        $jumpToNextErrBtn.on('click', function() {
            if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]'))) {
                toastr.error('Пожалуйста, создайте спецификацию или откройте существующую');
                return;
            }

            var $tabView = getActiveTab($tabWidget);
            jumpToNextErr($tabView, $jumpToNextErrBtn);
        });


        var $importFromExcelBtn = ensure.jqElement($toolbar.find('[js-import-from-excel-btn]'));
        var $importFromExcelFileField = ensure.jqElement($toolbar.find('[js-import-from-excel-file-field]'));

        $importFromExcelBtn.on('click', function() { $importFromExcelFileField.click() });

        $importFromExcelFileField.on('change', function() {
            var file = this.files[0];

            if (!_.isObject(file)) {
                toastr.error('Пожалуйста, выберите файл для импорта');
                return;
            }

            prepareToImportFromExcel($tabWidget, file);
            $(this).val(null);
        });


        var $exportToExcelBtn = ensure.jqElement($toolbar.find('[js-export-to-excel-btn]'));

        $exportToExcelBtn.on('click', function() {
            if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]'))) {
                toastr.error('Пожалуйста, создайте спецификацию или откройте существующую');
                return;
            }

            var $tabView = getActiveTab($tabWidget);
            var spec = ensure.plainObject($tabView.data('spec'));
            spec = JSON.parse(JSON.stringify(spec)); // Clone
            spec.Data = ungroupSpecItemsByFieldIds(spec.Data);
            block();

            getExcelFileFromJsonAsync(spec)
                .always(unblock)

                .then(function(file) {
                    $window.off('beforeunload');

                    var fileUrl = URL.createObjectURL(file);

                    //location.href = fileUrl; // Init download directly

                    var templateName = ensure.nonEmptyString(spec.Template.Name);
                    var fileName = templateName + '-' + moment().format('YYYY-MM-DDThh_mm_ss') + '.xlsx';

                    var $popup = $('<div>', {
                        class: 'l-row popup-content popup-content--narrow',

                        html: $('<a>', {
                            text: fileName,
                            attr: { href: fileUrl, download: fileName },
                            css: { color: 'blue' },
                        }),
                    });

                    popup('Скачать', $popup, {
                        close: function() {
                            $window.on('beforeunload', function() { return true });
                            URL.revokeObjectURL(fileUrl);
                        },
                    });
                })

                .catch(handleRejection('Не удалось экспортировать таблицу в файл Excel'));
        });


        var $toggleColumnFixChk = ensure.jqElement($toolbar.find('[js-toggle-column-fix-chk]'));

        $toggleColumnFixChk.on('change', function() {
            if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]')))
                return;

            var $tabView = getActiveTab($tabWidget);
            var htSheet = ensure.object($tabView.data('htSheet'));

            htSheet.updateSettings({
                fixedColumnsLeft: $(this).is(':checked') ? FIXED_COLUMN_COUNT : null,
            });
        });


        $window.on('resize', _.throttle(function() {
            if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]')))
                return;

            var $tabView = getActiveTab($tabWidget);
            var htSheet = ensure.object($tabView.data('htSheet'));
            htSheet.render();
        }, 500));


        (function debug() {
            //var preorderIds = [264641];
            //
            //createSpecsAsync(preorderIds)
            //    .then(function(specs) { renderSpecs(specs, $tabWidget, true) })
            //    .catch(handleRejection('Извините, не удалось получить спецификации'));
            //
            //var specGuids = [
            //    '5c0c313a-8753-48fa-9634-ee403ca2e7ee', // Big one
            //    '453e9c4b-e617-411e-9f81-c02f1ff49f10',
            //    'dd357b3d-1f3b-4c11-a05c-46946d444c84',
            //    '7e46aa64-74f2-4a8d-8056-009295077c3a',
            //    'd9d314e3-a76b-4b9b-9d26-de8fa4469edc',
            //];
            //
            //specGuids.forEach(function(guid) {
            //    getSpecAsync(guid)
            //        .then(function(spec) { renderSpecs(spec, $tabWidget) })
            //        .catch(handleRejection('Не удалось получить спецификацию'));
            //});
        }());
    };


    var initTabWidget = function($tabWidget) {
        ensure.jqElement($tabWidget);

        var $tabBar = ensure.jqElement($tabWidget.find('[js-tab-bar]'));
        ensure($tabBar.children(':not([js-tab-btn])').length === 0, 'Invalid tab widget structure');

        var $tabOutlet = ensure.jqElement($tabWidget.find('[js-tab-outlet]'));
        ensure($tabOutlet.children(':not([js-tab-view])').length === 0, 'Invalid tab widget structure');

        $tabWidget.tabs({
            event: 'mousedown',

            activate: function() {
                if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]')))
                    return;

                var $tabView = getActiveTab($tabWidget);
                var htSheet = $tabView.data('htSheet');

                if (!_.isObject(htSheet))
                    return;

                htSheet.render();

                var $toggleColumnFixChk = ensure.jqElement($toolbar.find('[js-toggle-column-fix-chk]'));
                var fixedColumnCount = htSheet.getSettings('fixedColumnsLeft').fixedColumnsLeft;
                $toggleColumnFixChk.prop('checked', isPositive(fixedColumnCount));
            },
        });

        $tabBar.on('mouseenter', '[js-tab-close-btn]', function() { $(this).switchClass('ui-icon-close', 'ui-icon-circle-close', 0) });
        $tabBar.on('mouseleave', '[js-tab-close-btn]', function() { $(this).switchClass('ui-icon-circle-close', 'ui-icon-close', 0) });

        $tabBar.on('click', '[js-tab-close-btn]', function() {
            var anchorHref = ensure.nonEmptyString($(this).closest('[js-tab-btn-anchor]').attr('href'));
            var tabId = anchorHref.replace(/^#/, '');

            confirm('Не отправленные изменения пропадут. Всё равно закрыть вкладку?', function() {
                removeTab($tabWidget, tabId);
            });
        });
    };

    var appendNewTab = function($tabWidget, title) {
        ensure.jqElement($tabWidget);

        var tabId = util.randomIdent();

        var $tabBtn = $(ensure.jqElement($('[js-tab-btn-tpl]')).html());

        var $tabBtnAnchor = ensure.jqElement($tabBtn.find('[js-tab-btn-anchor]'));
        $tabBtnAnchor.attr('href', '#' + tabId);

        var $tabTitle = ensure.jqElement($tabBtnAnchor.find('[js-tab-title]'));
        $tabTitle.text(title);
        $tabTitle.on('mousedown', function($evt) { $evt.which === 2 && $evt.stopPropagation() }); // Prevent middle-click tab activation

        var $tabCloseBtn = ensure.jqElement($tabBtnAnchor.find('[js-tab-close-btn]'));
        $tabCloseBtn.on('mousedown', function($evt) { $evt.stopPropagation() }); // Prevent tab activation

        var $tabBar = ensure.jqElement($tabWidget.find('[js-tab-bar]'));
        $tabBar.append($tabBtn);

        var $tabOutlet = ensure.jqElement($tabWidget.find('[js-tab-outlet]'));
        var $tabView = $('<div>', { class: 'tab-widget__tab-view', attr: { id: tabId }, 'js-tab-view': '' });
        $tabOutlet.append($tabView);

        $tabWidget.tabs('refresh').tabs('option', 'active', $tabBtn.index());

        return $tabView;
    };

    var getActiveTab = function($tabWidget) {
        ensure.jqElement($tabWidget);
        var activeTabIndex = ensure.number($tabWidget.tabs('option', 'active'));
        var $tabViews = ensure.nonEmptyJqCollection($tabWidget.find('[js-tab-view]'));
        var $tabView = ensure.jqElement($tabViews.eq(activeTabIndex));
        return $tabView;
    };

    var removeTab = function($tabWidget, tabId) {
        ensure.jqElement($tabWidget);
        ensure(isNonEmptyString(tabId) || isNumber(tabId), 'Non-empty string or number expected');

        var $tabBtnAnchor = ensure.jqElement($tabWidget.find('[js-tab-btn-anchor][href="#' + tabId + '"]'));
        var $tabBtn = ensure.jqElement($tabBtnAnchor.closest('[js-tab-btn]'));
        var tabActive = $tabWidget.tabs('option', 'active') === $tabBtn.index();
        var tabCount = $tabWidget.find('[js-tab-btn]').length;
        var needToActivateNextTab = tabActive && tabCount !== 0;

        if (needToActivateNextTab)
            var nextActiveTabIndex = $tabBtn.index() - 1 < 0 ? 0 : $tabBtn.index() - 1;

        var $tabView = ensure.jqElement($tabWidget.find('#' + tabId));

        $.when($tabBtn.fadeOut(), $tabView.fadeOut()).then(function() {
            $tabBtn.remove();
            $tabView.remove();

            $tabWidget.tabs('refresh');

            if (needToActivateNextTab)
                $tabWidget.tabs('option', 'active', nextActiveTabIndex);
        });
    };


    var createSpecsAsync = function(preorderIds) {
        return $.when().then(function() {
            ensure.nonEmptyArray(preorderIds);

            return $.get('new/' + preorderIds.join(',')).then(function(res) {
                ensure.plainObject(res);
                ensure(res.ResultCode === 0, res.Message);
                return ensure.array(res.Data);
            });
        });
    };

    var getSpecAsync = function(guid) {
        return $.when().then(function() {
            ensure.nonEmptyString(guid);

            return $.get('specdata/' + guid).then(function(res) {
                ensure.plainObject(res);
                ensure(res.ResultCode === 0, res.Message);
                return ensure.plainObject(res.Data);
            });
        });
    };

    var getSpecListAsync = _.memoize(function(supplierId) {
        ensure.maybe.numeric(supplierId);

        var url = isNumeric(supplierId) ? 'speclist/' + supplierId : 'speclist/';

        return $.get(url).then(function(res) {
            ensure.plainObject(res);
            ensure(res.ResultCode === 0, res.Message);
            return ensure.array(res.Data);
        });
    });

    var sendSpecAsync = function(spec) {
        return $.when().then(function() {
            ensure.plainObject(spec);

            return $.post({
                url: 'load',
                data: JSON.stringify(spec),
                contentType: 'application/json; charset=utf-8',
                processData: false,
            })
                .then(function(res) {
                    ensure.plainObject(res);
                    ensure(res.ResultCode === 0, res.Message);
                    return ensure.plainObject(res.Data);
                });
        });
    };


    var prepareToImportFromExcel = function($tabWidget, file) {
        ensure.jqElement($tabWidget);
        ensure.object(file);

        if (!isNonEmptyJqCollection($tabWidget.find('[js-tab-view]'))) {
            toastr.error('Пожалуйста, создайте спецификацию или откройте существующую');
            return;
        }

        var $tabView = getActiveTab($tabWidget);
        var spec = ensure.plainObject($tabView.data('spec'));
        spec = JSON.parse(JSON.stringify(spec)); // Clone
        spec.Data = ungroupSpecItemsByFieldIds(spec.Data);

        confirm('Вы уверены, что хотите импортировать файл "' + file.name + '"?', function() {
            block();

            importFromExcelAsync(spec, file)
                .always(unblock)

                .then(function(spec) {
                    toastr.success('Импорт файла успешно завершён');
                    renderSheet(spec, $tabView);
                })

                .catch(handleRejection('Не удалось импортировать файл'));
        });
    };

    var importFromExcelAsync = function(spec, file) {
        return $.when().then(function() {
            ensure.plainObject(spec);
            ensure.object(file);

            var formData = new FormData();

            formData.append('spec', JSON.stringify(spec));
            formData.append('fileInput', file);

            return $.post({
                url: 'import',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
            })
                .then(function(res) {
                    ensure.plainObject(res);
                    ensure(res.ResultCode === 0, res.Message);
                    return ensure.plainObject(res.Data);
                });
        });
    };

    var getExcelFileFromJsonAsync = function(spec) {
        return $.when().then(function() {
            ensure.plainObject(spec);

            return $.post({
                url: 'export',
                data: JSON.stringify(spec),
                contentType: 'application/json; charset=utf-8',
                processData: false,
                cache: false,
                xhr: function() { var xhr = new XMLHttpRequest(); xhr.responseType = 'blob'; return xhr },
            })
                .then(function(file) { return ensure.object(file) });
        });
    };


    var groupSpecItemsByFieldIds = function(specItems) {
        ensure.array(specItems);

        return specItems.map(function(item) {
            ensure.array(item);

            var groupedItems = _.keyBy(item, 'FieldId');

            Object.keys(groupedItems).forEach(function(key) {
                var item = ensure.plainObject(groupedItems[key]);
                item._initialValue = item.Value;
                delete item.FieldId;
            });

            return groupedItems;
        });
    };

    var ungroupSpecItemsByFieldIds = function(specItems) {
        ensure.array(specItems);

        return specItems.map(function(item) {
            ensure.object(item);

            return Object.keys(item).map(function(key) {
                ensure.numeric(key);
                var field = ensure.plainObject(item[key]);
                delete field._initialValue;
                field.FieldId = Number(key);
                return field;
            });
        });
    };


    var prepareSpecFields = function(fields, highlightable) {
        ensure.array(fields);
        ensure.maybe.boolean(highlightable);

        fields.forEach(function(f) {
            f.highlightable = highlightable;
            f.data = f.Id + '.Value';
            f.title = f.Name;
            //f.title = f.Name + ' (kind: ' + f.Kind + ', ID: ' + f.Id + ')'; // Debug
            f.readOnly = f.IsReadonly;

            if (f.Id === SpecialFieldIds.DIRECTIONS)
                f.type = 'custom.directions';
            else if (f.Id === SpecialFieldIds.RUS_SIZE)
                f.type = 'custom.rus-size';
            else if (f.Kind === FieldTypes.CHOICE)
                f.type = 'custom.choice';
            else if (f.Kind === FieldTypes.MULTIPLE_CHOICE)
                f.type = 'custom.multiple-choice';
            else if (f.Kind === FieldTypes.MULTI_KEY_VALUE)
                f.type = 'custom.multi-key-value';
        });
    };


    var renderSpecs = function(specs, $tabWidget, areNewSpecs) {
        if (_.isPlainObject(specs))
            specs = [specs];

        ensure.array(specs);
        ensure.jqElement($tabWidget);
        ensure.maybe.boolean(areNewSpecs);

        specs.forEach(function(spec) {
            ensure.plainObject(spec);
            var tplName = ensure.nonEmptyString(_.get(spec, ['Template', 'Name']));
            var $tabView = appendNewTab($tabWidget, tplName);
            $tabView.data('isNewSpec', areNewSpecs);
            renderSheet(spec, $tabView);
        });
    };

    var renderSheet = function(spec, $tabView) {
        ensure.plainObject(spec);
        ensure.array(spec.Data, spec.Fields);
        ensure.jqElement($tabView);

        $tabView.data('spec', spec);

        spec.Data = groupSpecItemsByFieldIds(spec.Data);
        prepareSpecFields(spec.Fields, $tabView.data('isNewSpec'));

        var $sheet = $('<div>', { class: 'tab-widget__sheet' }); // Creating a new sheet is important
        $tabView.html($sheet);

        var htSheet = new Handsontable($sheet.get(0), {
            data: spec.Data,
            columns: spec.Fields,
            renderer: baseRenderer,
            manualColumnResize: true,
            modifyColWidth: function(width) { if (width > 300) return 300 },
            maxRows: spec.Data.length,
            wordWrap: false,
            currentRowClassName: 'u-highlighted',

            contextMenu: {
                items: {
                    remove_row: {
                        name: 'Удалить строку', callback: function() {
                            var htSheet = this;
                            var indexes = ensure.nonEmptyArray(htSheet.getSelected());

                            confirm('Удалить строку и её данные безвозвратно?', function() {
                                htSheet.alter('remove_row', indexes[0]);
                            });
                        },
                    },
                },
            },
        });

        $tabView.data('htSheet', htSheet);

        var $toggleColumnFixChk = ensure.jqElement($toolbar.find('[js-toggle-column-fix-chk]'));
        $toggleColumnFixChk.prop('checked', false);

        if (isNonEmptyArray(spec.Errors))
            var errorMessages = getErrorMessages(GLOBAL_SHEET_ERROR_ID, spec.Errors);

        //var errorMessages = _.times(_.random(1, 5), function() { return util.lorem(_.random(1, 2), _.random(5, 20)) }); // Debug

        if (isNonEmptyArray(errorMessages)) {
            var $globalSheetErrors = $('<div>', { class: 'tab-widget__global-errors' });
            renderGlobalSheetErrors(errorMessages, $globalSheetErrors, htSheet);
            $tabView.prepend($globalSheetErrors);
            htSheet.render();
        }

        return htSheet;
    };

    var renderGlobalSheetErrors = function(errorMessages, $globalSheetErrors, htSheet) {
        ensure.nonEmptyArray(errorMessages);
        ensure.jqElement($globalSheetErrors);
        ensure.object(htSheet);

        var $errorList = $('<div>', {
            html: errorMessages.map(function(msg) {
                return $('<div>', { class: 'tab-widget__global-error', text: msg });
            }),
        });

        var $toggleGlobalErrorsBtn = $('<a>', { href: '#', text: 'Скрыть', class: 'tab-widget__toggle-global-errors-btn' });

        var errorListHidden;

        $toggleGlobalErrorsBtn.on('click', function($evt) {
            $evt.preventDefault();

            if (errorListHidden) {
                $toggleGlobalErrorsBtn.text('Скрыть');
                $errorList.stop().slideDown().promise().then(function() { htSheet.render() });
                errorListHidden = false;
            } else {
                $toggleGlobalErrorsBtn.text('Показать');
                $errorList.stop().slideUp().promise().then(function() { htSheet.render() });
                errorListHidden = true;
            }
        });

        return $globalSheetErrors.html([
            $('<h2>', {
                class: 'tab-widget__global-errors-heading',

                html: [
                    $('<span>', { text: 'Общие ошибки' }),
                    $('<span>', { class: 'spacer' }),
                    $toggleGlobalErrorsBtn,
                ],
            }),

            $errorList,
        ]);
    };


    var parsePreordersInputOrNull = function(val) {
        if (val == null || typeof val !== 'string')
            return null;

        return val
            .split(',')

            .map(function(s) {
                s = s.trim();

                if (isNumeric(s))
                    return s;
            })

            .filter(function(s) { return s != null });
    };


    var findNextErrCell = function(spec, fromRowIndex, fromColIndex) {
        for (var i = fromRowIndex; i < spec.Data.length; i++) {
            var groupedItemPairs = _.toPairs(spec.Data[i]);

            for (var j = fromColIndex; j < groupedItemPairs.length; j++) {
                var pair = groupedItemPairs[j];

                if (isNumber(pair[1].ErrorId))
                    return { rowIndex: i, colIndex: j, prop: pair[0] + '.Value' };
            }

            return findNextErrCell(spec, i + 1, 0);
        }
    };

    var jumpToNextErr = function($tabView, $jumpToNextErrBtn) {
        ensure.jqElement($tabView, $jumpToNextErrBtn);

        if (!isNumber($tabView.data('nextErrRowIndex')))
            $tabView.data('nextErrRowIndex', 0);

        if (!isNumber($tabView.data('nextErrColIndex')))
            $tabView.data('nextErrColIndex', 0);

        var spec = ensure.plainObject($tabView.data('spec'));
        var errCell = findNextErrCell(spec, $tabView.data('nextErrRowIndex'), $tabView.data('nextErrColIndex'));

        if (!_.isPlainObject(errCell)) {
            toastr.info('Вы достигли конца таблицы. Поиск начнётся сначала');

            $jumpToNextErrBtn.prop('disabled', true);
            setTimeout(function() { $jumpToNextErrBtn.prop('disabled', false) }, 1000);

            $tabView.data({ nextErrRowIndex: 0, nextErrColIndex: 0 });
            return;
        };

        $tabView.data({ nextErrRowIndex: errCell.rowIndex, nextErrColIndex: errCell.colIndex + 1 });
        var htSheet = ensure.object($tabView.data('htSheet'));
        htSheet.selectCellByProp(errCell.rowIndex, errCell.prop);
    };


    init();
}());
