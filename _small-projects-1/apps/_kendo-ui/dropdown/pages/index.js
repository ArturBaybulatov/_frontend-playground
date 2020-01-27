import './index.html';
import './index.less';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const fields = [
        { name: 'title', type: 'string', filterOperator: 'contains', isName: true },
        { name: 'id', type: 'number', filterOperator: 'eq', isId: true },
        { name: 'subtitle', type: 'string', filterOperator: 'contains' },
        { name: 'shareCount', type: 'number', filterOperator: 'eq' },
        { name: 'rating', type: 'number', filterOperator: 'eq' },
        { name: 'available', type: 'boolean', filterOperator: 'eq' },
    ];

    const nameField = ensure.plainObject(fields.find(x => x.isName === true));
    const idField = ensure.plainObject(fields.find(x => x.isId === true));


    const kSelect = ensure.jqElement($('[js-select]')).kendoDropDownList({
        dataTextField: nameField.name,
        dataValueField: idField.name,
        autoWidth: true,
        filter: 'contains', // Filters by `dataTextField`
    }).data('kendoDropDownList');

    kSelect.bind('change', () => log(kSelect.dataItem()));

    kSelect.wrapper.find('.k-select .k-icon.k-i-arrow-60-down').addClass('k-i-loading');

    setTimeout(function() {
        kSelect.setDataSource(generateData([nameField, idField], () => _.random(1, 5)));
        kSelect.wrapper.find('.k-select .k-icon.k-i-arrow-60-down').removeClass('k-i-loading');
    }, 2000);


    const kSelect2 = ensure.jqElement($('[js-select-2]')).kendoDropDownList({
        dataTextField: nameField.name,
        dataValueField: idField.name,
        dataSource: generateData(fields, () => _.random(1, 20)),
        autoWidth: true,
        height: 400,
        filter: 'contains', // This filter gets overridden

        filtering(evt) {
            evt.preventDefault();

            if (!_.isObject(evt.filter)) {
                this.dataSource.filter({});
                return;
            }

            const q = evt.filter.value;
            this.dataSource.filter({ logic: 'or', filters: fields.map(f => buildFilter(q, f)) });
        },

        template: `
            <div style="max-width: 800px, margin: 10px 0">
                ${fields.map(x => `<div>${x.name}: #: ${x.name} #</div>`).join('\n')}
            </div>
        `,
    }).data('kendoDropDownList');
};


const generateData = function(fields, wordCountFn) {
    ensure.nonEmptyArray(fields);
    ensure.maybe.function(wordCountFn);

    if (typeof wordCountFn !== 'function') wordCountFn = () => _.random(1, 20);

    const idField = fields.find(x => x.isId === true);

    return _(100).times(function() {
        const item = {};

        fields.forEach(function(f) {
            if (f.type === 'string') item[f.name] = util.lorem(1, wordCountFn());
            else if (f.type === 'number') item[f.name] = util.visuallyRandomNumber();
            else if (f.type === 'boolean') item[f.name] = _.sample([true, false]);
        });

        return item;

    }).uniqBy(idField.name).v;
};


const buildFilter = function(query, field) {
    ensure.string(query);
    ensure.plainObject(field);

    return { field: field.name, operator: field.filterOperator, value: query };
};


init();
