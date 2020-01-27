import './index.html';
import './index.less';


import '../../lib/baybulatov-util-css-0.2.0-beta/index.less';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';
import '../../lib/baybulatov-util-js-0.7.0-beta/index.less';


const { ensure } = window.util_ = util;


const init = async () => {
    const fields = [
        { id: id(), name: 'brandName', title: 'brandName', type: 'string' },
        { id: id(), name: 'collectionName', title: 'collectionName', type: 'string' },
        { id: id(), name: 'currentDiscountByPromo', title: 'currentDiscountByPromo', type: 'number' },
        { id: id(), name: 'currentDiscountOnSite', title: 'currentDiscountOnSite', type: 'number' },
        { id: id(), name: 'daysOnSite', title: 'daysOnSite', type: 'number' },
        { id: id(), name: 'excessOfMarketInPercent', title: 'excessOfMarketInPercent', type: 'number' },
        { id: id(), name: 'excessOfMarketInPrice', title: 'excessOfMarketInPrice', type: 'number' },
        { id: id(), name: 'goodsLeftover', title: 'goodsLeftover', type: 'number' },
        { id: id(), name: 'necessaryDiscountForMarket', title: 'necessaryDiscountForMarket', type: 'number' },
        { id: id(), name: 'nmId', title: 'nmId', type: 'number' },
        { id: id(), name: 'retailPriceBeforeDiscount', title: 'retailPriceBeforeDiscount', type: 'number' },
        { id: id(), name: 'rivalLink', title: 'rivalLink', type: 'url' },
        { id: id(), name: 'rivalPriceAfterDiscount', title: 'rivalPriceAfterDiscount', type: 'number' },
        { id: id(), name: 'rivalPriceBeforeDiscount', title: 'rivalPriceBeforeDiscount', type: 'number' },
        { id: id(), name: 'sa', title: 'sa', type: 'string' },
        { id: id(), name: 'subjectName', title: 'subjectName', type: 'string' },
        { id: id(), name: 'wbPriceAfterOverallDiscount', title: 'wbPriceAfterOverallDiscount', type: 'number' },
    ];


    const supplierId = 25577;
    const date = new Date('2019-06-24');


    let data;

    try { util.showOverlay('Загрузка…'); data = await getMonitoringDataAsync(supplierId, date) }
    catch (err) { return toastr.error(err.message, 'Не удалось получить данные мониторинга') }
    finally { util.hideOverlay() }


    if (!util.isNonEmptyArray(data)) return toastr.info(null, 'Данных мониторинга нет');


    const $table = ensure.jqElement($('[js-table]'));


    renderTable($table, fields, data);


    let prevSortFieldId, prevSortOrder;

    $table.on('click', 'thead th', function() {
        const sortFieldId = ensure.positiveInteger($(this).data('fieldId'));
        const sortField = ensure.plainObject(fields.find(field => field.id === sortFieldId));

        const sortOrder = prevSortFieldId === sortField.id && prevSortOrder === 'asc' ? 'desc' : 'asc';

        renderTable($table, fields, data, sortField, sortOrder);

        prevSortFieldId = sortField.id;
        prevSortOrder = sortOrder;
    });
};


const getMonitoringDataAsync = (supplierId, date) => {
    return $.when().then(async () => {
        ensure.positiveInteger(supplierId);
        ensure.date(date);

        // const url = `${ API_BASE_URL }monitoring?date=${ util.formatDate(date) }`;
        const url = '/example-data.json'; // Debug

        const headers = { 'X-SupplierId': supplierId };

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network lag

        return $.get({ url, headers })
            .catch(util.responseToError)
            .then(data => ensure.maybe.array(data));
    });
};


const renderTable = ($table, fields, data, sortField, sortOrder) => {
    ensure.jqElement($table);
    ensure.nonEmptyArray(fields, data);
    ensure.maybe.plainObject(sortField);

    if (_.isPlainObject(sortField)) {
        ensure(['asc', 'desc'].includes(sortOrder), 'Valid sort order expected');
        data = sort(data, sortField, sortOrder);
    }

    const theadHtml = `
        <thead>
            <tr>
                ${ fields.map(field => `
                    <th class="clickable hoverable" data-field-id="${ field.id }">
                        ${ field.title }
                        ${ _.isPlainObject(sortField) && sortField.id === field.id ? (sortOrder === 'asc' ? '↑' : '↓') : '' }
                    </th>
                `) }
            </tr>
        </thead>
    `;

    const tbodyHtml = `
        <tbody>
            ${ data.map((item, i) => `
                <tr class="${ even(i) ? '-dark' : '' }">
                    ${ fields.map(field => renderFieldValue(item[field.name], field.type)) }
                </tr>
            `) }
        </tbody>
    `;

    $table.html([theadHtml, tbodyHtml]);
};


const renderFieldValue = (value, type) => {
    ensure.nonEmptyString(type);


    try {
        switch (type) {
            case 'string': return `<td>${ value }</td>`;
            case 'url': return `<td><a href="${ value }" target="_top">${ value }</a></td>`;
            case 'number': return `<td class="text-right">${ value.toLocaleString('ru') }</td>`;
            case 'date': return `<td>${ util.formatDateRu(value) }</td>`;
            case 'boolean': return `<td>${ value ? 'Да' : 'Нет' }</td>`;
            default: throw new Error('Unexpected field type');
        }
    }

    catch (err) {
        toastr.error(err.message, 'При построении таблицы произошла ошибка');
        return `<td style="color: red">${ value }</td>`;
    }
};


const sort = (data, field, order) => {
    ensure.nonEmptyArray(data);
    ensure.plainObject(field);
    ensure(['asc', 'desc'].includes(order), 'Valid sort order expected');


    try {
        switch (field.type) {
            case 'string':
            case 'url':
                return _.clone(data).sort((a, b) => {
                    const comparison = util.compareNatural(a[field.name], b[field.name]);
                    return order === 'asc' ? comparison : -comparison;
                });

            case 'number':
            case 'date':
            case 'boolean':
                return _.orderBy(data, field.name, order);

            default: throw new Error('Unexpected field type');
        }
    }

    catch (err) {
        toastr.error(err.message, 'При сортировке таблицы произошла ошибка');
        return _.clone(data);
    }
};


const id = () => Number(_.uniqueId());


const even = n => n % 2 === 0;


init();
