import './index.html';
import './index.less';


const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const arrays = [
        _.times(3, () => _.times(5, () => ({
            id: Number(_.uniqueId()),
            brand: util.lorem(1, _.random(1, 2)),
        }))),
    ];


    const $field = ensure.jqElement($('[js-field]'));

    const $results = ensure.jqElement($('[js-results]'));


    $field.on('input', function() {
        const $field = $(this);


        $results.empty();


        try { var query = ensure.nonEmptyString($field.val()) }
        catch (err) { return }


        const results = _.flattenDeep(arrays).filter(function(x) {
            return ensure.nonEmptyString(x.brand).toUpperCase().includes(query.toUpperCase());
        });

        $results.html(results.map(x => $('<div>', { text: x.brand, attr: { title: x.id, 'js-item': '' }, data: { item: x } })));
    });


    $results.on('click', '[js-item]', function() {
        toastr.info(JSON.stringify($(this).data('item')));
    });
};


init();
