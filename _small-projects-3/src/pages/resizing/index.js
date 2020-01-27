import interact from 'interactjs';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';

import { id } from '../../modules/common';

import './index.html';
import './index.less';


const { ensure, ifThen } = util;


const API_BASE_URL = '...';


const init = async () => {
    const token = '...';


    let brands;

    try { util.showOverlay('Loading…'); brands = await getBrandsAsync(token) }
    catch (err) { return toastr.error(err.message, "Couldn't get brands") }
    finally { util.hideOverlay() }


    const fromDate = new Date('2019-07-01');
    const toDate = new Date('2019-07-31');


    let categories;

    try { util.showOverlay('Loading…'); categories = await getCategoriesAsync() }
    catch (err) { return toastr.error(err.message, "Couldn't get categories") }
    finally { util.hideOverlay() }


    let items;

    try { util.showOverlay('Loading…'); items = await getItemsAsync(fromDate, toDate, categories, brands) }
    catch (err) { return toastr.error(err.message, "Couldn't get items") }
    finally { util.hideOverlay() }


    const theadHtml = `
        <div class="row">
            <div class="${ _.sample('abcdefgh') } cell"></div>
            
            ${ util.mapPeriod(fromDate, toDate, date => `
                <div
                    class="${ _.sample('abcdefgh') } cell cell--heading ${ ifThen(dateFns.isSunday(date), 'rgap') }"
                    style="${ ifThen(dateFns.isWeekend(date), 'color: red;') }">
                        ${ util.formatDateHuman(date, true) }
                </div>
            `).join('') }
        </div>
    `;


    const tbodyHtml = categories.map(cat => `
        <div class="row" data-category-id="${ cat.id }" js-row>
            <div class="${ _.sample('abcdefgh') } cell cell--category">${ cat.name }</div>
            
            ${ util.mapPeriod(fromDate, toDate, date => `
                <div
                    class="${ _.sample('abcdefgh') } cell ${ ifThen(dateFns.isSunday(date), 'rgap') }"
                    data-date="${ util.formatDate(date) }"
                    js-cell>
                </div>
            `).join('') }
        </div>
    `).join('');


    const $container = ensure.jqElement($('[js-container]'));

    $container.html([theadHtml, tbodyHtml]);


    items.forEach(item => {
        const $row = $container.find(`[js-row][data-category-id="${ item.categoryId }"]`);
        const $beginCell = $row.find(`[js-cell][data-date="${ util.formatDate(item.beginDate) }"]`);

        $beginCell.html(`
            <div class="block" js-block data-id="${ item.id }">
                <div class="block__resizer" js-resizer data-resizer-side="left"></div>
                <div class="block__content" js-content></div>
                <div class="block__resizer" js-resizer data-resizer-side="right"></div>
            </div>
        `);

        updateItemBlock(item, $container, brands);
    });


    interact('[js-cell]').dropzone({
        accept: '[js-resizer], [js-block] [js-text]',

        ondragenter(evt) { $(evt.target).addClass('cell--highlighted') },
        ondragleave(evt) { $(evt.target).removeClass('cell--highlighted') },

        ondropdeactivate(evt) { $(evt.target).removeClass('cell--highlighted') },
    });

    interact('[js-resizer]').draggable({
        lockAxis: 'x',

        onstart(evt) {
            const $block = $(evt.target).closest('[js-block]');

            $block.addClass('block--opaque');


            $(window).on('keydown', $evt => {
                if ($evt.key !== 'Escape') return;

                evt.interaction.stop();
                $block.removeClass('block--opaque');
                const item = ensure.plainObject(items.find(item => item.id === $block.data('id')));
                updateItemBlock(item, $container, brands);
            });
        },

        onmove(evt) {
            const $resizer = $(evt.target);
            const $block = $resizer.closest('[js-block]');


            if ($resizer.data('resizerSide') === 'left') {
                $block.css('left', `${ $block.position().left + evt.dx }px`);
                $block.width($block.width() - evt.dx);
            }

            else if ($resizer.data('resizerSide') === 'right') {
                $block.width($block.width() + evt.dx);
            }
        },

        onend(evt) {
            const $resizer = $(evt.target);
            const $block = $resizer.closest('[js-block]');

            $block.removeClass('block--opaque');


            const item = ensure.plainObject(items.find(item => item.id === $block.data('id')));


            const $cell = $(evt.relatedTarget);

            if (!util.isJqElement($cell)) return updateItemBlock(item, $container, brands);


            if ($resizer.data('resizerSide') === 'left') {
                $cell.html($block);
                item.beginDate = dateFns.startOfDay(new Date($cell.data('date')));
            }

            else if ($resizer.data('resizerSide') === 'right') {
                item.endDate = dateFns.startOfDay(new Date($cell.data('date')));
            }


            if (util.isBeforeDay(item.endDate, item.beginDate)) item.endDate = item.beginDate;


            updateItemBlock(item, $container, brands);
        },
    });

    interact('[js-block] [js-text]').draggable({
        onstart(evt) {
            const $block = $(evt.target).closest('[js-block]');

            $block.addClass('block--opaque');


            $(window).on('keydown', $evt => {
                if ($evt.key !== 'Escape') return;

                evt.interaction.stop();
                $block.removeClass('block--opaque');
                const item = ensure.plainObject(items.find(item => item.id === $block.data('id')));
                updateItemBlock(item, $container, brands);
            });
        },

        onmove(evt) {
            const $block = $(evt.target).closest('[js-block]');
            const blockPos = $block.position();

            $block.css({ left: blockPos.left + evt.dx, top: blockPos.top + evt.dy });
        },

        onend(evt) {
            const $block = $(evt.target).closest('[js-block]');

            $block.removeClass('block--opaque');


            const item = ensure.plainObject(items.find(item => item.id === $block.data('id')));


            const $cell = $(evt.relatedTarget);

            if (!util.isJqElement($cell)) return updateItemBlock(item, $container, brands);


            $cell.html($block); // Move the block to a new cell


            const daysCount = util.mapPeriod(item.beginDate, item.endDate).length;

            item.beginDate = dateFns.startOfDay(new Date($cell.data('date')));
            item.endDate = dateFns.addDays(item.beginDate, daysCount - 1);

            updateItemBlock(item, $container, brands);
        },
    });


    $container.on('dblclick', '[js-cell]', function() {
        const $cell = $(this);

        if (util.isJqElement($cell.find('[js-block]'))) return;

        const $row = $cell.closest('[js-row]');

        const beginDate = new Date($cell.data('date'));

        const newItem = {
            id: id(),
            categoryId: $row.data('categoryId'),
            brandId: 777, // TODO
            beginDate,
            endDate: beginDate,
            name: util.formatPeriod(beginDate, beginDate),
        };

        items.push(newItem);

        $cell.html(`
            <div class="block" js-block data-id="${ newItem.id }">
                <div class="block__resizer" js-resizer data-resizer-side="left"></div>
                <div class="block__content" js-content></div>
                <div class="block__resizer" js-resizer data-resizer-side="right"></div>
            </div>
        `);

        updateItemBlock(newItem, $container, brands);

        $cell.find('[js-block]').trigger('click');
    });


    $container.on('click', '[js-block] [js-text]', function() {
        const $block = $(this).closest('[js-block]');

        const $blockContent = $block.find('[js-content]');

        const $input = $(`<input class="nopad! nogap!">`);

        $blockContent.html($input);


        const item = ensure.plainObject(items.find(item => item.id === $block.data('id')));
        const brand = ensure.plainObject(brands.find(brand => brand.id === item.brandId));

        const kBrandInput = $input.kendoAutoComplete({
            dataValueField: 'id',
            dataTextField: 'name',
            dataSource: brands,
            filter: 'contains',
            virtual: true,
            value: brand.name,
        }).getKendoAutoComplete();


        setTimeout(() => kBrandInput.element.focus().select(), 10);

        kBrandInput.bind('change', () => {
            if (_.isObject(kBrandInput.dataItem())) {
                const brand = kBrandInput.dataItem().toJSON();
                onFinishEditing(brand);
            }
        });

        kBrandInput.element.on('keydown', $evt => {
            if ($evt.key === 'Enter') {
                if (util.isJqElement(kBrandInput.list.find('.k-list li.k-state-focused'))) return;

                const brand = brands.find(brand => brand.name.trim().toUpperCase() === kBrandInput.value().trim().toUpperCase());
                if (_.isPlainObject(brand)) onFinishEditing(brand);
            }

            else if ($evt.key === 'Escape') {
                onFinishEditing();
            }
        });

        kBrandInput.element.on('blur', onFinishEditing);


        function onFinishEditing(brandOrBrandName) {
            kBrandInput.destroy();


            let brand;


            if (_.isPlainObject(brandOrBrandName)) brand = brandOrBrandName;

            else if (util.isNonEmptyString(brandOrBrandName))
                brand = brands.find(brand => brand.name.trim().toUpperCase() === brandOrBrandName.trim().toUpperCase());


            if (!_.isPlainObject(brand)) brand = brands.find(brand => brand.id === item.brandId);


            item.brandId = brand.id;
            $blockContent.html(`<div class="block__text" js-text>${ brand.name }</div>`);


            toastr.info(null, brand.name, { timeOut: 1000 });
        }
    });
};


const getBrandsAsync = token => {
    return new Promise(async (resolve, reject) => {
        try {
            ensure.nonEmptyString(token);

            const headers = { Authorization: `Bearer ${ token }` };
            const url = `${ API_BASE_URL }brands`;

            const brands = await $.get({ headers, url }).catch(util.responseToError);

            ensure.nonEmptyArray(brands);

            resolve(brands);
        }

        catch (err) { reject(err) }
    });
};


const getCategoriesAsync = () => {
    return new Promise((resolve, reject) => {
        try {
            const categories = _.times(10, () => ({
                id: id(),
                name: util.lorem(1, _.random(1, 2)),
            }));

            resolve(categories);
        }

        catch (err) { reject(err) }
    });
};


const getItemsAsync = (fromDate, toDate, categories, brands) => {
    return new Promise((resolve, reject) => {
        try {
            ensure.date(fromDate, toDate);
            ensure(util.isBeforeDay(fromDate, toDate) || dateFns.isSameDay(fromDate, toDate), 'Correct period expected');
            ensure.nonEmptyArray(categories, brands);

            const items = _.times(10, () => {
                let beginDate = util.randomDate(fromDate, toDate);
                let endDate = dateFns.addDays(beginDate, _.random(0, 4));

                while (util.isAfterDay(endDate, toDate)) endDate = dateFns.subDays(endDate, 1);

                return {
                    id: id(),
                    categoryId: _.sample(categories).id,
                    brandId: _.sample(brands).id,
                    beginDate,
                    endDate,
                };
            });

            resolve(items);
        }

        catch (err) { reject(err) }
    });
};


const updateItemBlock = (item, $container, brands) => {
    ensure.plainObject(item);
    ensure.jqElement($container);
    ensure.nonEmptyArray(brands);

    const $block = $container.find(`[js-block][data-id="${ item.id }"]`);

    const brand = ensure.plainObject(brands.find(brand => brand.id === item.brandId));

    $block.find('[js-content]').html(`<div class="block__text" js-text>${ brand.name }</div>`);

    const $row = $container.find(`[js-row][data-category-id="${ item.categoryId }"]`);

    const $beginCell = $row.find(`[js-cell][data-date="${ util.formatDate(item.beginDate) }"]`);
    const $endCell = $row.find(`[js-cell][data-date="${ util.formatDate(item.endDate) }"]`);

    $block.css({ left: 0, top: 0 });
    $block.width($endCell.offset().left + $endCell.width() - $beginCell.offset().left - 2);
};


init();
